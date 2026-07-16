import { execSync } from 'node:child_process';

// 커밋에 하드코딩된 IPv4 주소가 들어가는 것을 막는다.
// (환경별 주소는 코드/예시파일에 IP 대신 플레이스홀더나 런타임 주입(window.__ENV__)을 사용)

// 오탐/무해한 주소는 허용
const ALLOWED_IPS = new Set(['127.0.0.1', '0.0.0.0', '255.255.255.255']);
// 자주 오탐이 나는 파일은 검사 제외
const SKIPPED_FILES = new Set(['package-lock.json']);

const OCTET = '(25[0-5]|2[0-4]\\d|1?\\d?\\d)';
const IPV4 = new RegExp(`\\b${OCTET}\\.${OCTET}\\.${OCTET}\\.${OCTET}\\b`, 'g');

function getStagedAdditions() {
  let diff = '';
  try {
    diff = execSync('git diff --cached --unified=0 --diff-filter=ACM', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    return [];
  }

  const additions = [];
  let file = null;
  let lineNumber = 0;

  for (const raw of diff.split(/\r?\n/)) {
    if (raw.startsWith('+++ ')) {
      const path = raw.slice(4);
      file = path === '/dev/null' ? null : path.replace(/^b\//, '');
      continue;
    }
    if (raw.startsWith('@@')) {
      const match = raw.match(/\+(\d+)/);
      lineNumber = match ? Number(match[1]) : 0;
      continue;
    }
    if (raw.startsWith('+')) {
      additions.push({ file, line: lineNumber, text: raw.slice(1) });
      lineNumber += 1;
    }
    // '-' 및 기타 라인은 새 파일 라인 번호에 영향 없음
  }

  return additions;
}

const findings = [];

for (const { file, line, text } of getStagedAdditions()) {
  if (!file) {
    continue;
  }
  if (SKIPPED_FILES.has(file.split('/').pop())) {
    continue;
  }

  const matches = text.match(IPV4);
  if (!matches) {
    continue;
  }

  for (const ip of matches) {
    if (ALLOWED_IPS.has(ip)) {
      continue;
    }
    findings.push({ file, line, ip, text: text.trim() });
  }
}

if (findings.length > 0) {
  console.error('커밋 차단: 하드코딩된 IP 주소가 포함되어 있습니다.');
  console.error(
    '환경별 주소는 IP 대신 플레이스홀더나 런타임 주입(window.__ENV__ / secrets)을 사용하세요.'
  );
  console.error('');
  for (const finding of findings) {
    console.error(`  ${finding.file}:${finding.line}  ${finding.ip}`);
    console.error(`    > ${finding.text}`);
  }
  console.error('');
  console.error('허용 IP: 127.0.0.1, 0.0.0.0, 255.255.255.255');
  console.error('정말 의도한 경우에만: git commit --no-verify');
  process.exit(1);
}
