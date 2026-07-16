import { execSync } from 'node:child_process';

const BRANCH_PATTERN =
  /^(main|develop|hotfix|feat\/[A-Za-z0-9가-힣._-]+|refactor\/[A-Za-z0-9가-힣._-]+)$/;

function getCurrentBranch() {
  try {
    return execSync('git symbolic-ref --short HEAD', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return '';
  }
}

const branchName = getCurrentBranch();

if (!branchName) {
  process.exit(0);
}

if (!BRANCH_PATTERN.test(branchName)) {
  console.error(`Invalid branch name: ${branchName}`);
  console.error('');
  console.error('Allowed branch names:');
  console.error('- main');
  console.error('- develop');
  console.error('- hotfix');
  console.error('- feat/{기능명}');
  console.error('- refactor/{기능명}');
  process.exit(1);
}
