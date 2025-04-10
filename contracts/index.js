require("dotenv").config();
const express = require("express");
const { Web3 } = require("web3");
const abi = require("./abi.json");

// 1) Express 초기화
const app = express();
app.use(express.json());

// 2) Web3 & Contract 초기화
const web3 = new Web3(process.env.INFURA_URL);
const contract = new web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);

// 3) 전역 상태 관리 (개선됨)
// Mutex 클래스 구현 - 비동기 작업을 위한 락 메커니즘
class AsyncMutex {
  constructor() {
    this.locked = false;
    this.waitQueue = [];
  }

  async acquire() {
    if (!this.locked) {
      this.locked = true;
      return;
    }

    return new Promise((resolve) => {
      this.waitQueue.push(resolve);
    });
  }

  release() {
    if (this.waitQueue.length > 0) {
      const nextResolve = this.waitQueue.shift();
      nextResolve();
    } else {
      this.locked = false;
    }
  }

  async withLock(fn) {
    await this.acquire();
    try {
      return await fn();
    } finally {
      this.release();
    }
  }
}

// 트랜잭션 큐 관리
const transactionQueue = [];
const MAX_QUEUE_SIZE = 100;
const nonceMutex = new AsyncMutex();
let currentNonce = null;

// Gas 가격 관리 (개선됨)
const GAS_PRICE_CACHE_TIME = 60000; // 1분
let gasStats = {
  price: null,
  lastUpdate: 0,
  failedAttempts: 0, // 실패한 시도 횟수 추적
  baseMultiplier: 1.1, // 기본 승수
};

// --- 계정 확인 ---
async function checkAccounts() {
  try {
    const account = web3.eth.accounts.privateKeyToAccount(
      process.env.PRIVATE_KEY
    );
    console.log("Account from private key:", account.address);

    // 계정 검증 로직
    if (
      account.address.toLowerCase() !== process.env.OWNER_ADDRESS?.toLowerCase()
    ) {
      console.warn(
        "WARNING: Private key does not match the owner address in .env file!"
      );
    }

    // 잔액 확인
    const balance = await web3.eth.getBalance(account.address);
    console.log(
      `Balance of ${account.address}: ${web3.utils.fromWei(
        balance,
        "ether"
      )} MATIC`
    );

    return account;
  } catch (error) {
    console.error("Error checking accounts:", error);
    throw error;
  }
}

// --- 네트워크 동기화된 Nonce 획득 ---
async function syncNonce(fromAddress) {
  // 반드시 뮤텍스로 보호
  return nonceMutex.withLock(async () => {
    try {
      // 항상 네트워크에서 최신 nonce를 가져옴
      currentNonce = await web3.eth.getTransactionCount(fromAddress, "pending");
      console.log(`Nonce synchronized from network: ${currentNonce}`);
      return currentNonce;
    } catch (error) {
      console.error("Error syncing nonce:", error);
      throw error;
    }
  });
}

// --- 안전한 다음 Nonce 값 획득 ---
async function getNextNonce(fromAddress) {
  return nonceMutex.withLock(async () => {
    if (currentNonce === null) {
      currentNonce = await web3.eth.getTransactionCount(fromAddress, "pending");
      console.log(`Nonce initialized to: ${currentNonce}`);
    }
    console.log(`Using nonce: ${currentNonce}`);
    return currentNonce++;
  });
}

