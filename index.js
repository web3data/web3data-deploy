let fs = require('fs')
let path = require('path')
let FormData = require('form-data')
let dotenv = require('dotenv')
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

const DEFAULT_BUILD_DIR = path.join(__dirname, '/../../', 'build/contracts/')

const blockchainIds = {
  1: '1c9c969065fcd1cf', // Ethereum main-net
  4: '1b3f7a72b3e99c13' // Rinkeby Testnet
}

const getMeta = function(networks, network_id, account) {
  return {
    contractAddress: networks.address,
    walletAddress: account,
    transactionHash: networks.transactionHash,
    blockchainId: blockchainIds[network_id]
  }
}

const uploadFile = function(file, payload) {
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

const isEmpty = function(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

module.exports = function(deployer, network, accounts) {
  let network_id = parseInt(deployer.network_id)

  // Check that it is a network that'ss supported by web3data
  if ([1,4].indexOf(network_id) < 0) { return }

  fs.readdir(DEFAULT_BUILD_DIR, (err, files) => {
    for (let i = 1; i < files.length; i++) {
      const filePath = path.join(DEFAULT_BUILD_DIR, '/', files[i])
      const abi = JSON.parse(fs.readFileSync(filePath))
      let networks = abi.networks[network_id]
      if (!isEmpty(networks)) {
        const payload = getMeta(networks, network_id, accounts[0])
        uploadFile(filePath, payload)
      }
    }
  })
}
