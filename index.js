const fs = require('fs');
const FormData = require('form-data');
import web3 from 'web3'

const UPLOAD_ENDPOINT = { host: 'contract-service.amberdata.io', port: 443, path: '/api/v1/upload'}
const UPLOAD_ENDPOINT_TEST = { host: 'http://localhost' , port: 1234, path: UPLOAD_ENDPOINT.path }
const DEFAULT_BUILD_DIR = 'build/contracts/'
const apiKey = '' // TODO: Add key from config

const getMeta = abi => {
  const networks = networks[Math.max(...Object.keys(networks))]
  return {
    'contractAddress': networks.address,
    'walletAddress': web3.eth.accounts[0], // TODO: check truffle js
    'transactionHash': networks.transactionHash,
    'blockchainId': '1c9c969065fcd1cf'
  }
}

const uploadFile = (file, payload) => {
  const form = new FormData()
  form.append(fs.createReadStream(file))
  form.append('contractAddress', payload.contractAddress) // '0x06012c8cf97bead5deae237070f9587f8e7a266d')
  form.append('transactionHash', payload.transactionHash) // '0x34856fd3fb9656fc5e936db86d719e0a75fab5e9e7932a95effb0102dee16185')
  form.append('walletAddress', payload.walletAddress) // '0xb96bb2b19be0ad51a53aac842ef3e1ceff085663')
  form.append('blockchainId', payload.blockchainId) // '1c9c969065fcd1cf')
  form.submit({
    host: UPLOAD_ENDPOINT.host,
    port: UPLOAD_ENDPOINT.port,
    path: UPLOAD_ENDPOINT.path,
    // host: 'contract-service.amberdata.io',
    // port: 443,
    headers: { 'x-amberdata-api-key': apiKey }
  }, function(err, res) {
    console.log(err, res.statusCode)
  })
}

export function uploadModule() {
  fs.readdirSync(DEFAULT_BUILD_DIR).forEach(file => {
    let payload = getMeta()
    uploadFile(file, payload)
  })

  // form.append('uploadedFiles', fs.createReadStream('./tests/abi-test.json'))

  // // Testing
  // const body = {
  //   contractAddress: '0x06012c8cf97bead5deae237070f9587f8e7a266d',
  //   transactionHash: '0x34856fd3fb9656fc5e936db86d719e0a75fab5e9e7932a95effb0102dee16185',
  //   walletAddress: '0xb96bb2b19be0ad51a53aac842ef3e1ceff085663',
  //   blockchainId: '1c9c969065fcd1cf'
  // }
}
