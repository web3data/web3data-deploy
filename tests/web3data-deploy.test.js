import test from 'ava'
import fs from 'fs'
import { addUploadFile } from '../scripts/postinstall'
import mock from 'mock-fs'

test.beforeEach(t => {
  mock({
    'migrations': {
      '1_deploy_script.js': 'yadd, yadd, yadda',
      '2_deploy_script.js': 'yadd, yadd, yadda',
      '3_deploy_script.js': 'yadd, yadd, yadda'
    },
    'build/contracts': {
      'contractA.json': {},
      'contractB.json': {}
    }
  })
})

test.afterEach(t => {
  mock.restore()
})

test('migrations dir exists (mock-fs is working)', t => {
  t.truthy(fs.existsSync('migrations'))
})

test.only('migrations dir contains mock deploy scripts (mock-fs is working)', t => {
  let files = []
  fs.readdirSync('migrations').forEach(file => {
    files.push(file)
  })
  t.deepEqual(files, ['0_deploy_script.js', '1_deploy_script.js', '2_deploy_script.js']);
})

test('build/contract dir exists (mock-fs is working)', t => {
  t.truthy(fs.existsSync('build/contract'))
})

test('migrations dir contains mock deploy scripts (mock-fs is working)', t => {
  let files = []
  fs.readdirSync('migrations').forEach(file => {
    files.push(file)
  })
  t.deepEqual(files, ['0_deploy_script.js', '1_deploy_script.js', '2_deploy_script.js']);
})

test('postinstall script throws error if no migrations folder exists', t => {
  mock.restore()
  mock({'':{}})
  const error = t.throws(() => { addUploadFile() }, Error);
  t.is(error.message, 'Unable to locate migrations folder\ncheck that your \'migrations\' folder is in your project root directory');
})

test('postinstall script throws error if no migrations folder exists', t => {
  mock.restore()
  mock({'migrations':{}})
  const error = t.throws(() => { addUploadFile() }, Error);
  t.is(error.message, 'migrations folder is empty');
})

test('migrations folder contains \'X_abi_analytics\' w/ correct number', t => {
  addUploadFile()
  t.truthy(fs.existsSync('migrations/4_abi_analytics'))
})
