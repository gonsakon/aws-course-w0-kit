const supportedNodeMajors = new Set([22, 24])

export function nodeMajor(version) {
  const match = String(version).trim().match(/^v?(\d+)(?:\.|$)/)
  return match ? Number(match[1]) : undefined
}

export function isSupportedNodeVersion(version = process.versions.node) {
  return supportedNodeMajors.has(nodeMajor(version))
}

export function assertSupportedNodeVersion(version = process.versions.node) {
  if (isSupportedNodeVersion(version)) return

  const internalTestOverride =
    process.env.NODE_ENV === 'test' &&
    process.env.W0_INTERNAL_TEST_ALLOW_UNSUPPORTED_NODE === '1'
  if (internalTestOverride) return

  console.error(
    `NODE_VERSION_UNSUPPORTED：目前 Node.js ${String(version).startsWith('v') ? version : `v${version}`} 不在 W0 支援範圍。`,
  )
  console.error('請安裝 Node.js v24 LTS（或仍受支援的 v22 LTS），重開終端機後再執行。')
  process.exit(1)
}
