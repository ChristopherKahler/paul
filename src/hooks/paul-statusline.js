#!/usr/bin/env node
// Claude Code Statusline - PAUL Edition
// Shows: model | current task | directory | context usage

const fs = require('fs');
const path = require('path');
const os = require('os');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const model = data.model?.display_name || 'Claude';
    const dir = data.workspace?.current_dir || process.cwd();
    const session = data.session_id || '';
    const remaining = data.context_window?.remaining_percentage;

    // Context window display (scaled to 80% limit)
    // Claude Code enforces an 80% context limit, so we scale to show 100% at that point
    let ctx = '';
    if (remaining != null) {
      const rem = Math.round(remaining);
      const rawUsed = Math.max(0, Math.min(100, 100 - rem));
      const used = Math.min(100, Math.round((rawUsed / 80) * 100));

      // Build progress bar (10 segments)
      const filled = Math.floor(used / 10);
      const bar = '\u2588'.repeat(filled) + '\u2591'.repeat(10 - filled);

      // Color based on scaled usage
      if (used < 63) {        // ~50% real
        ctx = ` \x1b[32m${bar} ${used}%\x1b[0m`;
      } else if (used < 81) { // ~65% real
        ctx = ` \x1b[33m${bar} ${used}%\x1b[0m`;
      } else if (used < 95) { // ~76% real
        ctx = ` \x1b[38;5;208m${bar} ${used}%\x1b[0m`;
      } else {
        ctx = ` \x1b[5;31m\uD83D\uDC80 ${bar} ${used}%\x1b[0m`;
      }
    }

    // Current task from todos
    let task = '';
    const homeDir = os.homedir();
    const todosDir = path.join(homeDir, '.claude', 'todos');
    if (session && fs.existsSync(todosDir)) {
      try {
        const files = fs.readdirSync(todosDir)
          .filter(f => f.startsWith(session) && f.includes('-agent-') && f.endsWith('.json'))
          .map(f => ({ name: f, mtime: fs.statSync(path.join(todosDir, f)).mtime }))
          .sort((a, b) => b.mtime - a.mtime);

        if (files.length > 0) {
          const todos = JSON.parse(fs.readFileSync(path.join(todosDir, files[0].name), 'utf8'));
          const inProgress = todos.find(t => t.status === 'in_progress');
          if (inProgress) task = inProgress.activeForm || '';
        }
      } catch (e) {}
    }

    // Output
    const dirname = path.basename(dir);
    const prefix = `\x1b[36mPAUL\x1b[0m \u2502 `;
    if (task) {
      process.stdout.write(`${prefix}\x1b[2m${model}\x1b[0m \u2502 \x1b[1m${task}\x1b[0m \u2502 \x1b[2m${dirname}\x1b[0m${ctx}`);
    } else {
      process.stdout.write(`${prefix}\x1b[2m${model}\x1b[0m \u2502 \x1b[2m${dirname}\x1b[0m${ctx}`);
    }
  } catch (e) {
    // Silent fail - don't break statusline on parse errors
  }
});
