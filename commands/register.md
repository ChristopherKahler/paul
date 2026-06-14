---
name: register
description: Migrate paul.json → paul.toml, or create paul.toml for projects missing a manifest
argument-hint:
allowed-tools: [Read, Write, Bash]
---

<objective>
Migrate `.paul/paul.json` → `.paul/paul.toml` for pre-v1.4 projects, or create `.paul/paul.toml` from STATE.md for projects that have a `.paul/` directory but no manifest at all.

**When to use:**
- Projects initialized before v1.4 that still have paul.json (auto-migration also happens on any workflow contact)
- Projects with `.paul/` but no manifest file (paul.json or paul.toml)
- After upgrading PAUL framework to v1.4+ to explicitly migrate existing projects
</objective>

<execution_context>
@${CLAUDE_PLUGIN_ROOT}/paul-framework/workflows/register-manifest.md
</execution_context>

<context>
Current directory (check for .paul/, existing paul.json, existing paul.toml)
</context>

<process>
Follow workflow: @${CLAUDE_PLUGIN_ROOT}/paul-framework/workflows/register-manifest.md
</process>

<success_criteria>
- [ ] .paul/paul.toml created with correct project state and [paul] provenance section
- [ ] .paul/paul.json deleted (if it existed)
- [ ] .paul/ledger.toml created (if missing)
- [ ] BASE v2 detection check performed
- [ ] User informed of next steps
</success_criteria>
