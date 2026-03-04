#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

// Colors
const cyan = '\x1b[36m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const dim = '\x1b[2m';
const reset = '\x1b[0m';

// Get version from package.json
const pkg = require('../package.json');

const banner = `
${cyan}  ██████╗  █████╗ ██╗   ██╗██╗
  ██╔══██╗██╔══██╗██║   ██║██║
  ██████╔╝███████║██║   ██║██║
  ██╔═══╝ ██╔══██║██║   ██║██║
  ██║     ██║  ██║╚██████╔╝███████╗
  ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝${reset}

  PAUL Framework ${dim}v${pkg.version}${reset}
  Plan-Apply-Unify Loop for Claude Code
`;

// Parse args
const args = process.argv.slice(2);
const hasGlobal = args.includes('--global') || args.includes('-g');
const hasLocal = args.includes('--local') || args.includes('-l');

// Parse --config-dir argument
function parseConfigDirArg() {
  const configDirIndex = args.findIndex(arg => arg === '--config-dir' || arg === '-c');
  if (configDirIndex !== -1) {
    const nextArg = args[configDirIndex + 1];
    if (!nextArg || nextArg.startsWith('-')) {
      console.error(`  ${yellow}--config-dir requires a path argument${reset}`);
      process.exit(1);
    }
    return nextArg;
  }
  const configDirArg = args.find(arg => arg.startsWith('--config-dir=') || arg.startsWith('-c='));
  if (configDirArg) {
    return configDirArg.split('=')[1];
  }
  return null;
}
const explicitConfigDir = parseConfigDirArg();
const hasHelp = args.includes('--help') || args.includes('-h');

console.log(banner);

// Show help if requested
if (hasHelp) {
  console.log(`  ${yellow}Usage:${reset} npx paul-framework [options]

  ${yellow}Options:${reset}
    ${cyan}-g, --global${reset}              Install globally (to Claude config directory)
    ${cyan}-l, --local${reset}               Install locally (to ./.claude in current directory)
    ${cyan}-c, --config-dir <path>${reset}   Specify custom Claude config directory
    ${cyan}-h, --help${reset}                Show this help message

  ${yellow}Examples:${reset}
    ${dim}# Install to default ~/.claude directory${reset}
    npx paul-framework --global

    ${dim}# Install to custom config directory${reset}
    npx paul-framework --global --config-dir ~/.claude-custom

    ${dim}# Install to current project only${reset}
    npx paul-framework --local

  ${yellow}What gets installed:${reset}
    commands/paul/     - Slash commands (/paul:init, /paul:plan, etc.)
    paul-framework/    - Templates, workflows, references, rules
    hooks/             - Statusline showing context window usage
`);
  process.exit(0);
}

/**
 * Expand ~ to home directory
 */
function expandTilde(filePath) {
  if (filePath && filePath.startsWith('~/')) {
    return path.join(os.homedir(), filePath.slice(2));
  }
  return filePath;
}

/**
 * Recursively copy directory, replacing paths in .md files
 */
function copyWithPathReplacement(srcDir, destDir, pathPrefix) {
  fs.mkdirSync(destDir, { recursive: true });

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      copyWithPathReplacement(srcPath, destPath, pathPrefix);
    } else if (entry.name.endsWith('.md')) {
      // Replace ~/.claude/ with the appropriate prefix in markdown files
      let content = fs.readFileSync(srcPath, 'utf8');
      content = content.replace(/~\/\.claude\//g, pathPrefix);
      fs.writeFileSync(destPath, content);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Configure statusline in settings.json (or settings.local.json for local installs)
 */
function configureStatusline(claudeDir, isGlobal) {
  const settingsFile = isGlobal
    ? path.join(claudeDir, 'settings.json')
    : path.join(claudeDir, 'settings.local.json');

  const hookRelPath = isGlobal
    ? path.join(claudeDir, 'hooks', 'paul-statusline.js')
    : '.claude/hooks/paul-statusline.js';

  const command = `node ${hookRelPath}`;

  let settings = {};
  if (fs.existsSync(settingsFile)) {
    try {
      settings = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
    } catch (e) {}
  }

  // Check if statusLine is already configured by another tool
  if (settings.statusLine) {
    const existing = settings.statusLine.command || '';
    if (!existing.includes('paul-statusline')) {
      console.log(`  ${yellow}!${reset} Existing statusLine found (${dim}${existing}${reset}), skipping`);
      return;
    }
  }

  settings.statusLine = {
    type: 'command',
    command: command,
  };

  fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2) + '\n');
  console.log(`  ${green}✓${reset} Configured statusline in ${dim}${path.basename(settingsFile)}${reset}`);
}

/**
 * Install to the specified directory
 */
function install(isGlobal) {
  const src = path.join(__dirname, '..');
  const configDir = expandTilde(explicitConfigDir) || expandTilde(process.env.CLAUDE_CONFIG_DIR);
  const defaultGlobalDir = configDir || path.join(os.homedir(), '.claude');
  const claudeDir = isGlobal
    ? defaultGlobalDir
    : path.join(process.cwd(), '.claude');

  const locationLabel = isGlobal
    ? claudeDir.replace(os.homedir(), '~')
    : claudeDir.replace(process.cwd(), '.');

  // Path prefix for file references
  const pathPrefix = isGlobal
    ? (configDir ? `${claudeDir}/` : '~/.claude/')
    : './.claude/';

  console.log(`  Installing to ${cyan}${locationLabel}${reset}\n`);

  // Create commands directory
  const commandsDir = path.join(claudeDir, 'commands');
  fs.mkdirSync(commandsDir, { recursive: true });

  // Copy src/commands to commands/paul
  const commandsSrc = path.join(src, 'src', 'commands');
  const commandsDest = path.join(commandsDir, 'paul');
  copyWithPathReplacement(commandsSrc, commandsDest, pathPrefix);
  console.log(`  ${green}✓${reset} Installed commands/paul`);

  // Copy src/* (except commands) to paul-framework/
  const skillDest = path.join(claudeDir, 'paul-framework');
  fs.mkdirSync(skillDest, { recursive: true });

  const srcDirs = ['templates', 'workflows', 'references', 'rules'];
  for (const dir of srcDirs) {
    const dirSrc = path.join(src, 'src', dir);
    const dirDest = path.join(skillDest, dir);
    if (fs.existsSync(dirSrc)) {
      copyWithPathReplacement(dirSrc, dirDest, pathPrefix);
    }
  }
  console.log(`  ${green}✓${reset} Installed paul-framework`);

  // Install hooks (statusline)
  const hooksSrc = path.join(src, 'src', 'hooks');
  if (fs.existsSync(hooksSrc)) {
    const hooksDest = path.join(claudeDir, 'hooks');
    fs.mkdirSync(hooksDest, { recursive: true });
    const hookFiles = fs.readdirSync(hooksSrc);
    for (const file of hookFiles) {
      fs.copyFileSync(path.join(hooksSrc, file), path.join(hooksDest, file));
    }
    console.log(`  ${green}✓${reset} Installed hooks`);
  }

  // Configure statusline in settings
  configureStatusline(claudeDir, isGlobal);

  console.log(`
  ${green}Done!${reset} Launch Claude Code and run ${cyan}/paul:help${reset}.
`);
}

/**
 * Prompt for install location
 */
function promptLocation() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const configDir = expandTilde(explicitConfigDir) || expandTilde(process.env.CLAUDE_CONFIG_DIR);
  const globalPath = configDir || path.join(os.homedir(), '.claude');
  const globalLabel = globalPath.replace(os.homedir(), '~');

  console.log(`  ${yellow}Where would you like to install?${reset}

  ${cyan}1${reset}) Global ${dim}(${globalLabel})${reset} - available in all projects
  ${cyan}2${reset}) Local  ${dim}(./.claude)${reset} - this project only
`);

  rl.question(`  Choice ${dim}[1]${reset}: `, (answer) => {
    rl.close();
    const choice = answer.trim() || '1';
    const isGlobal = choice !== '2';
    install(isGlobal);
  });
}

// Main
if (hasGlobal && hasLocal) {
  console.error(`  ${yellow}Cannot specify both --global and --local${reset}`);
  process.exit(1);
} else if (explicitConfigDir && hasLocal) {
  console.error(`  ${yellow}Cannot use --config-dir with --local${reset}`);
  process.exit(1);
} else if (hasGlobal) {
  install(true);
} else if (hasLocal) {
  install(false);
} else {
  promptLocation();
}
