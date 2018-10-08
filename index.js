let fs = require('fs')
let path = require('path')
let FormData = require('form-data')
let dotenv = require('dotenv')

/* eslint-disable-next-line no-unresolved */
let trufflecConfig = require('./truffle.js') // eslint-disable-line extensions

dotenv.load()

const UPLOAD_ENDPOINT = {
  host: 'contract-service.amberdata.io',
  port: 443,
  path: '/api/v1/upload'
}
const UPLOAD_ENDPOINT_TEST = {
  host: 'localhost',
  port: 1234,
  path: UPLOAD_ENDPOINT.path
}

const DEFAULT_BUILD_DIR = path.join(__dirname, '/', 'build/contracts/')

const blockchainIds = {
  1: '1c9c969065fcd1cf', // Ethereum main-net
  4: '1b3f7a72b3e99c13' // Rinkeby Testnet
}

const getBlockchainId = network => {
  if (!trufflecConfig) {
    throw new Error('tuffle.js file not found')
  }

  if (!trufflecConfig.networks[network]) {
    throw new Error(`${network} not found in truffle.js`)
  }

  if (!trufflecConfig.networks[network].network_id) {
    throw new Error(`network_id for '${network}' not found in truffle.js`)
  }

  const blockchainId =
    blockchainIds[trufflecConfig.networks[network].network_id]

  if (!blockchainId) {
    throw new Error(`${network} not found or unsupported`)
  }

  return blockchainId
}

const getMeta = (file, network, account) => {
  const abi = JSON.parse(fs.readFileSync(file))
  const networks = abi.networks[Math.max(...Object.keys(abi.networks))]
  return {
    contractAddress: networks.address,
    walletAddress: account,
    transactionHash: networks.transactionHash,
    blockchainId: getBlockchainId(network)
  }
}

const uploadFile = (file, payload) => {
  const form = new FormData()
  form.append('uploadedFiles', fs.createReadStream(file))
  form.append('contractAddress', payload.contractAddress)
  form.append('transactionHash', payload.transactionHash)
  form.append('walletAddress', payload.walletAddress)
  form.append('blockchainId', payload.blockchainId)
  form.submit(
    {
      host: UPLOAD_ENDPOINT_TEST.host,
      port: UPLOAD_ENDPOINT_TEST.port,
      path: UPLOAD_ENDPOINT_TEST.path,
      headers: {'x-amberdata-api-key': process.env.API_KEY || ''}
    },
    (err, res) => {
      console.log(err, res.statusCode)
    }
  )
}

module.exports = function(network, account) {
  fs.readdirSync(DEFAULT_BUILD_DIR).forEach(file => {
    const filePath = path.join(DEFAULT_BUILD_DIR, '/', file)
    debugger
    const payload = getMeta(filePath, network, account)
    uploadFile(filePath, payload)
  })
}
