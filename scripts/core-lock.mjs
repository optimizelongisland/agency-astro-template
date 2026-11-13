// Core lock: proves the locked foundation is identical to the agency template.
//
// The files under LOCKED_PATHS must be the same on every client site, so a fix
// made once in the template can be copied to all of them. `core.lock.json`
// records a fingerprint of each file. `npm run qc` fails if any locked file
// has been changed, added or removed on a client site.
//
//   node scripts/core-lock.mjs            verify (used by qc)
//   node scripts/core-lock.mjs --write    re-record. ONLY in the agency template
//                                         repo, when the core itself is updated.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lockFile = path.join(root, 'core.lock.json');

export const LOCKED_PATHS = ['src/core', 'src/pages/api', 'scripts', 'tests'];
export const CORE_VERSION = '1.0.0';

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

export function computeLock() {
  const files = {};
  for (const locked of LOCKED_PATHS) {
    for (const file of walk(path.join(root, locked)).sort()) {
      // Normalize line endings so a Windows checkout produces the same fingerprint.
      const content = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
      const rel = path.relative(root, file).split(path.sep).join('/');
      files[rel] = crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);
    }
  }
  return files;
}

// Returns a list of human-readable problems; empty means the core is intact.
export function verifyLock() {
  if (!fs.existsSync(lockFile)) return ['core.lock.json is missing'];
  const recorded = JSON.parse(fs.readFileSync(lockFile, 'utf8')).files ?? {};
  const actual = computeLock();
  const problems = [];
  for (const file of Object.keys(recorded)) {
    if (!(file in actual)) problems.push(`locked file was deleted: ${file}`);
    else if (actual[file] !== recorded[file]) problems.push(`locked file was modified: ${file}`);
  }
  for (const file of Object.keys(actual)) {
    if (!(file in recorded)) problems.push(`file added inside a locked folder: ${file}`);
  }
  return problems;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--write')) {
    const files = computeLock();
    fs.writeFileSync(lockFile, JSON.stringify({ coreVersion: CORE_VERSION, files }, null, 2) + '\n');
    console.log(`core.lock.json written: ${Object.keys(files).length} files, core version ${CORE_VERSION}`);
  } else {
    const problems = verifyLock();
    if (problems.length) {
      problems.forEach((p) => console.error(`  x ${p}`));
      process.exit(1);
    }
    console.log('Core is intact.');
  }
}
