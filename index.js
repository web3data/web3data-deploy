const fs = require('fs');
const FormData = require('form-data');

const UPLOAD_ENDPOINT = 'http://localhost:1234/api/v1/upload'
const DEFAULT_BUILD_DIR = 'build/contracts/'
const apiKey = '' // TODO: Add key from config
// http://localhost:1234/

const getBody = abi => {
  const networks = networks[Math.max(...Object.keys(networks))]
  return {
    'contractAddress': networks.address,
    'walletAddress': '',
    'transactionHash': networks.transactionHash
  }
}

const uploadFile = async (file, body) => {
  try {
    const response = await got.stream.post(UPLOAD_ENDPOINT).pipe(fs.createWriteStream(file));
    console.log(response.body);
  } catch (error) {
    console.log(error);
  }
}

// export async function uploadModule() {
function uploadModule() {

  const form = new FormData();

  form.append('uploadedFiles', fs.createReadStream('./tests/abi-test.json'))
  form.append('contractAddress', '0x06012c8cf97bead5deae237070f9587f8e7a266d')
  form.append('transactionHash', '0x34856fd3fb9656fc5e936db86d719e0a75fab5e9e7932a95effb0102dee16185')
  form.append('walletAddress', '0xb96bb2b19be0ad51a53aac842ef3e1ceff085663')
  form.append('blockchainId', '1c9c969065fcd1cf')

  // let body = {
  //   contractAddress: "0x...", // address of deployed contract, post confirmation
  //   walletAddress: "0x...", // address of wallet, used in the deploy process
  //   transactionHash: "0xfdsfds..." // transaction hash of confirmed deploy txn
  // }

  // // Testing
  // const body = {
  //   contractAddress: '0x06012c8cf97bead5deae237070f9587f8e7a266d',
  //   transactionHash: '0x34856fd3fb9656fc5e936db86d719e0a75fab5e9e7932a95effb0102dee16185',
  //   walletAddress: '0xb96bb2b19be0ad51a53aac842ef3e1ceff085663',
  //   blockchainId: '1c9c969065fcd1cf'
  // }

  form.submit({
    host: 'localhost',
    port: 1234,
    path: '/api/v1/upload',
    // host: 'contract-service.amberdata.io',
    // port: 443,
    // path: '/api/v1/upload',
    headers: { 'x-amberdata-api-key': apiKey }
  }, function(err, res) {
    console.log(err, res.statusCode)
  })

  // await uploadFile('./abi-test.json', body)

  // fs.readdirSync(DEFAULT_BUILD_DIR).forEach(file => {
  //   uploadFile(filePath, body)
  // })

}

uploadModule()
