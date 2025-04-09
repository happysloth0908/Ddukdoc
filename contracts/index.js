require("dotenv").config();
const express = require("express");
const { Web3 } = require("web3");
const abi = require("./abi.json");

const app = express();
app.use(express.json());

const web3 = new Web3(process.env.INFURA_URL);
const contract = new web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);

// 계정 확인 함수
async function checkAccounts() {
  try {
    // 프라이빗 키로부터 계정 주소 복구
    const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
    console.log("Account from private key:", account.address);
    console.log("Owner address from .env:", process.env.OWNER_ADDRESS);
    console.log("Contract address from .env:", process.env.CONTRACT_ADDRESS);
    
    if (account.address.toLowerCase() !== process.env.OWNER_ADDRESS.toLowerCase()) {
      console.error("WARNING: Private key does not match the owner address in .env file!");
      console.log("Please update your .env file to use the correct matching address and private key");
    }
    
    const balance = await web3.eth.getBalance(account.address);
    console.log(`Balance of ${account.address}: ${web3.utils.fromWei(balance, 'ether')} MATIC`);
    
    return account;
  } catch (error) {
    console.error("Error checking accounts:", error);
    throw error;
  }
}

// 🔐 개인 키 서명 전송 - 가스 비용 최적화
async function sendTx(method) {
  try {
    // 계정 확인
    const account = await checkAccounts();
    const fromAddress = account.address; // 프라이빗 키에서 복구한 주소 사용
    
    // 현재 계정의 논스 가져오기
    const nonce = await web3.eth.getTransactionCount(fromAddress, 'pending');
    console.log("Using nonce:", nonce);
    
    // 1. Gas 추정
    const gasEstimate = await method.estimateGas({ from: fromAddress });
    console.log("Gas estimate:", gasEstimate.toString());
    
    // 2. 계정 잔액 확인
    const balance = await web3.eth.getBalance(fromAddress);
    console.log("Account balance:", web3.utils.fromWei(balance, 'ether'), "MATIC");
    
    // 3. 현재 가스 가격 가져오기
    let gasPrice = await web3.eth.getGasPrice();
    console.log("Network gas price:", web3.utils.fromWei(gasPrice, 'gwei'), "Gwei");
    
    // 가스 가격 최적화: 기본 가격에 10% 추가만 하기
    gasPrice = (BigInt(gasPrice) * BigInt(11) / BigInt(10)).toString();
    console.log("Optimized gas price (1.1x):", web3.utils.fromWei(gasPrice, 'gwei'), "Gwei");

    // 가스 비용 계산
    const gasCost = BigInt(gasEstimate) * BigInt(gasPrice);
    console.log("Estimated gas cost:", web3.utils.fromWei(gasCost.toString(), 'ether'), "MATIC");
    
    // 잔액이 충분한지 확인
    if (BigInt(balance) < gasCost) {
      throw new Error(`Insufficient funds: have ${web3.utils.fromWei(balance, 'ether')} MATIC, need at least ${web3.utils.fromWei(gasCost.toString(), 'ether')} MATIC`);
    }
    
    // 4. 트랜잭션 객체 생성
    const tx = {
      from: fromAddress,
      to: process.env.CONTRACT_ADDRESS,
      data: method.encodeABI(),
      gas: Math.ceil(Number(gasEstimate) * 1.1), // 10% 안전 여유분 추가
      maxPriorityFeePerGas: gasPrice,
      maxFeePerGas: gasPrice,
      nonce: nonce,
      type: 2 // EIP-1559 트랜잭션 타입
    };
    
    console.log("Transaction object:", JSON.stringify(tx, (key, value) => 
      typeof value === 'bigint' ? value.toString() : value, 2));
    
    // 5. 트랜잭션 서명
    const signed = await web3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);
    
    // 6. 서명된 트랜잭션 전송
    const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
    console.log("Transaction confirmed in block:", receipt.blockNumber);
    console.log("Actual gas used:", receipt.gasUsed);
    return receipt;
  } catch (error) {
    // 더 구체적인 오류 처리
    if (error.message.includes('not mined within')) {
      console.error("Transaction not mined within timeout period. It might still be pending.");
      console.error("Try checking the transaction status on the Polygon explorer.");
      throw new Error("Transaction timed out but may still be processed. Please check the Polygon explorer.");
    } else {
      console.error("Transaction error:", error);
      throw error;
    }
  }
}

async function sendTxWithRetry(method, maxRetries = 3) {
  let retryCount = 0;
  let lastError = null;

  while (retryCount < maxRetries) {
    try {
      console.log(`Attempt ${retryCount + 1} of ${maxRetries}`);
      
      // 기존 sendTx 함수 호출
      const receipt = await sendTx(method);
      return receipt; // 성공하면 결과 반환
      
    } catch (error) {
      lastError = error;
      
      // 타임아웃 오류인 경우 재시도
      if (error.message.includes('not mined within') || 
          error.message.includes('timed out') ||
          error.message.includes('Transaction timed out')) {
        console.log(`Transaction attempt ${retryCount + 1} timed out, retrying in 5 seconds...`);
        retryCount++;
        
        // 잠시 대기 후 재시도
        await new Promise(resolve => setTimeout(resolve, 5000));
      } else {
        // 다른 오류는 바로 실패 처리
        throw error;
      }
    }
  }
  
  // 모든 재시도가 실패한 경우
  console.error(`Failed after ${maxRetries} attempts`);
  throw lastError;
}

// 문서 등록 - 원본 시스템과 호환되는 PUT 엔드포인트
app.put("/blockchain/tokens/:contractAddress/documents", async (req, res) => {
  try {
    const { requestor, name, docUri, docHash, signature } = req.body;
    const contractAddress = req.params.contractAddress;
    
    console.log("PUT Request:", req.body);
    console.log("Contract address from URL:", contractAddress);
    console.log("Contract address from ENV:", process.env.CONTRACT_ADDRESS);
    
    // 요청된 컨트랙트 주소와 환경 변수의 컨트랙트 주소 비교
    if (contractAddress.toLowerCase() !== process.env.CONTRACT_ADDRESS.toLowerCase()) {
      return res.status(400).json({ 
        error: "Contract address mismatch",
        message: `Requested contract ${contractAddress} does not match the configured contract`
      });
    }
    
    // 문서 등록
    const receipt = await sendTxWithRetry(contract.methods.registerDocument(name, docHash, docUri || ""));

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
    console.error("Error registering document:", err);
    
    // 원본 API와 유사한 오류 응답
    res.status(500).json({ 
      error: err.message,
      message: "Error happened while trying to execute a function inside a smart contract"
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

// 서버 시작 시 컨트랙트 주소 및 라우트 정보 출력
app.listen(3000, () => {
  console.log("🚀 API server running at https://j12b108.p.ssafy.io:3000");
  console.log("Contract address:", process.env.CONTRACT_ADDRESS);
  console.log("Network:", process.env.INFURA_URL.includes("polygon") ? "Polygon" : "Ethereum");
  console.log("Cost-optimized mode enabled - gas prices reduced to save MATIC");
  
  // 지원하는 라우트 출력
  console.log("Supported routes:");
  console.log("- GET /blockchain/tokens/:contractAddress/documents/:name");
  console.log("- PUT /blockchain/tokens/:contractAddress/documents");
  console.log("- DELETE /blockchain/tokens/:contractAddress/documents/:name");
});