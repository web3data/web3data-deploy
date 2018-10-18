const fs = require('fs')
const url = require('url')
const path = require('path')
const FormData = require('form-data')
const dotenv = require('dotenv')

dotenv.load()

const prodUrl = url.parse('https://contract-service.amberdata.io/api/v1/upload')
const devUrl = url.parse('http://localhost:1234/api/v1/upload')
const mainPath = process.env.NODE_ENV === 'development' ? devUrl : prodUrl
const headers = {'x-amberdata-api-key': process.env.AMBERDATA_API_KEY || ''}

// The standard path to the contract apis per truffle specs
const DEFAULT_BUILD_DIR = path.join(__dirname, '/../../', 'build/contracts/')

// An Object containing amberdata specfic values for use with our api
const blockchainIds = {
  1: {
    blockchainId: '1c9c969065fcd1cf',
    slug: 'ethereum-mainnet'
  },
  4: {
    blockchainId: '1b3f7a72b3e99c13',
    slug: 'ethereum-rinkeby'
  }
}

// Ethereum JSON RPC network_ids for user help message
const ETHEREUM_NETWORKS = {
  1: 'Ethereum Mainnet',
  3: 'Ropsten Testnet',
  4: 'Rinkeby Testnet',
  42: 'Kovan Testnet'
}

/**
 * @desc getMeta() returns an object containing the
 * metadata of the contract to upload with the abi
 * @param { Object } networks contains details of the deployed contract
 * @param { Object } networkId the JSON RPC network_id of the
 *                   network that the contract was deployed to
 * @param { Object } account the deployer account address
 * @return { Object } the metadata of the contract
 */
const getMeta = function(networks, networkId, account) {
  return {
    contractAddress: networks.address,
    walletAddress: account,
    transactionHash: networks.transactionHash,
    blockchainId: blockchainIds[networkId].blockchainId,
    slug: blockchainIds[networkId].slug
  }
}

/**
 * @desc uploadAbi() uploads a multipart format of files
 * @param { String } file the path of the file to upload
 * @param { Object } payload the metadata to upload with the contract abi
 */
const uploadAbi = function(file, payload) {
  const form = new FormData()
  form.append('uploadedFiles', fs.createReadStream(file))
  form.append('contractAddress', payload.contractAddress)
  form.append('transactionHash', payload.transactionHash)
  form.append('walletAddress', payload.walletAddress)
  form.append('blockchainId', payload.blockchainId)
  const options = Object.assign({}, mainPath, {headers})
  form.submit(options, (err, res) => {
    if (err) {
      console.log(err, res.statusCode)
    } else {
      console.log(
        `[ Uploader ] \u001B[32mINFO:\u001B[0m View your contract at: \u001B[36mhttps://${
          payload.slug
        }.amberdata.io/addresses/${payload.contractAddress}/management\u001B[0m`
      )
    }
  })
}

/**
 * @desc isEmpty() takes an object and
 * evaluates whether an object is empty or not
 * @param { Object } obj the object that's tested for emptiness
 * @return { Boolean } true if empty and false otherwise
 */
const isEmpty = function(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

/**
 * @desc Uploads contract abi to amberdata servers
 * @param { Object } deployer the truffle deployer object
 * @param { String } network name of the network as defined in truffle.js
 * @param { Array } accounts the list of account addresses
 */
module.exports = function(deployer, network, accounts) {
  const networkId = parseInt(deployer.network_id, 10)

  // Check that network is supported by amberdata
  if ([1, 4].indexOf(networkId) < 0) {
    console.info(
      `\n [ Uploader ] \u001B[32mINFO:\u001B[0m Network, '${
        ETHEREUM_NETWORKS[networkId] ? ETHEREUM_NETWORKS[networkId] : networkId
      }', not supported by amberdata. Contract ABI not uploaded.\n`
    )
    return
  }

  fs.readdir(DEFAULT_BUILD_DIR, (err, files) => {
    if (err) {
      console.log(`\u001B[31m${err}\u001B[0m\n`)
    } else {
      for (let i = 1; i < files.length; i++) {
        // Get absolute file path of conract abi and load the api
        const filePath = path.join(DEFAULT_BUILD_DIR, '/', files[i])
        const abi = JSON.parse(fs.readFileSync(filePath))

        /* Check if the networks field is empty. If it is, then contract
       * was not deployed to a network
       */
        if (isEmpty(abi.networks)) {
          console.log(
            `\n[ Uploader ] \u001B[32mINFO:\u001B[0m '${
              files[i]
            }' might not have been deployed therefore it was skipped by the Uploader`
          )
        } else {
          // Get the 'networks' object from the abi, parse data and contruct the payload then upload the file
          const networks = abi.networks[networkId]
          const payload = getMeta(networks, networkId, accounts[0])
          uploadAbi(filePath, payload)
        }
      }
    }
  })
}
