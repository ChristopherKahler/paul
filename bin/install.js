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
const hasSkillsDir = args.includes('--skills-dir');

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

// Parse --dir argument (used with --skills-dir)
function parseDirArg() {
  const dirIndex = args.findIndex(arg => arg === '--dir');
  if (dirIndex !== -1) {
    const nextArg = args[dirIndex + 1];
    if (!nextArg || nextArg.startsWith('-')) {
      console.error(`  ${yellow}--dir requires a path argument${reset}`);
      process.exit(1);
    }
    return nextArg;
  }
  const dirArg = args.find(arg => arg.startsWith('--dir='));
  if (dirArg) {
    return dirArg.split('=')[1];
  }
  return null;
}

const explicitConfigDir = parseConfigDirArg();
const explicitSkillsDir = parseDirArg();
const hasHelp = args.includes('--help') || args.includes('-h');

console.log(banner);

// Show help if requested
if (hasHelp) {
  console.log(`  ${yellow}Usage:${reset} npx paul-framework [options]

  ${yellow}Options:${reset}
    ${cyan}-g, --global${reset}              Install globally (to Claude config directory)
    ${cyan}-l, --local${reset}               Install locally (to ./.claude in current directory)
    ${cyan}-c, --config-dir <path>${reset}   Specify custom Claude config directory
    ${cyan}    --skills-dir${reset}          Install as a Claude Code skills-directory plugin
    ${cyan}    --dir <path>${reset}          Target directory for --skills-dir (default: ./.claude/skills/paul)
    ${cyan}-h, --help${reset}                Show this help message

  ${yellow}Examples:${reset}
    ${dim}# Install to default ~/.claude directory${reset}
    npx paul-framework --global

    ${dim}# Install to custom config directory${reset}
    npx paul-framework --global --config-dir ~/.claude-custom

    ${dim}# Install to current project only${reset}
    npx paul-framework --local

    ${dim}# Install as a skills-directory plugin (default path: ./.claude/skills/paul)${reset}
    npx paul-framework --skills-dir

    ${dim}# Install as a skills-directory plugin to a custom path${reset}
    npx paul-framework --skills-dir --dir /path/to/skills/paul

  ${yellow}What gets installed:${reset}
    commands/paul/     - Slash commands (/paul:init, /paul:plan, etc.)
    paul-framework/    - Templates, workflows, references, rules
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
 * Recursively copy directory, rewriting paul-framework refs for skills-dir plugin.
 * Replaces @~/.claude/paul-framework/ with ${CLAUDE_PLUGIN_ROOT}/paul-framework/
 * Leaves @.paul/ and all other project-relative refs untouched.
 */
function copyWithPluginRootReplacement(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      copyWithPluginRootReplacement(srcPath, destPath);
    } else if (entry.name.endsWith('.md')) {
      let content = fs.readFileSync(srcPath, 'utf8');
      // Rewrite only paul-framework refs; leave @.paul/ project-state refs intact
      content = content.replace(
        /@~\/\.claude\/paul-framework\//g,
        '@${CLAUDE_PLUGIN_ROOT}/paul-framework/'
      );
      fs.writeFileSync(destPath, content);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Install as a Claude Code skills-directory plugin.
 * Target layout:
 *   <skillsDir>/
 *     .claude-plugin/plugin.json
 *     commands/           (paul slash commands)
 *     paul-framework/     (templates, workflows, references, rules)
 */
function installSkillsDir() {
  const src = path.join(__dirname, '..');

  const skillsDir = expandTilde(explicitSkillsDir) ||
    path.join(process.cwd(), '.claude', 'skills', 'paul');

  const locationLabel = skillsDir.startsWith(os.homedir())
    ? skillsDir.replace(os.homedir(), '~')
    : skillsDir.replace(process.cwd(), '.');

  console.log(`  Installing skills-dir plugin to ${cyan}${locationLabel}${reset}\n`);

  // Create root
  fs.mkdirSync(skillsDir, { recursive: true });

  // Write .claude-plugin/plugin.json
  const pluginDir = path.join(skillsDir, '.claude-plugin');
  fs.mkdirSync(pluginDir, { recursive: true });
  const pluginJson = {
    name: 'paul',
    version: pkg.version,
    description: pkg.description
  };
  fs.writeFileSync(
    path.join(pluginDir, 'plugin.json'),
    JSON.stringify(pluginJson, null, 2) + '\n'
  );
  console.log(`  ${green}✓${reset} Wrote .claude-plugin/plugin.json`);

  // Copy commands
  const commandsSrc = path.join(src, 'src', 'commands');
  const commandsDest = path.join(skillsDir, 'commands');
  copyWithPluginRootReplacement(commandsSrc, commandsDest);
  console.log(`  ${green}✓${reset} Installed commands/`);

  // Copy paul-framework subdirs
  const frameworkDest = path.join(skillsDir, 'paul-framework');
  fs.mkdirSync(frameworkDest, { recursive: true });

  const srcDirs = ['templates', 'workflows', 'references', 'rules'];
  for (const dir of srcDirs) {
    const dirSrc = path.join(src, 'src', dir);
    const dirDest = path.join(frameworkDest, dir);
    if (fs.existsSync(dirSrc)) {
      copyWithPluginRootReplacement(dirSrc, dirDest);
    }
  }
  console.log(`  ${green}✓${reset} Installed paul-framework/`);

  console.log(`
  ${green}Done!${reset} Loads next session as paul@skills-dir (no marketplace/install). Trust the workspace if prompted. For Claude Code Cloud, commit .claude/skills/paul/.
`);
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
if (hasSkillsDir && (hasGlobal || hasLocal)) {
  console.error(`  ${yellow}Cannot combine --skills-dir with --global or --local${reset}`);
  process.exit(1);
} else if (hasGlobal && hasLocal) {
  console.error(`  ${yellow}Cannot specify both --global and --local${reset}`);
  process.exit(1);
} else if (explicitConfigDir && hasLocal) {
  console.error(`  ${yellow}Cannot use --config-dir with --local${reset}`);
  process.exit(1);
} else if (hasSkillsDir) {
  installSkillsDir();
} else if (hasGlobal) {
  install(true);
} else if (hasLocal) {
  install(false);
} else {
  promptLocation();
}
