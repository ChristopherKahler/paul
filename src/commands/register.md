---
name: paul:register
description: Generate paul.json for an existing PAUL project that predates v1.1 satellite manifest support
argument-hint:
allowed-tools: [Read, Write, Bash]
---

<objective>
Generate `.paul/paul.json` for an existing project that has a `.paul/` directory but no satellite manifest.

**When to use:** Projects initialized before paul-framework v1.1 that are missing `paul.json`. Required for BASE satellite auto-detection to discover and register the project.
</objective>

<execution_context>
@~/.claude/paul-framework/workflows/register-manifest.md
</execution_context>

<context>
Current directory (check for .paul/ and existing paul.json)
</context>

<process>
Follow workflow: @~/.claude/paul-framework/workflows/register-manifest.md
</process>

<success_criteria>
- [ ] .paul/paul.json created with correct project name and current state
- [ ] User confirmed BASE will detect the project on next session start
</success_criteria>
