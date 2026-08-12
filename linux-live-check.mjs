import { spawnSync } from 'node:child_process'

export const linuxVolumeLabelKey = 'aws-course.w0'
export const linuxVolumeLabelValue = 'livefit-linux-survival-v1'

export const linuxChecks = [
  {
    id: 'ownership-marker',
    label: '教材所有權標記',
    command: 'printf "livefit-linux-survival-v1\\n" | cmp -s - /workspace/.w0-owner',
  },
  {
    id: 'volume-id',
    label: '教材 Volume 識別碼',
    command: 'test -s /workspace/.w0-volume-id',
  },
  { id: 'workspace', label: 'LiveFit 工作目錄', command: 'test -d /workspace/livefit/logs' },
  { id: 'env-file', label: '.env.example', command: 'test -f /workspace/livefit/.env.example' },
  {
    id: 'env-content',
    label: '.env.example 精確內容',
    command: 'printf "PORT=3000\\n" | cmp -s - /workspace/livefit/.env.example',
  },
  {
    id: 'log-content',
    label: 'app.log 精確內容與順序',
    command:
      'printf "INFO server boot\\nERROR database unavailable\\n" | cmp -s - /workspace/livefit/logs/app.log',
  },
  { id: 'backup', label: '設定備份', command: 'test -f /workspace/livefit/config.backup' },
  {
    id: 'backup-content',
    label: '備份內容一致',
    command: 'cmp -s /workspace/livefit/.env.example /workspace/livefit/config.backup',
  },
  {
    id: 'permission',
    label: '備份檔權限 600',
    command: 'test "$(stat -c %a /workspace/livefit/config.backup)" = "600"',
  },
  {
    id: 'temporary-removed',
    label: '暫存檔已刪除',
    command: 'test ! -e /workspace/livefit/temporary.txt',
  },
  {
    id: 'completion',
    label: '完成標記精確內容',
    command: 'printf "W0 LINUX READY\\n" | cmp -s - /workspace/livefit/completion.txt',
  },
]

export const linuxCheckIds = linuxChecks.map(({ id }) => id)

export function isSafeVolumeName(value) {
  return typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9_.-]+$/.test(value)
}

export function isVolumeId(value) {
  return (
    typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  )
}

function runDocker(args) {
  return spawnSync('docker', args, { encoding: 'utf8' })
}

function failedCheck(code, ...messages) {
  return {
    checked: false,
    passed: false,
    volumeId: null,
    checks: [],
    issue: { code, messages },
  }
}

