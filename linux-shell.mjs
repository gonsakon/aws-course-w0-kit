import { spawn, spawnSync } from 'node:child_process'
import { postboxVolume } from './result-contract.mjs'
import { assertSupportedNodeVersion } from './runtime-version.mjs'

assertSupportedNodeVersion()

// 本程序一律 exit 0：容器內的結束碼不往上傳，避免 npm 印出 error 牆。
// 嚴格驗收在 npm run check:docker。

const image = 'ubuntu:24.04'
const containerName = 'aws-w0-linux'
const containerHostname = 'aws-w0'

function tryDocker(args, timeout) {
  return spawnSync('docker', args, { encoding: 'utf8', timeout })
}

const info = tryDocker(['info', '--format', '{{.ServerVersion}}'], 20000)

if (info.error?.code === 'ENOENT') {
  console.error('還沒找到 docker 指令：請先照影片把 Docker Desktop 裝起來。')
  console.error('Windows 同學請用 PowerShell 執行（不要用 Git Bash）。')
  process.exit(0)
}

if (info.status !== 0) {
  console.error('Docker Desktop 還沒在跑：把它打開，等鯨魚圖示穩定後再執行一次 npm run linux。')
  process.exit(0)
}

if (tryDocker(['image', 'inspect', image], 20000).status !== 0) {
  console.log(`第一次進入會先下載 ${image}（看網速約 1〜3 分鐘），下載完會自動進入。`)
}

console.log('正在進入免洗 Ubuntu：玩完用 exit 離開，離開後這台就消失。')
console.log('（/postbox 是信箱：留在裡面的檔案不會跟機器一起消失，驗收會來看。）')

// 同名容器已存在就不掛 --name，改用 Docker 隨機名，避免 name conflict。
const nameTaken =
  tryDocker(['ps', '-a', '--quiet', '--filter', `name=^${containerName}$`], 20000)
    .stdout?.trim() !== ''

const runArgs = ['run', '-it', '--rm', '--hostname', containerHostname]
if (!nameTaken) runArgs.push('--name', containerName)
runArgs.push('-v', `${postboxVolume}:/postbox`, image)

const child = spawn('docker', runArgs, { stdio: 'inherit' })

child.on('error', () => process.exit(0))
child.on('close', () => {
  console.log('已離開 Ubuntu，這台已經消失。想再開一台新的：npm run linux')
  process.exit(0)
})
