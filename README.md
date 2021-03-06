[![Build Status](https://travis-ci.com/web3data/web3data-deploy.svg?branch=master)](https://travis-ci.com/web3data/web3data-deploy)
[![Discord](https://img.shields.io/discord/102860784329052160.svg)](https://forum.amberdata.io/)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)

## Table of Contents
&nbsp;&nbsp;[Usage](#usage)
<br/>&nbsp;&nbsp;&nbsp;&nbsp;[Installation](#installation)
<br/>&nbsp;&nbsp;&nbsp;&nbsp;[Permissions](#permissions)
<br/>&nbsp;&nbsp;&nbsp;&nbsp;[Networks](#networks)
<br/>&nbsp;&nbsp;[Community](#community)
<br/>&nbsp;&nbsp;[Resources](#resources)
<br/>&nbsp;&nbsp;[Licensing](#licensing)

# web3data-deploy
A module to upload contract ABI to [Amberdata.io](amberdata.io), allowing for automated security audits and analytics!

## Usage
Install the module and the post-install script will add a migration script to your migrations folder.
Then run `truffle migrate` and the script will handle the rest, uploading your contract ABI to our upload endpoint! 🚀

### Installation

```bash
npm install web3data-deploy
```
<!-- # Testing -->

### Permissions
The `postinstall.js` script may fail if it does not have the proper permissions.

If this is the case, run:
```bash
chmod +x node_modules/web3data-deploy/scripts/postinstall.js
```
and then:
```bash
npm explore web3data-deploy-- npm run postinstall
```

### Networks
Amberedata.io currently supports Ethereum Mainnet & Ropsten Testnet.

#### Network Not Supported Error
You may see an error:
```bash
 [ Uploader ] INFO: Network, 'X', not supported by amberdata. Contract ABI not uploaded.
```

This could occur if you are deploying to an unsupported network or (and more likely)
the network id in your truffle.js file is wrong.

Make sure that the network id corresponds with the [JSON RPC network ids](https://github.com/ethereum/wiki/wiki/JSON-RPC#net_version):
- `"1"`: Ethereum Mainnet
- `"4"`: Rinkeby Testnet

Like so:
```js
// truffle.js
module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // Match any network id
    },
    rinkeby: {
      network_id: 4
    },
    mainet: {
      network_id: 1
    }
  }
}
```


## Community
Come join the discussion on [Discourse](https://forum.amberdata.io/)!

## Resources
[Contributing](./CONTRIBUTING.md)

## Licensing

This project is licensed under the [Apache Licence 2.0](./LICENSE).
