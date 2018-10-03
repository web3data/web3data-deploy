import fs from 'fs'
export function addUploadFile() {
  if (!fs.existsSync('migrations')) {
    throw new Error('Unable to locate migrations folder\ncheck that your \'migrations\' folder is in your project root directory')
  }

  // Get all files in migrations folder
  let files = []
  fs.readdirSync('migrations').forEach(file => {
    files.push(file) // TODO: check here for lowest num
  })

  if(!files.length > 0) {
    throw new Error('migrations folder is empty')
  }

  // Create X_abi_analytics file
  let num_prefix = files.length + 1
  fs.writeFileSync(`migrations/${num_prefix}_abi_analytics`, 'import uploadModule from \'web3data-deploy\'\nuploadModule()', 'utf-8')
}
