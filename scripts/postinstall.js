const fs = require('fs')
const path = require('path')
let MIGRATIONS_DIR = path.join(__dirname, '/../../../', 'migrations')
const RERUN_MSG = 'To rerun the postinstall script:\n\tnpm explore web3data-deploy -- npm run postinstall'
let addUploadFile = function() {

  if (!fs.existsSync(MIGRATIONS_DIR)) {
    throw new Error(`\u001B[31mUnable to locate migrations folder check that your \'migrations\' folder is in your project root directory\u001B[0m\n${RERUN_MSG}`)
  }

  // Iterate through files in the migrations directory
  fs.readdir(MIGRATIONS_DIR, (err, files) => {
    if (err) throw err
    if (!files.length > 0) throw new Error('Migrations folder is empty')

    const ABI_ANALYTICS_PATH = path.join(MIGRATIONS_DIR, `${files.length + 2}-abi-analytics.js`)
    const abiSource = fs.readFileSync('./x-abi-analytics.js')
    fs.writeFileSync(ABI_ANALYTICS_PATH, abiSource, 'utf-8')

    console.log(`'${files.length + 2}-abi-analytics' has been added to your 'migrations' directory!`)
    console.log("Set your api key one of two ways:\n\t1) Run 'export AMBERDATA_API_KEY=<your_api_key>' in terminal\n\t2) Add this line: 'AMBERDATA_API_KEY=<your_api_key>' to your .env file\n")
    console.log("Need an api key? Go to \u001B[36mhttps://amberdata.io/user/api-keys\u001B[0m to obtain one!\n")
  })
}
addUploadFile()
