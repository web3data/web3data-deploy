const fs = require('fs')
const path = require('path')
let MIGRATIONS_DIR = path.join(__dirname, '/../../../', 'migrations')
const RERUN_MSG = 'To rerun the postinstall script:\n\tnpm explore web3data-deploy -- npm run postinstall'
let addUploadFile = function() {

  // Check that we can find the migrations folder
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    console.log(`\u001B[31mUnable to locate migrations folder check that your \'migrations\' folder is in your project root directory\u001B[0m\n${RERUN_MSG}`)
  } else {

    // Iterate through files in the migrations directory
    fs.readdir(MIGRATIONS_DIR, (err, files) => {
      if (err) {
        console.log(`\u001B[31m${err}\u001B[0m\n`)
      }
      if (!files.length > 0) {
        console.log('\u001B[31mMigrations folder is empty\u001B[0m\n')
      }
      const num_prefix = files.length + 1
      const ABI_ANALYTICS_PATH = path.join(MIGRATIONS_DIR, `${num_prefix}_abi_analytics.js`)
      const abiSource = fs.readFileSync('./x_abi_analytics.js')
      fs.writeFileSync(ABI_ANALYTICS_PATH, abiSource, 'utf-8')

      console.log(`'${num_prefix}_abi_analytics' has been added to your 'migrations' directory!`)
      console.log("Set your api key one of two ways:\n\t1) Run 'export AMBERDATA_API_KEY=<your_api_key>' in terminal\n\t2) Add this line: 'AMBERDATA_API_KEY=<your_api_key>' to your .env file\n")
      console.log("Need an api key? Go to \u001B[36mhttps://amberdata.io/user/api-keys\u001B[0m to obtain one!\n")
    })
  }
}
addUploadFile()
