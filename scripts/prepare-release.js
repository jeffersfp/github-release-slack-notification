#!/usr/bin/env node

/**
 * Interactive script to prepare a release
 * - Builds the distribution
 * - Prompts for version bump type
 * - Updates version in package.json and action.yaml
 * - Commits and pushes changes
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function exec(command, silent = false) {
  try {
    const output = execSync(command, { encoding: 'utf8' });
    if (!silent) console.log(output);
    return output.trim();
  } catch (error) {
    console.error(`Error executing: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

function getCurrentVersion() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  return packageJson.version;
}

function bumpVersion(currentVersion, type) {
  const parts = currentVersion.split('.').map(Number);
  switch (type) {
    case 'major':
      return `${parts[0] + 1}.0.0`;
    case 'minor':
      return `${parts[0]}.${parts[1] + 1}.0`;
    case 'patch':
      return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
    default:
      throw new Error('Invalid version bump type');
  }
}

function updateVersion(version) {
  // Update package.json
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const oldVersion = packageJson.version;
  packageJson.version = version;
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2) + '\n');
  console.log(`✅ Updated package.json to version ${version}`);

  // Update README.md
  const readmePath = 'README.md';
  if (fs.existsSync(readmePath)) {
    let readme = fs.readFileSync(readmePath, 'utf8');
    const versionPattern = new RegExp(`github-release-slack-notification@v${oldVersion.replace(/\./g, '\\.')}`, 'g');
    const matches = readme.match(versionPattern);
    if (matches) {
      readme = readme.replace(versionPattern, `github-release-slack-notification@v${version}`);
      fs.writeFileSync(readmePath, readme);
      console.log(`✅ Updated ${matches.length} version reference(s) in README.md`);
    }
  }

  // Update examples folder
  const examplesDir = 'examples';
  if (fs.existsSync(examplesDir)) {
    const files = fs.readdirSync(examplesDir);
    files.forEach(file => {
      const filePath = path.join(examplesDir, file);
      if (fs.statSync(filePath).isFile() && (file.endsWith('.yml') || file.endsWith('.yaml'))) {
        let content = fs.readFileSync(filePath, 'utf8');
        const versionPattern = new RegExp(`github-release-slack-notification@v${oldVersion.replace(/\./g, '\\.')}`, 'g');
        const matches = content.match(versionPattern);
        if (matches) {
          content = content.replace(versionPattern, `github-release-slack-notification@v${version}`);
          fs.writeFileSync(filePath, content);
          console.log(`✅ Updated ${matches.length} version reference(s) in ${file}`);
        }
      }
    });
  }
}

async function main() {
  console.log('🚀 Release Preparation Tool\n');

  // Check for uncommitted changes
  try {
    exec('git diff --quiet', true);
    exec('git diff --cached --quiet', true);
  } catch {
    console.error('❌ You have uncommitted changes. Please commit or stash them first.');
    process.exit(1);
  }

  // Build distribution
  console.log('📦 Building distribution...');
  exec('npm run build');

  // Get current version
  const currentVersion = getCurrentVersion();
  console.log(`\n📌 Current version: ${currentVersion}`);

  // Ask for version bump type
  console.log('\nWhat type of version bump?');
  console.log('1. patch (bug fixes)');
  console.log('2. minor (new features, backward compatible)');
  console.log('3. major (breaking changes)');
  console.log('4. custom');

  const choice = await question('\nEnter your choice (1-4): ');

  let newVersion;
  switch (choice.trim()) {
    case '1':
      newVersion = bumpVersion(currentVersion, 'patch');
      break;
    case '2':
      newVersion = bumpVersion(currentVersion, 'minor');
      break;
    case '3':
      newVersion = bumpVersion(currentVersion, 'major');
      break;
    case '4':
      newVersion = await question('Enter custom version: ');
      newVersion = newVersion.trim();
      break;
    default:
      console.error('Invalid choice');
      process.exit(1);
  }

  console.log(`\n📝 New version will be: ${newVersion}`);
  const confirm = await question('Continue? (y/n): ');

  if (confirm.toLowerCase() !== 'y') {
    console.log('Cancelled.');
    process.exit(0);
  }

  // Update version
  updateVersion(newVersion);

  // Stage changes
  console.log('\n📝 Staging changes...');
  exec('git add package.json dist/ README.md examples/', true);

  // Commit
  const commitMsg = `chore: release v${newVersion}`;
  console.log(`\n💾 Committing: ${commitMsg}`);
  exec(`git commit -m "${commitMsg}"`, true);

  // Push
  console.log('\n🚀 Pushing to origin...');
  exec('git push', true);

  console.log('\n✅ Release prepared successfully!');
  console.log(`\n📋 Next steps:`);
  console.log(`   The GitHub Actions workflow will automatically:`);
  console.log(`   1. Create tag v${newVersion}`);
  console.log(`   2. Create GitHub release`);
  console.log(`   3. Update major version tag (v${newVersion.split('.')[0]})`);
  console.log(`\n   Monitor the workflow at: https://github.com/jeffersfp/github-release-slack-notification/actions`);

  rl.close();
}

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});
