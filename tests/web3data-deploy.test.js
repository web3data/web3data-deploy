import test from 'ava'
import fs from 'fs'
// import { addUploadFile } from '../scripts/postinstall'
import mock from 'mock-fs'
import uploadModule from '../index.js'
// import contract_abi from './abi-test.json'
//
// test.beforeEach(t => {
//   mock({
//     'migrations': {
//       '1_deploy_script.js': 'yadd, yadd, yadda',
//       '2_deploy_script.js': 'yadd, yadd, yadda',
//       '3_deploy_script.js': 'yadd, yadd, yadda'
//     },
//     'build/contracts': {
//       'contract_abi': JSON.stringify(contract_abi)
//     }
//   })
// })
//
// test.afterEach(t => {
//   mock.restore()
// })

// test('migrations dir exists (mock-fs is working)', t => {
//   t.truthy(fs.existsSync('./migrations'))
// })
//
// test('migrations dir contains mock deploy scripts (mock-fs is working)', t => {
//   let files = []
//   fs.readdirSync('migrations').forEach(file => {
//     files.push(file)
//   })
//   t.deepEqual(files, ['1_deploy_script.js', '2_deploy_script.js', '3_deploy_script.js']);
// })
//
// test('build/contract dir exists (mock-fs is working)', t => {
//   t.truthy(fs.existsSync('build/contracts'))
// })
//
// test('build/contract dir contains mock contract abi (mock-fs is working)', t => {
//   let files = []
//   fs.readdirSync('build/contracts').forEach(file => {
//     files.push(file)
//   })
//   t.deepEqual(files, ['contract_abi']);
// })

// test.only('postinstall script throws error if no migrations folder exists', t => {
//   mock({'something':{'asdf':asdf}})
//   const error = t.throws(() => { addUploadFile() }, Error);
//   t.is(error.message, 'Unable to locate migrations folder\ncheck that your \'migrations\' folder is in your project root directory');
//   mock.restore()
// })

test.skip('postinstall script throws error if migrations folder is empty', t => {
  mock.restore()
  mock({'migrations':{}})
  const error = t.throws(() => { addUploadFile() }, Error);
  t.is(error.message, 'migrations folder is empty');
})

test.skip('migrations folder contains \'X_abi_analytics\' w/ correct number', t => {
  addUploadFile()
  t.truthy(fs.existsSync(`../migrations`))
})

test.only('test upload', t => {
  uploadModule('rinkeby', '0x0000000000000000000000000000000000000000')
})