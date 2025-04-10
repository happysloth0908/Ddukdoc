require("dotenv").config();
const express = require("express");
const { Web3 } = require("web3");
const abi = require("./abi.json");

// 1) Express init
const app = express();
app.use(express.json());

// 2) Web3 & Contract
const web3 = new Web3(process.env.INFURA_URL);
const contract = new web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);

// 3) 전역 상태 관리
let currentNonce = null;
let nonceInitialized = false;
const transactionQueue = [];
let isProcessingQueue = false;
let processingPromise = null;
const MAX_QUEUE_SIZE = 100;

// Gas 가격 캐싱
let cachedGasPrice = null;
let lastGasPriceUpdate = 0;
const GAS_PRICE_CACHE_TIME = 60000; // 1분

// --- 계정 확인 ---
async function checkAccounts() {
  try {
    const account = web3.eth.accounts.privateKeyToAccount(
      process.env.PRIVATE_KEY
    );
    console.log("Account from private key:", account.address);
    console.log("Owner address from .env:", process.env.OWNER_ADDRESS);
    console.log("Contract address from .env:", process.env.CONTRACT_ADDRESS);

    if (
      account.address.toLowerCase() !== process.env.OWNER_ADDRESS.toLowerCase()
    ) {
      console.error(
        "WARNING: Private key does not match the owner address in .env file!"
      );
    }

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

// --- 최적화된 Gas 가격 가져오기 ---
async function getOptimizedGasPrice() {
  const now = Date.now();
  if (!cachedGasPrice || now - lastGasPriceUpdate > GAS_PRICE_CACHE_TIME) {
    cachedGasPrice = await web3.eth.getGasPrice();
    lastGasPriceUpdate = now;
  }
  return ((BigInt(cachedGasPrice) * 11n) / 10n).toString();
}

// --- Nonce 관리 ---
async function getNextNonce(fromAddress) {
  if (!nonceInitialized) {
    currentNonce = await web3.eth.getTransactionCount(fromAddress, "pending");
    nonceInitialized = true;
    console.log("Nonce initialized to:", currentNonce);
  }
  return currentNonce++;
}

// --- 트랜잭션 전송 ---
async function sendTx(method) {
  try {
    const account = await checkAccounts();
    const fromAddress = account.address;

    // Nonce 획득
    const nonce = await getNextNonce(fromAddress);
    console.log("Using next nonce:", nonce);

    // Gas 추정
    const gasEstimate = await method.estimateGas({ from: fromAddress });
    console.log("Gas estimate:", gasEstimate.toString());

    // 잔액 확인
    const balance = await web3.eth.getBalance(fromAddress);
    console.log(
      "Account balance:",
      web3.utils.fromWei(balance, "ether"),
      "MATIC"
    );

    // 최적화된 Gas 가격
    const gasPrice = await getOptimizedGasPrice();
    console.log(
      "Optimized gas price:",
      web3.utils.fromWei(gasPrice, "gwei"),
      "Gwei"
    );

    // 가스 비용 계산
    const gasCost = BigInt(gasEstimate) * BigInt(gasPrice);
    console.log(
      "Estimated gas cost:",
      web3.utils.fromWei(gasCost.toString(), "ether"),
      "MATIC"
    );

    if (BigInt(balance) < gasCost) {
      throw new Error(
        `Insufficient funds: have ${web3.utils.fromWei(
          balance,
          "ether"
        )} MATIC, need ${web3.utils.fromWei(gasCost.toString(), "ether")} MATIC`
      );
    }

    // 트랜잭션 객체 생성
    const tx = {
      from: fromAddress,
      to: process.env.CONTRACT_ADDRESS,
      data: method.encodeABI(),
      gas: Math.ceil(Number(gasEstimate) * 1.1),
      maxPriorityFeePerGas: gasPrice,
      maxFeePerGas: gasPrice,
      nonce,
      type: 2,
    };

    console.log("Transaction object:", tx);

    // 서명 및 전송
    const signed = await web3.eth.accounts.signTransaction(
      tx,
      process.env.PRIVATE_KEY
    );
    const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
    console.log("Transaction confirmed in block:", receipt.blockNumber);
    console.log("Actual gas used:", receipt.gasUsed);
    return receipt;
  } catch (error) {
    if (error.message.includes("not mined within")) {
      console.error(
        "Transaction not mined within timeout period. Might still be pending."
      );
      throw new Error(
        "Transaction timed out but may still be processed. Check explorer."
      );
    } else {
      console.error("Transaction error:", error);
      throw error;
    }
  }
}

// --- 재시도 가능한 오류 확인 ---
function isRetryableError(error) {
  return (
    error.message.includes("not mined within") ||
    error.message.includes("timed out") ||
    error.message.includes("nonce too low") ||
    error.message.includes("replacement transaction underpriced")
  );
}

// --- 재시도 로직 ---
async function sendTxWithRetry(method, maxRetries = 3) {
  let retryCount = 0;
  let lastError = null;

  while (retryCount < maxRetries) {
    try {
      console.log(`Attempt ${retryCount + 1} of ${maxRetries}`);
      const receipt = await sendTx(method);
      return receipt;
    } catch (error) {
      lastError = error;
      if (isRetryableError(error)) {
        retryCount++;
        const delay = Math.pow(2, retryCount) * 1000;
        console.log(
          `Transaction attempt ${retryCount} failed, retrying in ${
            delay / 1000
          } seconds...`
        );
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      throw error;
    }
  }

  console.error(`Failed after ${maxRetries} attempts`);
  throw lastError;
}

// --- 트랜잭션 큐 관리 ---
function enqueueTransaction(method) {
  return new Promise((resolve, reject) => {
    if (transactionQueue.length >= MAX_QUEUE_SIZE) {
      reject(new Error("Transaction queue is full"));
      return;
    }
    transactionQueue.push({ method, resolve, reject });
    processQueue();
  });
}

// --- 큐 처리 ---
async function processQueue() {
  if (isProcessingQueue) return;
  isProcessingQueue = true;

  try {
    while (transactionQueue.length > 0) {
      const { method, resolve, reject } = transactionQueue.shift();
      try {
        const receipt = await sendTxWithRetry(method);
        resolve(receipt);
      } catch (err) {
        reject(err);
      }
    }
  } finally {
    isProcessingQueue = false;
  }
}

// 문서 등록 (PUT)
app.put("/blockchain/tokens/:contractAddress/documents", async (req, res) => {
  try {
    const { requestor, name, docUri, docHash, signature } = req.body;
    const contractAddress = req.params.contractAddress;

    console.log("PUT Request:", req.body);
    console.log("Contract address from URL:", contractAddress);
    console.log("Contract address from ENV:", process.env.CONTRACT_ADDRESS);

    if (
      contractAddress.toLowerCase() !==
      process.env.CONTRACT_ADDRESS.toLowerCase()
    ) {
      return res.status(400).json({
        error: "Contract address mismatch",
        message: `Requested contract ${contractAddress} vs. configured ${process.env.CONTRACT_ADDRESS}`,
      });
    }

    const receipt = await enqueueTransaction(
      contract.methods.registerDocument(name, docHash, docUri || "")
    );

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
    res.status(500).json({
      error: err.message,
      message: "Error while executing registerDocument",
    });
  }
});

// 문서 이름으로 조회 - 원본 시스템과 호환되는 GET 엔드포인트
app.get(
  "/blockchain/tokens/:contractAddress/documents/:name",
  async (req, res) => {
    try {
      const contractAddress = req.params.contractAddress;
      const name = req.params.name;

      console.log("GET request received for document:", name);
      console.log("Contract address from URL:", contractAddress);
      console.log("Contract address from ENV:", process.env.CONTRACT_ADDRESS);

      // 요청된 컨트랙트 주소와 환경 변수의 컨트랙트 주소 비교
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

        // 원본 API와 동일한 응답 형식
        res.json({
          docUri: doc[0] || "",
          docHash: doc[1] || "",
          timestamp: doc[2].toString(),
        });
      } catch (err) {
        console.error("Error getting document:", err);

        // 문서가 없는 경우 404 응답
        res.status(404).json({
          statusCode: 404,
          message: "Not Found",
        });
      }
    } catch (err) {
      console.error("Error in GET document request:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

// 문서 삭제 - 원본 시스템과 호환되는 DELETE 엔드포인트
app.delete(
  "/blockchain/tokens/:contractAddress/documents/:name",
  async (req, res) => {
    try {
      const contractAddress = req.params.contractAddress;
      const name = req.params.name;
      const { requestor, signature } = req.body;

      console.log("DELETE Request:", req.body);
      console.log("Document name to delete:", name);
      console.log("Contract address from URL:", contractAddress);
      console.log("Contract address from ENV:", process.env.CONTRACT_ADDRESS);

      // 요청된 컨트랙트 주소와 환경 변수의 컨트랙트 주소 비교
      if (
        contractAddress.toLowerCase() !==
        process.env.CONTRACT_ADDRESS.toLowerCase()
      ) {
        return res.status(400).json({
          error: "Contract address mismatch",
          message: `Requested contract ${contractAddress} does not match the configured contract`,
        });
      }

      // 문서 삭제
      const receipt = await sendTxWithRetry(
        contract.methods.deleteDocument(name)
      );

      // BigInt 값을 문자열로 변환
      const serializedReceipt = JSON.parse(
        JSON.stringify(receipt, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );

      // 원본 API와 동일한 응답 형식
      res.json({
        ...serializedReceipt,
        transactionHash: receipt.transactionHash,
      });
    } catch (err) {
      console.error("Error deleting document:", err);

      // 원본 API와 유사한 오류 응답
      res.status(500).json({
        error: err.message,
        message:
          "Error happened while trying to execute a function inside a smart contract",
      });
    }
  }
);

// (문서 삭제 - DELETE)
app.delete(
  "/blockchain/tokens/:contractAddress/documents/:name",
  async (req, res) => {
    try {
      // 마찬가지로 enqueueTransaction...
      const receipt = await enqueueTransaction(
        contract.methods.deleteDocument(req.params.name)
      );
      res.json({
        ...receipt,
        transactionHash: receipt.transactionHash,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ------------------------------------
// 서버 실행
// ------------------------------------
app.listen(3000, () => {
  console.log("🚀 API server running at http://localhost:3000");
  console.log("Contract address:", process.env.CONTRACT_ADDRESS);
  console.log(
    "Network:",
    process.env.INFURA_URL.includes("polygon") ? "Polygon" : "Ethereum"
  );
  console.log("Cost-optimized mode enabled - gas prices reduced to save MATIC");
  console.log("Routes:");
  console.log("- PUT /blockchain/tokens/:contractAddress/documents");
  console.log("- GET /blockchain/tokens/:contractAddress/documents/:name");
  console.log("- DELETE /blockchain/tokens/:contractAddress/documents/:name");
});
