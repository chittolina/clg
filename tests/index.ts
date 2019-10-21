import 'ts-mocha'
import * as path from 'path'
import * as fs from 'fs'
import server from '../src/api'
const Mocha = require('mocha')
const mocha = new Mocha()
const TEST_DIR = 'tests'

async function runTests() {
  await server.start()

  // Add each .js file to the mocha instance
  fs.readdirSync(TEST_DIR)
    .filter(
      file =>
        file.substr(-3) === '.ts' &&
        !file.startsWith(path.basename(__filename)),
    )
    .forEach(file => {
      mocha.addFile(path.join(TEST_DIR, file))
    })

  const failures = await new Promise(resolve => {
    mocha.run((failures: any) => {
      resolve(failures)
    })
  })

  process.exit(failures ? 1 : 0)
}

runTests()
