import { readFile } from 'node:fs/promises'
import {
  dockerCheckerVersion,
  isIsoTimestamp,
  resultSchemaVersion,
} from './result-contract.mjs'
import { assertSupportedNodeVersion } from './runtime-version.mjs'

assertSupportedNodeVersion()

async function readJson(path) {
  try {
    return JSON.parse(await readFile(path, 'utf8'))
  } catch {
    return undefined
  }
}

function validDocker(result) {
  return (
    result &&
    result.schemaVersion === resultSchemaVersion &&
    result.task === 'w0-docker' &&
    result.checkerVersion === dockerCheckerVersion &&
    isIsoTimestamp(result.checkedAt) &&
    result.passed === true
  )
}

const docker = await readJson('.w0-results/docker.json')
const dockerPassed = validDocker(docker)

const dockerLabel = dockerPassed ? 'PASS' : docker ? 'INVALID / RETRY' : 'MISSING'
const overallStatus = dockerPassed ? 'READY' : 'NOT READY'

const pad = (label) => label.padEnd(26)
console.log(`${pad('Docker environment')}${dockerLabel}`)
console.log(`${pad('W0 STATUS')}${overallStatus}`)

if (!dockerPassed) process.exitCode = 1
