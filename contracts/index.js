require("dotenv").config();
const express = require("express");
const { Web3 } = require("web3");
const abi = require("./abi.json");

// 1) Express init
const app = express();
app.use(express.json());

// 2) Web3 & Contract (원래 코드 유지)
const web3 = new Web3(process.env.INFURA_URL);
const contract = new web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);

// 3) 전역 nonce + 큐
let currentNonce = null;       // 인메모리 nonce
let nonceInitialized = false;  // nonce 초기화 여부
const transactionQueue = [];   // 큐 (동시 요청 시 직렬 처리)
let isProcessingQueue = false; // 큐 처리중 여부

// --- 계정 확인 (원래 코드 그대로) ---
async function checkAccounts() {
  try {
    const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
    console.log("Account from private key:", account.address);
    console.log("Owner address from .env:", process.env.OWNER_ADDRESS);
    console.log("Contract address from .env:", process.env.CONTRACT_ADDRESS);

    if (account.address.toLowerCase() !== process.env.OWNER_ADDRESS.toLowerCase()) {
      console.error("WARNING: Private key does not match the owner address in .env file!");
    }

    const balance = await web3.eth.getBalance(account.address);
    console.log(`Balance of ${account.address}: ${web3.utils.fromWei(balance, "ether")} MATIC`);

    return account;
  } catch (error) {
    console.error("Error checking accounts:", error);
    throw error;
  }
}

// --- sendTx (원래 코드 그대로) ---
async function sendTx(method) {
  try {
    // 계정 확인
    const account = await checkAccounts();
    const fromAddress = account.address;

    // **nonce 직렬화**: 여기선 getTransactionCount 대신, **인메모리 currentNonce** 사용
    let nonce;
    if (!nonceInitialized) {
      // 최초 초기화
      nonce = await web3.eth.getTransactionCount(fromAddress, "pending");
      currentNonce = nonce;
      nonceInitialized = true;
      console.log("Nonce initialized to:", currentNonce);
    } else {
      currentNonce++;
      nonce = currentNonce;
      console.log("Using next nonce:", nonce);
    }

    // 1) Gas 추정
    const gasEstimate = await method.estimateGas({ from: fromAddress });
    console.log("Gas estimate:", gasEstimate.toString());

    // 2) 잔액 확인
    const balance = await web3.eth.getBalance(fromAddress);
    console.log("Account balance:", web3.utils.fromWei(balance, "ether"), "MATIC");

    // 3) 네트워크 gasPrice
    let gasPrice = await web3.eth.getGasPrice();
    console.log("Network gas price:", web3.utils.fromWei(gasPrice, "gwei"), "Gwei");

    // 10% 인상
    gasPrice = (BigInt(gasPrice) * 11n / 10n).toString();
    console.log("Optimized gas price (1.1x):", web3.utils.fromWei(gasPrice, "gwei"), "Gwei");

    // 가스 비용 계산
    const gasCost = BigInt(gasEstimate) * BigInt(gasPrice);
    console.log("Estimated gas cost:", web3.utils.fromWei(gasCost.toString(), "ether"), "MATIC");

    if (BigInt(balance) < gasCost) {
      throw new Error(`Insufficient funds: have ${web3.utils.fromWei(balance, "ether")} MATIC, need ${web3.utils.fromWei(gasCost.toString(), "ether")} MATIC`);
    }

    // 4) Tx 객체
    const tx = {
      from: fromAddress,
      to: process.env.CONTRACT_ADDRESS,
      data: method.encodeABI(),
      gas: Math.ceil(Number(gasEstimate) * 1.1),
      maxPriorityFeePerGas: gasPrice,
      maxFeePerGas: gasPrice,
      nonce,
      type: 2
    };

    console.log("Transaction object:", tx);

    // 5) 서명
    const signed = await web3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);

    // 6) 전송
    const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
    console.log("Transaction confirmed in block:", receipt.blockNumber);
    console.log("Actual gas used:", receipt.gasUsed);
    return receipt;
  } catch (error) {
    // 더 구체적인 오류 처리
    if (error.message.includes("not mined within")) {
      console.error("Transaction not mined within timeout period. Might still be pending.");
      throw new Error("Transaction timed out but may still be processed. Check explorer.");
    } else {
      console.error("Transaction error:", error);
      throw error;
    }
  }
}

// --- 재시도 로직 (원래 코드 그대로) ---
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
      // 타임아웃 오류인 경우 재시도
      if (
        error.message.includes("not mined within") ||
        error.message.includes("timed out") ||
        error.message.includes("Transaction timed out")
      ) {
        console.log(`Transaction attempt ${retryCount + 1} timed out, retrying in 5 seconds...`);
        retryCount++;
        await new Promise(r => setTimeout(r, 5000));
      } else {
        throw error;
      }
    }
  }

  console.error(`Failed after ${maxRetries} attempts`);
  throw lastError;
}

// --- [추가] 트랜잭션 큐 (직렬 처리) ---
function enqueueTransaction(method) {
  return new Promise((resolve, reject) => {
    transactionQueue.push({ method, resolve, reject });
    processQueue(); // 큐 처리 시작
  });
}

async function processQueue() {
  if (isProcessingQueue) return;
  isProcessingQueue = true;

  while (transactionQueue.length > 0) {
    const { method, resolve, reject } = transactionQueue.shift();
    try {
      const receipt = await sendTxWithRetry(method);
      resolve(receipt);
    } catch (err) {
      reject(err);
    }
  }

  isProcessingQueue = false;
}