// --- 동적 Gas 가격 관리 ---
async function getDynamicGasPrice() {
  const now = Date.now();

  // 최근에 트랜잭션이 실패했다면 승수를 증가시킴
  const multiplier = Math.min(2.0, 1.1 + gasStats.failedAttempts * 0.1);

  // 캐시 시간이 지났거나 가격이 없는 경우 새로 가져옴
  if (!gasStats.price || now - gasStats.lastUpdate > GAS_PRICE_CACHE_TIME) {
    try {
      // 체인별로 다른 메소드 필요할 수 있음
      if (process.env.INFURA_URL.includes("polygon")) {
        // 폴리곤에서는 maxPriorityFeePerGas 최적화가 중요
        const feeData = await web3.eth.getBlock("pending");
        const baseFee = feeData.baseFeePerGas || (await web3.eth.getGasPrice());
        const priorityFee = BigInt(baseFee) / 10n; // 베이스 수수료의 10%

        gasStats.price = {
          maxFeePerGas: (
            (BigInt(baseFee) * BigInt(Math.floor(multiplier * 100))) /
            100n
          ).toString(),
          maxPriorityFeePerGas: priorityFee.toString(),
        };
      } else {
        // 이더리움 및 기타 체인용
        const gasPrice = await web3.eth.getGasPrice();
        gasStats.price = {
          gasPrice: (
            (BigInt(gasPrice) * BigInt(Math.floor(multiplier * 100))) /
            100n
          ).toString(),
        };
      }

      gasStats.lastUpdate = now;
      console.log(
        `Updated gas price with multiplier ${multiplier}:`,
        gasStats.price
      );
    } catch (error) {
      console.error("Error fetching gas price:", error);
      // 오류 발생시 기본값으로 대체
      if (!gasStats.price) {
        gasStats.price = { gasPrice: "20000000000" }; // 기본 20 Gwei
      }
    }
  }

  return gasStats.price;
}

// --- 트랜잭션 전송 (개선됨) ---
async function sendTx(method, options = {}) {
  try {
    const account = await checkAccounts();
    const fromAddress = account.address;

    // Nonce 값 획득 (옵션으로 Nonce를 전달받을 수 있음)
    const nonce = options.nonce || (await getNextNonce(fromAddress));
    console.log(`Using nonce: ${nonce}`);

    // Gas 추정
    const gasEstimate = await method.estimateGas({ from: fromAddress });
    console.log(`Gas estimate: ${gasEstimate}`);

    // 잔액 확인
    const balance = await web3.eth.getBalance(fromAddress);
    console.log(
      `Account balance: ${web3.utils.fromWei(balance, "ether")} MATIC`
    );

    // 동적 Gas 가격 계산
    const gasPriceData = await getDynamicGasPrice();

    // 트랜잭션 객체 생성 (EIP-1559 지원)
    const tx = {
      from: fromAddress,
      to: process.env.CONTRACT_ADDRESS,
      data: method.encodeABI(),
      gas: Math.ceil(Number(gasEstimate) * 1.1), // 가스 여유 추가
      nonce,
      ...gasPriceData, // 동적 가스 가격 적용
      type: gasPriceData.maxFeePerGas ? 2 : 0, // EIP-1559 지원 여부
    };

    // BigInt 직렬화 처리를 위한 함수
    const replacer = (key, value) =>
      typeof value === "bigint" ? value.toString() : value;

    console.log("Transaction object:", JSON.stringify(tx, replacer, 2));

    // 가스 가격 로그 출력 - 디버깅용
    if (tx.maxFeePerGas) {
      console.log(
        `Using EIP-1559 gas pricing - Max Fee: ${web3.utils.fromWei(
          tx.maxFeePerGas,
          "gwei"
        )} Gwei, Priority Fee: ${web3.utils.fromWei(
          tx.maxPriorityFeePerGas,
          "gwei"
        )} Gwei`
      );
    } else if (tx.gasPrice) {
      console.log(
        `Using legacy gas pricing - Gas Price: ${web3.utils.fromWei(
          tx.gasPrice,
          "gwei"
        )} Gwei`
      );
    }

    // 트랜잭션 서명 및 전송
    const signed = await web3.eth.accounts.signTransaction(
      tx,
      process.env.PRIVATE_KEY
    );

    // 트랜잭션 전송 시 타임아웃 설정
    const receipt = await web3.eth.sendSignedTransaction(
      signed.rawTransaction,
      {
        transactionPollingTimeout: 180, // 3분 내에 완료되지 않으면 타임아웃
      }
    );

    console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);
    console.log(`Gas used: ${receipt.gasUsed}`);

    // 성공 시 실패 카운터 초기화
    gasStats.failedAttempts = 0;

    return receipt;
  } catch (error) {
    // 오류 발생 시 오류 유형에 따라 처리
    if (error.message.includes("replacement transaction underpriced")) {
      console.error(
        "Replacement transaction underpriced. Increasing gas price..."
      );
      gasStats.failedAttempts++;
    } else if (error.message.includes("transaction underpriced")) {
      console.error(
        "Transaction underpriced. Significantly increasing gas price..."
      );
      gasStats.failedAttempts += 2;
      gasStats.lastUpdate = 0; // 가스 가격 캐시 무효화
    } else if (error.message.includes("nonce too low")) {
      console.error("Nonce too low. Need to re-sync from network.");
      await syncNonce(
        web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY).address
      );
    } else if (error.message.includes("not mined within")) {
      console.error("Transaction timed out but might still be processed.");
      gasStats.failedAttempts++;
    }

    throw error;
  }
}

