// check-no-secrets.mjs — build hygiene (D-spa-8). The SPA is a public client; the
// only credential-shaped value that legitimately ships is the PUBLIC Auth0
// client_id. This scans the built bundle for secret *values* (not library
// parameter names like "client_secret", which the Auth0 SDK references
// internally) and fails the lane if any appear.
//
// Run against dist/ after `vite build`.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const DIST = resolve(HERE, '../dist')

// Value-shaped patterns. Each must match an actual secret value, not an
// identifier or format string.
const RULES = [
  { name: 'fabric SA token', re: /fab_sa_[A-Za-z0-9_-]{12,}/ },
  { name: 'AWS access key id', re: /AKIA[0-9A-Z]{16}/ },
  { name: 'PEM private key body', re: /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s]*[A-Za-z0-9+/=]{40,}/ },
  // An assigned secret literal (quoted value), e.g. client_secret: "abc…".
  // The SDK's `client_secret: n` (a variable) does not match.
  { name: 'assigned client_secret literal', re: /client_secret["'`]?\s*[:=]\s*["'`][A-Za-z0-9_-]{20,}["'`]/ },
  { name: 'Vault token', re: /\b[hs]vs\.[A-Za-z0-9]{20,}/ },
]

function walk(dir) {
  const out = []
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) out.push(...walk(p))
    else if (/\.(js|css|html|map)$/.test(e)) out.push(p)
  }
  return out
}

const target = process.argv[2] ? resolve(process.cwd(), process.argv[2]) : DIST
let failed = false
for (const file of walk(target)) {
  const text = readFileSync(file, 'utf8')
  for (const { name, re } of RULES) {
    const m = re.exec(text)
    if (m) {
      failed = true
      console.error(`check:secrets: ${name} found in ${file}: ${m[0].slice(0, 40)}…`)
    }
  }
}

if (failed) {
  console.error('check:secrets: FAIL — secret-shaped value in the build')
  process.exit(1)
}
console.log('check:secrets: OK — no secret values in the build')
