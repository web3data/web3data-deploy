import fs from 'fs'
const MIGRATIONS_DIR = `${__dirname}/migrations`
export function addUploadFile() {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    throw new Error('Unable to locate migrations folder\ncheck that your \'migrations\' folder is in your project root directory')
  }

  // Get all files in migrations folder
  fs.readdir(MIGRATIONS_DIR, (err, files) => {
    if (err) throw err
    if (!files.length > 0) throw new Error('migrations folder is empty')
    fs.writeFileSync(`migrations/${files.length + 2}_abi_analytics`, 'import uploadModule from \'web3data-deploy\'\nmodule.exports = function(network, accounts) {\n\tuploadModule(network, accounts)\n}', 'utf-8')
  })
}