// --- 향상된 재시도 가능 오류 확인 ---
function isRetryableError(error) {
  const retryableErrors = [
    "not mined within",
    "timed out",
    "nonce too low",
    "replacement transaction underpriced",
    "transaction underpriced",
    "insufficient funds",
    "connection error",
    "could not connect",
    "already known",
    "bigint",
    "gas required exceeds allowance",
  ];

  return retryableErrors.some((errText) =>
    error.message.toLowerCase().includes(errText.toLowerCase())
  );
}

// --- 향상된 백오프 재시도 로직 ---
async function sendTxWithRetry(method, options = {}) {
  const maxRetries = options.maxRetries || 5;
  const initialBackoff = options.initialBackoff || 1000; // 1초
  let retryCount = 0;
  let lastError = null;

  while (retryCount <= maxRetries) {
    try {
      if (retryCount > 0) {
        console.log(`Retry attempt ${retryCount} of ${maxRetries}`);
      }

      // 트랜잭션 전송
      const receipt = await sendTx(method, options);
      return receipt;
    } catch (error) {
      lastError = error;

      if (retryCount >= maxRetries) {
        console.error(`Failed after ${maxRetries} attempts:`, error.message);
        break;
      }

      if (isRetryableError(error)) {
        retryCount++;

        // 기하급수적 백오프 지연
        const jitter = Math.random() * 0.3 + 0.85; // 0.85-1.15 범위의 무작위 값
        const delay = Math.floor(
          initialBackoff * Math.pow(2, retryCount - 1) * jitter
        );

        console.log(
          `Transaction attempt failed (${error.message}), retrying in ${
            delay / 1000
          } seconds...`
        );
        await new Promise((r) => setTimeout(r, delay));

        // 특정 오류 처리
        if (
          error.message.includes("nonce too low") ||
          error.message.includes("replacement transaction underpriced")
        ) {
          try {
            const account = web3.eth.accounts.privateKeyToAccount(
              process.env.PRIVATE_KEY
            );
            await syncNonce(account.address);
            // nonce 관련 오류 발생 시 options 객체에 새로운 nonce 값을 설정
            options.nonce = currentNonce;
          } catch (syncError) {
            console.error("Error syncing nonce:", syncError);
          }
        } else if (error.message.includes("transaction underpriced")) {
          // 가스 가격 관련 오류 - 가스 가격 증가
          console.log(
            "Transaction underpriced error detected, increasing gas price"
          );
          gasStats.failedAttempts += 2; // 가스 가격을 더 크게 증가시키기 위해 실패 카운터 증가
          gasStats.lastUpdate = 0; // 가스 가격 캐시 무효화
        } else if (
          error.message.includes("BigInt") ||
          error.message.includes("bigint")
        ) {
          // BigInt 직렬화 오류 처리
          console.error("BigInt serialization error detected, applying fixes");
        }

        continue;
      }

      // 재시도할 수 없는 오류는 즉시 실패
      console.error("Non-retryable error, failing immediately:", error.message);
      throw error;
    }
  }

  // 모든 재시도 실패
  throw lastError;
}