// 문서 등록 (PUT)
app.put("/blockchain/tokens/:contractAddress/documents", async (req, res) => {
  try {
    const { requestor, name, docUri, docHash, signature } = req.body;
    const contractAddress = req.params.contractAddress;

    console.log("PUT Request:", req.body);
    console.log("Contract address from URL:", contractAddress);
    console.log("Contract address from ENV:", process.env.CONTRACT_ADDRESS);

    if (contractAddress.toLowerCase() !== process.env.CONTRACT_ADDRESS.toLowerCase()) {
      return res.status(400).json({
        error: "Contract address mismatch",
        message: `Requested contract ${contractAddress} vs. configured ${process.env.CONTRACT_ADDRESS}`
      });
    }

    // *** 여기서 enqueueTransaction ***
    const receipt = await enqueueTransaction(
      contract.methods.registerDocument(name, docHash, docUri || "")
    );

    // ★★★ BigInt -> string 직렬화 ★★★
    const serializedReceipt = JSON.parse(JSON.stringify(
      receipt,
      (key, value) => (typeof value === "bigint" ? value.toString() : value)
    ));

    res.json({
      ...serializedReceipt,
      transactionHash: receipt.transactionHash
    });
  } catch (err) {
    console.error("Error registering document:", err);
    res.status(500).json({
      error: err.message,
      message: "Error while executing registerDocument"
    });
  }
});



// 문서 이름으로 조회 - 원본 시스템과 호환되는 GET 엔드포인트
app.get("/blockchain/tokens/:contractAddress/documents/:name", async (req, res) => {
  try {
    const contractAddress = req.params.contractAddress;
    const name = req.params.name;
    
    console.log("GET request received for document:", name);
    console.log("Contract address from URL:", contractAddress);
    console.log("Contract address from ENV:", process.env.CONTRACT_ADDRESS);
    
    // 요청된 컨트랙트 주소와 환경 변수의 컨트랙트 주소 비교
    if (contractAddress.toLowerCase() !== process.env.CONTRACT_ADDRESS.toLowerCase()) {
      return res.status(400).json({ 
        error: "Contract address mismatch",
        message: `Requested contract ${contractAddress} does not match the configured contract`
      });
    }
    
    // 문서 조회 - 오류 처리 추가
    try {
      const doc = await contract.methods.getDocument(name).call();
      console.log("Document retrieved:", doc);
      
      // 원본 API와 동일한 응답 형식
      res.json({
        "docUri": doc[0] || "",
        "docHash": doc[1] || "",
        "timestamp": doc[2].toString()
      });
    } catch (err) {
      console.error("Error getting document:", err);
      
      // 문서가 없는 경우 404 응답
      res.status(404).json({ 
        "statusCode": 404,
        "message": "Not Found"
      });
    }
  } catch (err) {
    console.error("Error in GET document request:", err);
    res.status(500).json({ error: err.message });
  }
});

// 문서 삭제 - 원본 시스템과 호환되는 DELETE 엔드포인트
app.delete("/blockchain/tokens/:contractAddress/documents/:name", async (req, res) => {
  try {
    const contractAddress = req.params.contractAddress;
    const name = req.params.name;
    const { requestor, signature } = req.body;
    
    console.log("DELETE Request:", req.body);
    console.log("Document name to delete:", name);
    console.log("Contract address from URL:", contractAddress);
    console.log("Contract address from ENV:", process.env.CONTRACT_ADDRESS);
    
    // 요청된 컨트랙트 주소와 환경 변수의 컨트랙트 주소 비교
    if (contractAddress.toLowerCase() !== process.env.CONTRACT_ADDRESS.toLowerCase()) {
      return res.status(400).json({ 
        error: "Contract address mismatch",
        message: `Requested contract ${contractAddress} does not match the configured contract`
      });
    }
    
    // 문서 삭제
    const receipt = await sendTxWithRetry(contract.methods.deleteDocument(name));

    // BigInt 값을 문자열로 변환
    const serializedReceipt = JSON.parse(JSON.stringify(receipt, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));
    
    // 원본 API와 동일한 응답 형식
    res.json({
      ...serializedReceipt,
      transactionHash: receipt.transactionHash
    });
  } catch (err) {
    console.error("Error deleting document:", err);
    
    // 원본 API와 유사한 오류 응답
    res.status(500).json({ 
      error: err.message,
      message: "Error happened while trying to execute a function inside a smart contract"
    });
  }
});



// (문서 삭제 - DELETE)
app.delete("/blockchain/tokens/:contractAddress/documents/:name", async (req, res) => {
  try {
    // 마찬가지로 enqueueTransaction...
    const receipt = await enqueueTransaction(
      contract.methods.deleteDocument(req.params.name)
    );
    res.json({
      ...receipt,
      transactionHash: receipt.transactionHash
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------------------
// 서버 실행
// ------------------------------------
app.listen(3000, () => {
  console.log("🚀 API server running at http://localhost:3000");
  console.log("Contract address:", process.env.CONTRACT_ADDRESS);
  console.log("Network:", process.env.INFURA_URL.includes("polygon") ? "Polygon" : "Ethereum");
  console.log("Cost-optimized mode enabled - gas prices reduced to save MATIC");
  console.log("Routes:");
  console.log("- PUT /blockchain/tokens/:contractAddress/documents");
  console.log("- GET /blockchain/tokens/:contractAddress/documents/:name");
  console.log("- DELETE /blockchain/tokens/:contractAddress/documents/:name");
});