import { createHash } from 'node:crypto'

export { isSafeVolumeName, isVolumeId, linuxCheckIds } from './linux-live-check.mjs'

export const resultSchemaVersion = 2
export const accountCheckerVersion = 'w0-account-check-v4'
export const dockerCheckerVersion = 'w0-docker-check-v2'
// 免洗容器唯一掛載的 volume：學生簽到信箱（npm run linux 掛入、check:docker 驗收）
export const postboxVolume = 'aws-w0-postbox'
export const networkCheckerVersion = 'w0-network-quiz-v2'
export const networkQuizVersion = 'w0-network-concepts-v1'
export const linuxCheckerVersion = 'w0-linux-check-v2'

export function hashProof(raw) {
  return createHash('sha256').update(raw, 'utf8').digest('hex')
}

export function isIsoTimestamp(value) {
  return typeof value === 'string' && Number.isFinite(Date.parse(value))
}