// --- 향상된 트랜잭션 큐 관리 ---
async function enqueueTransaction(method, priority = 1) {
  return new Promise((resolve, reject) => {
    // 큐 크기 제한 확인
    if (transactionQueue.length >= MAX_QUEUE_SIZE) {
      reject(new Error("Transaction queue is full, please try again later"));
      return;
    }

    // 큐에 트랜잭션 추가 (우선순위 지원)
    transactionQueue.push({
      method,
      resolve,
      reject,
      priority,
      timestamp: Date.now(),
    });

    // 큐 처리 시작
    processQueue().catch((err) => {
      console.error("Error in queue processing:", err);
    });
  });
}

// --- 개선된 큐 처리 ---
let isProcessingQueue = false;

async function processQueue() {
  if (isProcessingQueue) return;

  isProcessingQueue = true;

  try {
    // 처리할 트랜잭션이 없을 때까지 반복
    while (transactionQueue.length > 0) {
      // 우선순위에 따라 큐 정렬 (높은 우선순위 먼저)
      transactionQueue.sort(
        (a, b) => b.priority - a.priority || a.timestamp - b.timestamp
      );

      // 다음 트랜잭션 가져오기
      const { method, resolve, reject } = transactionQueue.shift();

      try {
        // 트랜잭션 전송 시도
        const receipt = await sendTxWithRetry(method);
        resolve(receipt);
      } catch (error) {
        console.error("Failed to process transaction in queue:", error);
        reject(error);
      }
    }
  } finally {
    isProcessingQueue = false;

    // 드물게 경쟁 상태로 인해 항목이 남아있을 수 있으므로 확인
    if (transactionQueue.length > 0) {
      // 즉시 재처리하지 않고 짧은 지연 후에 처리
      setTimeout(() => {
        processQueue().catch(console.error);
      }, 50);
    }
  }
}

// ===========================
// API 엔드포인트 정의
// ===========================

// 문서 등록 (PUT)
app.put("/blockchain/tokens/:contractAddress/documents", async (req, res) => {
  try {
    const { name, docUri, docHash } = req.body;
    const contractAddress = req.params.contractAddress;

    console.log("PUT Request:", req.body);
    console.log("Contract address from URL:", contractAddress);
    console.log("Contract address from ENV:", process.env.CONTRACT_ADDRESS);

    // 컨트랙트 주소 검증
    if (
      contractAddress.toLowerCase() !==
      process.env.CONTRACT_ADDRESS.toLowerCase()
    ) {
      return res.status(400).json({
        error: "Contract address mismatch",
        message: `Requested contract ${contractAddress} vs. configured ${process.env.CONTRACT_ADDRESS}`,
      });
    }

    // 입력 검증
    if (!name || !docHash) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "Both name and docHash are required",
      });
    }

    // 트랜잭션 큐에 추가 (높은 우선순위)
    const receipt = await enqueueTransaction(
      contract.methods.registerDocument(name, docHash, docUri || ""),
      2 // PUT 요청에 높은 우선순위 부여
    );

    // BigInt 직렬화 처리
    const serializedReceipt = JSON.parse(
      JSON.stringify(receipt, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.json({
      ...serializedReceipt,
      transactionHash: receipt.transactionHash,
    });
  } catch (err) {
    console.error("Error registering document:", err);

    // 오류 유형에 따른 적절한 HTTP 상태 코드
    const statusCode = err.message.includes("queue is full") ? 503 : 500;

    res.status(statusCode).json({
      error: err.message,
      message: "Error while executing registerDocument",
    });
  }
});

