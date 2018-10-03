import got from 'got'

const UPLOAD_ENDPOINT = 'https://contract-service.api.amberdata.io/api/v1/upload'
const DEFAULT_BUILD_DIR = 'build/contracts/'

const getBody = abi => {
  const networks = networks[Math.max(...Object.keys(networks))]
  return {
    'contractAddress': networks.address,
    'walletAddress'
    'transactionHash': networks.transactionHash
  }
}

const uploadFile(filePath, body) {
  try {
    const response = await got.stream.post(UPLOAD_ENDPOINT, { 'body': body }).pipe(fs.createWriteStream(file));
    console.log(response.body);
  } catch (error) {
    console.log(error.response.body);
  }
}

export function uploadModule() {

  let body = {
    contractAddress: "0x..." // address of deployed contract, post confirmation
    walletAddress: "0x..." // address of wallet, used in the deploy process
    transactionHash: "0xfdsfds..." // transaction hash of confirmed deploy txn
  }

  fs.readdirSync(DEFAULT_BUILD_DIR).forEach(file => {
    uploadFile(filePath, body)
  })
}
