import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { ResultUtils } from '../../lib/core/result-utils.mjs';
import { FsUtils } from '../../lib/core/fs-utils.mjs';

const { success } = ResultUtils;
const { runIfDirect } = FsUtils;

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../');
const PACKAGE_PATHS = [path.join(ROOT_DIR, 'package.json')];
const CHANGELOG_PATH = path.join(ROOT_DIR, 'CHANGELOG.md');

export function detectBumpType(commitMessage) {
  const firstLine = commitMessage.split('\n')[0].trim();
  const footer = commitMessage.split('\n').slice(1).join('\n');

  if (/^chore:\s*bump version/i.test(firstLine)) return 'skip';
  if (/^[a-z]+!:/.test(firstLine)) return 'major';
  if (/BREAKING CHANGE:/m.test(footer)) return 'major';
  if (/^feat:/.test(firstLine)) return 'minor';
  return 'patch';
}

export function bumpVersion(current, bumpType) {
  const [major, minor, patch] = current.split('.').map(Number);
  switch (bumpType) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      return current;
  }
}

async function run() {
  const result = await orchestrateAutoBump();
  return result;
}

async function orchestrateAutoBump() {
  const commitMessage = readLastCommitMessage();
  const bumpType = detectBumpType(commitMessage);

  if (bumpType === 'skip') {
    console.log('  auto-bump: skipped (version commit detected)');
    return success({ from: null, to: null, bump: 'skip' });
  }

  const rootPackagePath = PACKAGE_PATHS[0];
  const rootPackage = JSON.parse(fs.readFileSync(rootPackagePath, 'utf8'));
  const nextVersion = bumpVersion(rootPackage.version, bumpType);

  updateChangelog(nextVersion);
  syncAllPackages(nextVersion);

  console.log(`  auto-bump: ${rootPackage.version} → ${nextVersion} (${bumpType})`);
  console.log('  auto-bump: files updated. Manual commit required.');
  return success({ from: rootPackage.version, to: nextVersion, bump: bumpType });
}

function updateChangelog(newVersion) {
  if (!fs.existsSync(CHANGELOG_PATH)) return;

  const content = fs.readFileSync(CHANGELOG_PATH, 'utf8');
  const today = new Date().toLocaleDateString('en-CA');
  const unreleasedRegex = /##\s*\[Unreleased\](\s*-\s*\d{4}-\d{2}-\d{2})?/i;

  if (!unreleasedRegex.test(content)) return;

  const newHeader = `## [${newVersion}] - ${today}`;
  let updatedContent = content.replace(unreleasedRegex, newHeader);

  const insertIndex = updatedContent.indexOf(newHeader);
  const nextBlock = `## [Unreleased]\n\n### Added\n\n### Fixed\n\n`;

  updatedContent =
    updatedContent.slice(0, insertIndex) + nextBlock + updatedContent.slice(insertIndex);

  fs.writeFileSync(CHANGELOG_PATH, updatedContent);
}

function syncAllPackages(nextVersion) {
  const validPaths = PACKAGE_PATHS.filter((packagePath) => fs.existsSync(packagePath));
  for (const packagePath of validPaths) {
    const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    packageData.version = nextVersion;
    fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2) + '\n');
  }
}

function readLastCommitMessage() {
  return execSync('git log -1 --pretty=%B', { encoding: 'utf8' }).trim();
}

export const AutoBump = {
  run,
  detectBumpType,
  bumpVersion,
};

runIfDirect(import.meta.url, run);
