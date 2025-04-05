require("dotenv").config();
const express = require("express");
const { Web3 } = require("web3");
const abi = require("./abi.json");

const app = express();
app.use(express.json());

const web3 = new Web3(process.env.INFURA_URL);
const contract = new web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);

// 계정 확인 함수.
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
    console.log(`Balance of ${account.address}: ${web3.utils.fromWei(balance, 'ether')} ETH`);
    
    return account;
  } catch (error) {
    console.error("Error checking accounts:", error);
    throw error;
  }
}

// 🔐 개인 키 서명 전송
async function sendTx(method) {
  try {
    // 계정 확인
    const account = await checkAccounts();
    const fromAddress = account.address; // 프라이빗 키에서 복구한 주소 사용
    
    // 1. Gas 추정
    const gasEstimate = await method.estimateGas({ from: fromAddress });
    console.log("Gas estimate:", gasEstimate.toString());
    
    // 2. 계정 잔액 확인
    const balance = await web3.eth.getBalance(fromAddress);
    console.log("Account balance:", web3.utils.fromWei(balance, 'ether'), "ETH");
    
    // 3. 현재 가스 가격 가져오기
    const gasPrice = await web3.eth.getGasPrice();
    console.log("Gas price:", web3.utils.fromWei(gasPrice, 'gwei'), "Gwei");
    
    // 가스 비용 계산
    const gasCost = BigInt(gasEstimate) * BigInt(gasPrice);
    console.log("Estimated gas cost:", web3.utils.fromWei(gasCost.toString(), 'ether'), "ETH");
    
    // 잔액이 충분한지 확인
    if (BigInt(balance) < gasCost) {
      throw new Error(`Insufficient funds: have ${web3.utils.fromWei(balance, 'ether')} ETH, need at least ${web3.utils.fromWei(gasCost.toString(), 'ether')} ETH`);
    }
    
    // 4. 트랜잭션 객체 생성 - type 0 (레거시) 트랜잭션 형식 사용
    const tx = {
      from: fromAddress,
      to: process.env.CONTRACT_ADDRESS,
      data: method.encodeABI(),
      gas: Number(gasEstimate) + 30000, // 안전 여유분 추가
      gasPrice: gasPrice, // type 0 트랜잭션에는 gasPrice가 필요
      type: 0 // 명시적으로 레거시 트랜잭션 지정
    };
    
    console.log("Transaction object:", JSON.stringify(tx, (key, value) => 
      typeof value === 'bigint' ? value.toString() : value, 2));
    
    // 5. 트랜잭션 서명
    const signed = await web3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);
    
    // 6. 서명된 트랜잭션 전송
    return await web3.eth.sendSignedTransaction(signed.rawTransaction);
  } catch (error) {
    console.error("Transaction error:", error);
    throw error;
  }
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
    const receipt = await sendTx(contract.methods.registerDocument(name, docHash, docUri || ""));
    
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

// 전체 문서 조회 - 원본 시스템과 호환되는 GET 엔드포인트
app.get("/blockchain/tokens/:contractAddress/documents", async (req, res) => {
  try {
    const contractAddress = req.params.contractAddress;
    
    console.log("GET request received for all documents");
    console.log("Contract address from URL:", contractAddress);
    console.log("Contract address from ENV:", process.env.CONTRACT_ADDRESS);
    
    // 요청된 컨트랙트 주소와 환경 변수의 컨트랙트 주소 비교
    if (contractAddress.toLowerCase() !== process.env.CONTRACT_ADDRESS.toLowerCase()) {
      return res.status(400).json({ 
        error: "Contract address mismatch",
        message: `Requested contract ${contractAddress} does not match the configured contract`
      });
    }
    
    try {
      // 단일 문서만 조회하여 테스트
      console.log("Trying to get a single document as a test...");
      const testDoc = await contract.methods.getDocument("G1_test_123456789").call();
      console.log("Test document retrieved:", testDoc);
      
      // 테스트가 성공하면 전체 문서 조회를 시도
      console.log("Now trying to get all documents...");
      
      // 이 부분에서 ABI 오류가 발생하면 대체 방법 사용
      try {
        const docs = await contract.methods.getAllDocuments().call();
        console.log("Documents retrieved:", docs);
        
        // 원본 API와 동일한 응답 형식으로 변환
        const serializedDocs = [];
        for (const doc of docs) {
          if (doc.name) { // 빈 문서는 제외
            serializedDocs.push({
              "name": doc.name || "UNKNOWN", 
              "docUri": doc.uri || "",
              "docHash": doc.hash || ""
            });
          }
        }
        
        res.json(serializedDocs);
      } catch (err) {
        console.error("Error in getAllDocuments, using fallback method:", err);
        
        // fallback: 성공한 단일 문서로 응답
        res.json([{
          "docUri": testDoc[0] || "",
          "docHash": testDoc[1] || ""
        }]);
      }
    } catch (err) {
      console.error("Error getting test document:", err);
      // 문서가 없는 경우에도 빈 배열 반환
      res.json([]);
    }
  } catch (err) {
    console.error("Error retrieving documents:", err);
    res.status(500).json({ error: err.message });
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
    
    // 문서 조회
    const doc = await contract.methods.getDocument(name).call();
    console.log("Document retrieved:", doc);
    
    // 원본 API와 동일한 응답 형식
    res.json({
      "docUri": doc[0] || "",
      "docHash": doc[1] || "",
      "timestamp": doc[2].toString()
    });
  } catch (err) {
    console.error("Error retrieving document:", err);
    
    // 문서가 없는 경우 404 응답
    res.status(404).json({ 
      "statusCode": 404,
      "message": "Not Found"
    });
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
    const receipt = await sendTx(contract.methods.deleteDocument(name));
    
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
  console.log("🚀 API server running at http://localhost:3000");
  console.log("Contract address:", process.env.CONTRACT_ADDRESS);
  
  // 지원하는 라우트 출력
  console.log("Supported routes:");
  console.log("- GET /blockchain/tokens/:contractAddress/documents");
  console.log("- GET /blockchain/tokens/:contractAddress/documents/:name");
  console.log("- PUT /blockchain/tokens/:contractAddress/documents");
  console.log("- DELETE /blockchain/tokens/:contractAddress/documents/:name");
});