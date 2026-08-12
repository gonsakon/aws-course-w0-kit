import { mkdir, rm, writeFile } from 'node:fs/promises'

async function writeResult(path, value) {
  await mkdir('.w0-results', { recursive: true })
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

export async function beginResult(path, value) {
  await mkdir('.w0-results', { recursive: true })
  await rm(path, { force: true })
  await writeResult(path, value)
}

export async function finishResult(path, value) {
  await writeResult(path, value)
}