// 문서 이름으로 조회 (GET)
app.get(
  "/blockchain/tokens/:contractAddress/documents/:name",
  async (req, res) => {
    try {
      const contractAddress = req.params.contractAddress;
      const name = req.params.name;

      console.log("GET request received for document:", name);
      console.log("Contract address from URL:", contractAddress);

      // 컨트랙트 주소 검증
      if (
        contractAddress.toLowerCase() !==
        process.env.CONTRACT_ADDRESS.toLowerCase()
      ) {
        return res.status(400).json({
          error: "Contract address mismatch",
          message: `Requested contract ${contractAddress} does not match the configured contract`,
        });
      }

      // 문서 조회 - 오류 처리 추가
      try {
        const doc = await contract.methods.getDocument(name).call();
        console.log("Document retrieved:", doc);

        // API 응답 형식
        res.json({
          docUri: doc[0] || "",
          docHash: doc[1] || "",
          timestamp: doc[2].toString(),
        });
      } catch (err) {
        console.error("Error getting document:", err);

        // 문서가 없거나 오류 발생 시 404 응답
        if (
          err.message.includes("not found") ||
          err.message.includes("revert")
        ) {
          return res.status(404).json({
            statusCode: 404,
            message: "Document Not Found",
          });
        }

        // 그 외 오류
        res.status(500).json({
          error: err.message,
          message: "Error while querying document",
        });
      }
    } catch (err) {
      console.error("Error in GET document request:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

// 문서 삭제 (DELETE)
app.delete(
  "/blockchain/tokens/:contractAddress/documents/:name",
  async (req, res) => {
    try {
      const contractAddress = req.params.contractAddress;
      const name = req.params.name;

      console.log("DELETE Request for document:", name);
      console.log("Contract address from URL:", contractAddress);

      // 컨트랙트 주소 검증
      if (
        contractAddress.toLowerCase() !==
        process.env.CONTRACT_ADDRESS.toLowerCase()
      ) {
        return res.status(400).json({
          error: "Contract address mismatch",
          message: `Requested contract ${contractAddress} does not match the configured contract`,
        });
      }

      // 먼저 문서가 존재하는지 확인 (선택 사항)
      try {
        await contract.methods.getDocument(name).call();
      } catch (err) {
        if (
          err.message.includes("not found") ||
          err.message.includes("revert")
        ) {
          return res.status(404).json({
            statusCode: 404,
            message: "Document Not Found",
          });
        }
      }

      // 트랜잭션 큐에 추가 (보통 우선순위)
      const receipt = await enqueueTransaction(
        contract.methods.deleteDocument(name),
        1 // 일반 우선순위
      );

      // BigInt 직렬화 처리
      const serializedReceipt = JSON.parse(
        JSON.stringify(receipt, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );

      res.json({
        ...serializedReceipt,
        transactionHash: receipt.transactionHash,
      });
    } catch (err) {
      console.error("Error deleting document:", err);

      // 오류 유형에 따른 적절한 HTTP 상태 코드
      const statusCode = err.message.includes("queue is full") ? 503 : 500;

      res.status(statusCode).json({
        error: err.message,
        message: "Error happened while trying to delete document",
      });
    }
  }
);

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API server running at http://localhost:${PORT}`);
  console.log("Contract address:", process.env.CONTRACT_ADDRESS);
  console.log(
    "Network:",
    process.env.INFURA_URL.includes("polygon") ? "Polygon" : "Ethereum"
  );
  console.log(
    "Enhanced transaction management enabled with dynamic gas pricing"
  );
  console.log("Routes:");
  console.log("- PUT /blockchain/tokens/:contractAddress/documents");
  console.log("- GET /blockchain/tokens/:contractAddress/documents/:name");
  console.log("- DELETE /blockchain/tokens/:contractAddress/documents/:name");

  // 시작 시 계정 확인
  checkAccounts().catch(console.error);
});
