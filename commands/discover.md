---
name: discover
description: Research technical options before planning a phase
argument-hint: "<phase or topic>"
allowed-tools: [Read, Bash, Glob, Grep, WebSearch, WebFetch, Task, AskUserQuestion]
---

<objective>
Execute discovery to inform planning decisions. Produces DISCOVERY.md with findings, recommendation, and confidence level.

**When to use:** Before planning a phase with technical unknowns (library selection, architecture decisions, integration approaches).

**Distinct from /paul:research:** Research is for gathering documentation/information. Discover is for making technical decisions.
</objective>

<execution_context>
@${CLAUDE_PLUGIN_ROOT}/paul-framework/workflows/discovery.md
@${CLAUDE_PLUGIN_ROOT}/paul-framework/templates/DISCOVERY.md
</execution_context>

<context>
$ARGUMENTS (phase number or topic)

@.paul/STATE.md
@.paul/ROADMAP.md
</context>

<process>
**Follow workflow: @${CLAUDE_PLUGIN_ROOT}/paul-framework/workflows/discovery.md**

The workflow implements:
1. Determine depth level (quick/standard/deep)
2. Identify unknowns for the phase
3. Research options using subagents
4. Cross-verify findings
5. Create DISCOVERY.md with recommendation
6. Assign confidence level
7. Route to planning when complete
</process>

<success_criteria>
- [ ] Discovery depth determined
- [ ] Unknowns identified
- [ ] Options researched with sources
- [ ] DISCOVERY.md created (for standard/deep)
- [ ] Recommendation provided with confidence
- [ ] Ready for /paul:plan
</success_criteria>
