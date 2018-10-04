import fs from 'fs'
import FormData from 'form-data'
import web3 from 'web3'
import trufflecConfig from './truffle.js' // Add . for prod
import dotenv from 'dotenv'
dotenv.load()

const UPLOAD_ENDPOINT = { host: 'contract-service.amberdata.io', port: 443, path: '/api/v1/upload'}
const UPLOAD_ENDPOINT_TEST = { host: 'localhost' , port: 1234, path: UPLOAD_ENDPOINT.path }
const DEFAULT_BUILD_DIR = 'build/contracts/'

const blockchainIds = {
  1: '1c9c969065fcd1cf', // Ethereum main-net
  4: '1b3f7a72b3e99c13' // Rinkeby Testnet
}

const getBlockchainId = (network) => {

  if(!trufflecConfig) {
    throw new Error('tuffle.js file not found')
  }

  if(!trufflecConfig.networks[network]) {
    throw new Error(`${network} not found in truffle.js`)
  }

  if(!trufflecConfig.networks[network].network_id) {
    throw new Error(`network_id for '${network}' not found in truffle.js`)
  }

  let blockchainId = blockchainIds[trufflecConfig.networks[network].network_id]

  if(!blockchainId) {
    throw new Error(`${network} not found or unsupported`)
  }

  return blockchainId
}

const getMeta = (file, network, account) => {
  const abi = JSON.parse(fs.readFileSync(file))
  const networks = abi.networks[Math.max(...Object.keys(abi.networks))]

  return {
    'contractAddress': networks.address,
    'walletAddress': account,
    'transactionHash': networks.transactionHash,
    'blockchainId': getBlockchainId(network)
  }
}

const uploadFile = (file, payload) => {
  const form = new FormData()
  form.append('uploadedFiles', fs.createReadStream(file))
  form.append('contractAddress', payload.contractAddress) // '0x06012c8cf97bead5deae237070f9587f8e7a266d')
  form.append('transactionHash', payload.transactionHash) // '0x34856fd3fb9656fc5e936db86d719e0a75fab5e9e7932a95effb0102dee16185')
  form.append('walletAddress', payload.walletAddress) // '0xb96bb2b19be0ad51a53aac842ef3e1ceff085663')
  form.append('blockchainId', payload.blockchainId) // '1c9c969065fcd1cf')
  form.submit({
    host: UPLOAD_ENDPOINT_TEST.host,
    port: UPLOAD_ENDPOINT_TEST.port,
    path: UPLOAD_ENDPOINT_TEST.path,
    headers: { 'x-amberdata-api-key': process.env.API_KEY || '' }
  }, (err, res) => {
    console.log(err, res.statusCode)
  })
}

module.exports = function(network, account) {
  fs.readdirSync(DEFAULT_BUILD_DIR).forEach(file => {
    let filePath = `${__dirname}/${DEFAULT_BUILD_DIR}${file}`
    let payload = getMeta(filePath, network, account)
    uploadFile(filePath, payload)
  })
}
