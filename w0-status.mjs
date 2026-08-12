import { readFile } from 'node:fs/promises'
import {
  dockerCheckerVersion,
  isIsoTimestamp,
  resultSchemaVersion,
} from './result-contract.mjs'
import { assertSupportedNodeVersion } from './runtime-version.mjs'

assertSupportedNodeVersion()

// W0 單關制（2026-08-12 定案）：kit 只驗 T2 Docker 環境。
// T1 帳號驗收改為兩張截圖（Console 東京首頁＋Authenticator 的 AWS 條目），
// 由人工檢視，不經 kit——自我聲明制（account-proof.txt）同日廢除。
// quiz:network 與 check:linux 腳本保留在 kit，隨 W3 前網路包／EC2 前生存包重掛。

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
