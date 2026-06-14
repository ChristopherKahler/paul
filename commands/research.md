---
name: research
description: Research a topic using subagents for discovery
argument-hint: "<topic> [--codebase | --web]"
allowed-tools: [Read, Task, Bash, Write]
---

<objective>
Research a specific topic using subagents and save findings for review.

**When to use:** When you need to gather information on a topic before planning or implementing.

**Subagent use case:** Research is the APPROPRIATE use of subagents per subagent-criteria.md:
- Task Independence: Research is self-contained
- Clear Scope: Topic defines clear inputs/outputs
- Parallel Value: Multiple topics can run simultaneously
- Complexity Sweet Spot: 15-30 min per research task
</objective>

<execution_context>
@${CLAUDE_PLUGIN_ROOT}/paul-framework/workflows/research.md
@${CLAUDE_PLUGIN_ROOT}/paul-framework/references/subagent-criteria.md
</execution_context>

<context>
Topic: $ARGUMENTS (required)

Optional flags:
- `--codebase`: Focus on codebase exploration (uses Explore agent)
- `--web`: Focus on web/documentation (uses general-purpose agent)
- No flag: Auto-detect based on topic

@.paul/PROJECT.md
@.paul/STATE.md
</context>

<process>
Follow workflow: @${CLAUDE_PLUGIN_ROOT}/paul-framework/workflows/research.md
</process>

<success_criteria>
- [ ] Topic validated (not trivial)
- [ ] Appropriate agent type selected
- [ ] Subagent spawned for research
- [ ] Findings saved to .paul/research/{topic}.md
- [ ] Summary presented for review
</success_criteria>
