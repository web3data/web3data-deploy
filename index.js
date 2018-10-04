const fs = require('fs');
const got = require('got');
const FormData = require('form-data');

const UPLOAD_ENDPOINT = 'http://localhost:1234/api/v1/upload'
const DEFAULT_BUILD_DIR = 'build/contracts/'
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

export async function uploadModule() {

  const form = new FormData();

  form.append('abi_0', fs.createReadStream('./abi-test.json'));

  let body = {
    contractAddress: "0x...", // address of deployed contract, post confirmation
    walletAddress: "0x...", // address of wallet, used in the deploy process
    transactionHash: "0xfdsfds..." // transaction hash of confirmed deploy txn
  }

  got.post(UPLOAD_ENDPOINT, {
    body: form
  })

  // await uploadFile('./abi-test.json', body)

  // fs.readdirSync(DEFAULT_BUILD_DIR).forEach(file => {
  //   uploadFile(filePath, body)
  // })

}

// const fs = require('fs');
// const got = require('got');
// const FormData = require('form-data');
// const form = new FormData();
//
// form.append('my_file', fs.createReadStream('/foo/bar.jpg'));
//
// got.post('google.com', {
// 	body: form
// });
