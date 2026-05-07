import { readFileSync } from 'node:fs';

const commitMessagePath = process.argv[2];

if (!commitMessagePath) {
  console.error('Commit message file path is required.');
  process.exit(1);
}

const message = readFileSync(commitMessagePath, 'utf8').trim();
const [subject, ...bodyLines] = message.split(/\r?\n/);

const SUBJECT_PATTERN =
  /^\[(INIT|FEAT|UPDATE|FIX|REFACTOR|DOCS|DESIGN)!?\]: .+/;
const FOOTER_PATTERN =
  /^(Fixes|Resolves|Ref|Related to): #[0-9]+(,\s*#[0-9]+)*$/;

if (!SUBJECT_PATTERN.test(subject)) {
  console.error('Invalid commit message subject.');
  console.error('');
  console.error('Expected format:');
  console.error('[TYPE]: subject');
  console.error('');
  console.error('Allowed TYPE values:');
  console.error('[INIT], [FEAT], [UPDATE], [FIX], [REFACTOR], [DOCS], [DESIGN]');
  console.error('');
  console.error('Break changes use ! after TYPE:');
  console.error('[FEAT!]: 랭킹 점수 계산 공식 변경');
  process.exit(1);
}

const footerLines = bodyLines
  .map((line) => line.trim())
  .filter((line) => /^(Fixes|Resolves|Ref|Related to):/.test(line));

const invalidFooter = footerLines.find((line) => !FOOTER_PATTERN.test(line));

if (invalidFooter) {
  console.error(`Invalid issue footer: ${invalidFooter}`);
  console.error('');
  console.error('Expected footer format:');
  console.error('Resolves: #123');
  console.error('Ref: #456');
  console.error('Related to: #48, #45');
  process.exit(1);
}
