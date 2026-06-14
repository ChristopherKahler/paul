---
name: milestone
description: Create a new milestone in the project
argument-hint: "[milestone-name]"
allowed-tools: [Read, Write, Edit, Bash, Glob, AskUserQuestion]
---

<objective>
Create a new milestone with defined scope and phases.

**When to use:** Starting a new milestone cycle after completing the previous one.
</objective>

<execution_context>
@${CLAUDE_PLUGIN_ROOT}/paul-framework/workflows/create-milestone.md
</execution_context>

<context>
$ARGUMENTS

@.paul/PROJECT.md
@.paul/STATE.md
@.paul/ROADMAP.md
</context>

<process>
Follow workflow: @${CLAUDE_PLUGIN_ROOT}/paul-framework/workflows/create-milestone.md
</process>

<success_criteria>
- [ ] Milestone created in MILESTONES.md
- [ ] ROADMAP.md updated with milestone grouping
- [ ] STATE.md reflects new milestone
</success_criteria>
