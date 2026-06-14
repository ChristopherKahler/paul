---
name: init
description: Initialize PAUL in a project with conversational setup
argument-hint:
allowed-tools: [Read, Write, Bash, Glob, AskUserQuestion]
---

<objective>
Initialize the `.paul/` structure in a project directory through conversational setup.

**When to use:** Starting a new project with PAUL, or adding PAUL to an existing codebase.

Creates PROJECT.md, STATE.md, and ROADMAP.md populated from conversation - user does not manually edit templates.
</objective>

<execution_context>
@${CLAUDE_PLUGIN_ROOT}/paul-framework/workflows/init-project.md
@${CLAUDE_PLUGIN_ROOT}/paul-framework/templates/PROJECT.md
@${CLAUDE_PLUGIN_ROOT}/paul-framework/templates/STATE.md
@${CLAUDE_PLUGIN_ROOT}/paul-framework/templates/ROADMAP.md
</execution_context>

<context>
Current directory state (check for existing .paul/)
</context>

<process>
**Follow workflow: @${CLAUDE_PLUGIN_ROOT}/paul-framework/workflows/init-project.md**

The workflow implements conversational setup:

1. Check for existing .paul/ (route to resume if exists)
2. Create directory structure
3. Ask: "What's the core value this project delivers?"
4. Ask: "What are you building?"
5. Confirm project name (infer from directory)
6. Populate PROJECT.md, ROADMAP.md, STATE.md from answers
7. Display ONE next action: `/paul:plan`

**Key behaviors:**
- Ask ONE question at a time
- Wait for response before next question
- Populate files from answers (user doesn't edit templates)
- End with exactly ONE next action
- Build momentum into planning phase
</process>

<success_criteria>
- [ ] .paul/ directory created
- [ ] PROJECT.md populated with core value and description from conversation
- [ ] STATE.md initialized with correct loop position
- [ ] ROADMAP.md initialized (phases TBD until planning)
- [ ] User presented with ONE clear next action
</success_criteria>
