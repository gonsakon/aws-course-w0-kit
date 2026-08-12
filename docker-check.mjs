import { spawnSync } from 'node:child_process'
import {
  dockerCheckerVersion,
  postboxVolume,
  resultSchemaVersion,
} from './result-contract.mjs'
import { beginResult, finishResult } from './result-writer.mjs'
import { assertSupportedNodeVersion } from './runtime-version.mjs'

assertSupportedNodeVersion()

// T2 環境驗收，三段：daemon 活著 → 容器起得來 → /postbox 有簽到檔。
// 簽到檔（2026-08-12 老闆定案）＝學生真的在 Linux 裡下過指令的程式實證；
// 打招呼指令本身仍不驗——招呼是體驗不是成績（w0-video-plan 定案）。

const image = 'ubuntu:24.04'
const resultPath = '.w0-results/docker.json'
const checkedAt = new Date().toISOString()

await beginResult(resultPath, {
  schemaVersion: resultSchemaVersion,
  task: 'w0-docker',
  checkerVersion: dockerCheckerVersion,
  passed: false,
  checkedAt,
})

function runDocker(args, timeout) {
  return spawnSync('docker', args, { encoding: 'utf8', timeout })
}

const info = runDocker(['info', '--format', '{{.ServerVersion}}'], 20000)

if (info.error?.code === 'ENOENT') {
  console.error('DOCKER_NOT_FOUND：找不到 docker 指令。')
  console.error('請先照影片安裝 Docker Desktop；Windows 請用 PowerShell 執行（不要用 Git Bash）。')
  process.exit(1)
}

if (info.status !== 0) {
  console.error('DOCKER_DAEMON_UNREACHABLE：Docker Desktop 還沒在跑。')
  console.error('請打開 Docker Desktop，等鯨魚圖示穩定後再執行一次。')
  process.exit(1)
}

const serverVersion = info.stdout.trim()

if (runDocker(['image', 'inspect', image], 20000).status !== 0) {
  console.error(`DOCKER_IMAGE_MISSING：還沒下載過 ${image}。`)
  console.error('請先執行 npm run linux 完成第一次進入（第一次會自動下載），再回來驗收。')
  process.exit(1)
}

const run = runDocker(['run', '--rm', image, '/bin/true'], 120000)

if (run.status !== 0) {
  console.error('DOCKER_CONTAINER_RUN_FAILED：容器啟動測試失敗。')
  const detail = (run.stderr ?? '').trim().split('\n').slice(-3).join('\n')
  if (detail) console.error(detail)
  console.error('請把上面訊息回報給老師（最晚開課前 5 天，越早越好救）。')
  process.exit(1)
}

const postbox = runDocker(
  [
    'run',
    '--rm',
    '--network',
    'none',
    '-v',
    `${postboxVolume}:/postbox`,
    image,
    // -s＝檔案存在且非空（2026-08-12 老闆規格：要有檔、裡面要有字）
    'test',
    '-s',
    '/postbox/hello.txt',
  ],
  120000,
)

if (postbox.status !== 0) {
  console.error('DOCKER_POSTBOX_EMPTY：信箱裡還沒有你的簽到檔。')
  console.error('執行 npm run linux 進入 Ubuntu，照影片打：echo hello world > /postbox/hello.txt')
  console.error('離開後再回來驗一次。')
  process.exit(1)
}

await finishResult(resultPath, {
  schemaVersion: resultSchemaVersion,
  task: 'w0-docker',
  checkerVersion: dockerCheckerVersion,
  passed: true,
  serverVersion,
  checkedAt,
})

console.log('W0 DOCKER ENV READY')
console.log(`Docker ${serverVersion}：${image} 容器啟動測試通過，/postbox 簽到檔已找到。`)