export function checkLinuxVolume({ volumeName, expectedVolumeId } = {}) {
  if (!isSafeVolumeName(volumeName)) {
    return failedCheck('LAB_VOLUME_INVALID', 'LAB_VOLUME_INVALID：Docker Volume 名稱格式不合法。')
  }

  const version = runDocker(['version', '--format', '{{.Server.Version}}'])
  if (version.error?.code === 'ENOENT') {
    return failedCheck('DOCKER_NOT_FOUND', 'DOCKER_NOT_FOUND：找不到 docker 指令。')
  }
  if (version.status !== 0) {
    return failedCheck(
      'DOCKER_DAEMON_OFF',
      'DOCKER_DAEMON_OFF：Docker CLI 存在，但無法連到 Docker Engine。',
      '請啟動 Docker Desktop，再執行 docker info。',
    )
  }

  const volume = runDocker(['volume', 'inspect', volumeName])
  if (volume.status !== 0) {
    const inspectOutput = `${volume.stdout}\n${volume.stderr}`
    if (/no such volume/i.test(inspectOutput)) {
      return failedCheck(
        'LAB_VOLUME_MISSING',
        `LAB_VOLUME_MISSING：找不到 ${volumeName} Docker Volume。`,
        '請回到 00-3，先建立 Volume 並完成 Ubuntu 任務。',
      )
    }
    return failedCheck(
      'LAB_VOLUME_INSPECT_FAILED',
      'LAB_VOLUME_INSPECT_FAILED：無法確認教材 Volume。',
      volume.stderr.trim(),
    )
  }

  let volumeMetadata
  try {
    volumeMetadata = JSON.parse(volume.stdout)[0]
  } catch {
    return failedCheck(
      'LAB_VOLUME_INSPECT_FAILED',
      'LAB_VOLUME_INSPECT_FAILED：Docker 回傳的 Volume 資訊無法解析。',
    )
  }

  if (volumeMetadata?.Labels?.[linuxVolumeLabelKey] !== linuxVolumeLabelValue) {
    return failedCheck(
      'LAB_VOLUME_OWNERSHIP_MISMATCH',
      'LAB_VOLUME_OWNERSHIP_MISMATCH：Volume 不是由本教材初始化，拒絕掛載。',
    )
  }

  const image = runDocker(['image', 'inspect', 'ubuntu:24.04'])
  if (image.status !== 0) {
    return failedCheck(
      'LAB_IMAGE_MISSING',
      'LAB_IMAGE_MISSING：找不到 ubuntu:24.04 image。',
      '請先執行 docker pull ubuntu:24.04。',
    )
  }

  const shellScript = linuxChecks
    .map(
      ({ id, command }) =>
        `if ${command}; then printf 'PASS|${id}\\n'; else printf 'FAIL|${id}\\n'; fi`,
    )
    .join('\n')
  const volumeIdCommand =
    "printf 'VOLUME_ID|%s\\n' \"$(head -n 1 /workspace/.w0-volume-id 2>/dev/null)\""
  const checkRun = runDocker([
    'run',
    '--rm',
    '--pull',
    'never',
    '--network',
    'none',
    '--read-only',
    '--mount',
    `type=volume,src=${volumeName},dst=/workspace,readonly`,
    'ubuntu:24.04',
    'sh',
    '-lc',
    `${shellScript}\n${volumeIdCommand}`,
  ])

  if (checkRun.status !== 0) {
    const messages = ['LINUX_CHECK_FAILED：驗收 Container 無法執行。']
    if (checkRun.stderr.trim()) messages.push(checkRun.stderr.trim())
    return failedCheck('LINUX_CHECK_FAILED', ...messages)
  }

  const outputLines = checkRun.stdout.trim().split(/\r?\n/)
  const volumeId = outputLines
    .find((line) => line.startsWith('VOLUME_ID|'))
    ?.slice('VOLUME_ID|'.length)
  const resultById = new Map(
    outputLines
      .filter((line) => /^(?:PASS|FAIL)\|/.test(line))
      .map((line) => line.split('|'))
      .map(([status, id]) => [id, status]),
  )
  const checks = linuxChecks.map(({ id, label }) => ({
    id,
    label,
    passed: resultById.get(id) === 'PASS',
  }))
  const validVolumeId = isVolumeId(volumeId)
  if (!validVolumeId) {
    const volumeIdResult = checks.find((result) => result.id === 'volume-id')
    if (volumeIdResult) volumeIdResult.passed = false
  }

  const volumeIdMatches = expectedVolumeId === undefined || volumeId === expectedVolumeId
  const passed = checks.every((result) => result.passed) && volumeIdMatches
  let issue
  if (!volumeIdMatches) {
    issue = {
      code: 'LAB_VOLUME_ID_MISMATCH',
      messages: [
        'LAB_VOLUME_ID_MISMATCH：目前教材 Volume 識別碼與既有驗收結果不符。',
        '請重新執行 npm run check:linux。',
      ],
    }
  } else if (!passed) {
    issue = {
      code: 'LINUX_TASK_INCOMPLETE',
      messages: ['LINUX_TASK_INCOMPLETE：目前 Volume 內容未通過 Linux 驗收。'],
    }
  }

  return {
    checked: true,
    passed,
    volumeId: validVolumeId ? volumeId : null,
    checks,
    issue,
  }
}
