import { spawn, spawnSync } from 'node:child_process'
import { postboxVolume } from './result-contract.mjs'
import { assertSupportedNodeVersion } from './runtime-version.mjs'

assertSupportedNodeVersion()

// 進入免洗 Ubuntu 的門（npm run linux）。
// 這是「門」不是「驗收」：不管裡面發生什麼，本程序一律 exit 0——
// bash 的 exit 會帶出最後一個指令的狀態碼（例如玩「安全的失敗」打 npm install 吃 127），
// 若把它往上傳，npm 會噴整面紅色 error 牆，嚇壞第一次進 Linux 的學生。
// 嚴格驗收在 npm run check:docker，不在這裡。
// 刻意不設 --hostname：預設 hostname 每次都變，是打招呼儀式「真的免洗」的教學拍點。
//
// /postbox（2026-08-12 老闆定案）：唯一掛進容器的 volume，當「寄回驗收的信箱」。
// 學生照抄 `echo 你好 > /postbox/hello.txt` 留下簽到檔＝證明真的在 Linux 裡下過指令；
// 機器免洗、信箱不死——這一幕同時是 W7 資料持久化故事的種子。

const image = 'ubuntu:24.04'

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

const child = spawn(
  'docker',
  ['run', '-it', '--rm', '-v', `${postboxVolume}:/postbox`, image],
  { stdio: 'inherit' },
)

child.on('error', () => process.exit(0))
child.on('close', () => {
  console.log('已離開 Ubuntu，這台已經消失。想再開一台新的：npm run linux')
  process.exit(0)
})
