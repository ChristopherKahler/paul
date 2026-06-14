---
name: flows
description: Configure specialized workflow integrations
argument-hint: "[add|audit|list]"
allowed-tools: [Read, Write, Bash, Glob]
---

<objective>
Configure, amend, or audit specialized skill integrations for a PAUL project.

**When to use:**
- Setting up skill dependencies for a new project
- Adding a skill mapping to an existing project
- Checking if required skills were used in current phase
- Viewing current skill configuration

**Subcommands:**
- (no argument): Full interactive configuration
- `add`: Quick-add single skill mapping
- `audit`: Check current phase against declared flows
- `list`: Display current configuration
</objective>

<execution_context>
@${CLAUDE_PLUGIN_ROOT}/paul-framework/workflows/configure-special-flows.md
@${CLAUDE_PLUGIN_ROOT}/paul-framework/references/specialized-workflow-integration.md
</execution_context>

<context>
Subcommand: $ARGUMENTS (optional)

@.paul/PROJECT.md
@.paul/STATE.md
@.paul/SPECIAL-FLOWS.md (if exists)
</context>

<process>
**Route based on argument:**

**No argument (full configuration):**
1. Follow @workflows/configure-special-flows.md
2. Interactive skill discovery and mapping
3. Generate .paul/SPECIAL-FLOWS.md
4. Update PROJECT.md with quick reference

**`add` (quick add):**
1. Ask for skill name
2. Ask for work type trigger
3. Ask for priority (required/optional)
4. Append to SPECIAL-FLOWS.md table
5. Confirm addition

**`audit` (check current phase):**
1. Read .paul/SPECIAL-FLOWS.md
2. Read .paul/STATE.md for current phase
3. Check ROADMAP.md for phase skill requirements
4. Display required skills for this phase
5. Remind: "Verify invocations before UNIFY"

**`list` (display configuration):**
1. Read .paul/SPECIAL-FLOWS.md
2. Display formatted summary:
   - Project-level skills (with priority)
   - Phase overrides
   - Templates/assets count
</process>

<success_criteria>
- [ ] SPECIAL-FLOWS.md created or updated (for config/add)
- [ ] PROJECT.md quick reference updated (for config)
- [ ] Current phase skills displayed (for audit)
- [ ] Configuration summary shown (for list)
</success_criteria>
