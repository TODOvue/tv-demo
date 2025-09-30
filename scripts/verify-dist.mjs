import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const distDir = join(process.cwd(), 'dist');
const files = readdirSync(distDir).filter(f => f.endsWith('.js'));

let hasError = false;
const defaultVuePattern = /import\s+([A-Za-z_$][\w$]*)\s*(,|from)\s*(?:{[^}]*}\s*from\s*)?["']vue["']/;
const mixedPattern = /import\s+[A-Za-z_$][\w$]*\s*,\s*{[^}]+}\s*from\s*["']vue["']/;

for (const f of files) {
  const full = join(distDir, f);
  const content = readFileSync(full, 'utf8');
  
  if (defaultVuePattern.test(content) || mixedPattern.test(content)) {
    console.error(`❌ Detected default Vue import in: ${f}`);
    hasError = true;
  }
}

if (hasError) {
  console.error('Verification failed: issues detected in dist files.');
  process.exit(1);
} else {
  console.log('✅ Verification OK: no default Vue import found.');
}

