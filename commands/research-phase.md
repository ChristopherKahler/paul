---
name: research-phase
description: Research unknowns for a phase using subagents
argument-hint: "<phase-number>"
allowed-tools: [Read, Task, Bash, Write]
---

<objective>
Analyze a phase for unknowns and research them using subagents.

**When to use:** Before planning a phase when there are technical unknowns that need investigation.

**Distinction from /paul:research:**
- `/paul:research <topic>`: User knows what to research
- `/paul:research-phase <N>`: Claude identifies what needs researching

**Subagent orchestration:** Spawns multiple research agents in parallel for independent unknowns.
</objective>

<execution_context>
@${CLAUDE_PLUGIN_ROOT}/paul-framework/workflows/research.md
@${CLAUDE_PLUGIN_ROOT}/paul-framework/references/subagent-criteria.md
</execution_context>

<context>
Phase number: $ARGUMENTS (required)

@.paul/PROJECT.md
@.paul/STATE.md
@.paul/ROADMAP.md
</context>

<process>

<step name="validate_phase" priority="first">
1. Parse phase number from $ARGUMENTS

**If argument missing:**
```
Error: Phase number required.

Usage: /paul:research-phase <phase-number>
Example: /paul:research-phase 10
```
Exit workflow.

2. Validate phase exists in ROADMAP.md
3. Extract phase scope, goals, and description

**If phase not found:**
```
Error: Phase {N} not found in roadmap.

Available phases:
[list incomplete phases from roadmap]
```
Exit workflow.
</step>

<step name="analyze_unknowns">
Analyze the phase for research needs:

1. Read ROADMAP.md phase description
2. Read PROJECT.md for context
3. Check for existing CONTEXT.md in phase directory

**Identify unknowns in these categories:**

| Category | Examples |
|----------|----------|
| **Codebase** | "How does X work in this project?", patterns to follow |
| **Web/Docs** | Library features, API patterns, best practices |
| **Comparison** | "Should we use X or Y?", tradeoff analysis |
| **Architecture** | Design patterns, integration approaches |

**Classification logic:**
- Codebase unknowns → Explore agent
- Web/docs unknowns → general-purpose agent

**Filter for substantial unknowns:**
- Only include items that need 15+ min research
- Trivial lookups handled in main session
- Max 3 parallel research agents (token efficiency)

**Present findings:**
```
════════════════════════════════════════
PHASE UNKNOWNS ANALYSIS
════════════════════════════════════════

Phase: {N} — {phase_name}

Identified unknowns:
1. {unknown_1} [{codebase|web}]
2. {unknown_2} [{codebase|web}]
3. {unknown_3} [{codebase|web}]

{If more than 3:}
Additional unknowns (will research after initial batch):
4. {unknown_4}
5. {unknown_5}

────────────────────────────────────────
Proceed with research? [yes/no/modify list]
────────────────────────────────────────
```

Wait for user confirmation.
</step>

<step name="spawn_research_agents">
**Subagent criteria validation (from subagent-criteria.md):**

| Criterion | Check |
|-----------|-------|
| Task Independence | Each unknown is self-contained ✓ |
| Clear Scope | Unknown defines research question ✓ |
| Parallel Value | Multiple agents run simultaneously ✓ |
| Complexity Sweet Spot | Each 15-30 min expected ✓ |
| Token Efficiency | Batch spawn, consolidated return ✓ |
| State Compatibility | No blocking checkpoints ✓ |

**Spawn agents in parallel:**

Use multiple Task tool calls in single message:

```
Task 1 (Codebase unknowns):
- subagent_type: Explore
- description: "Research: {unknown}"
- run_in_background: true (if multiple)
- prompt: [research prompt]

Task 2 (Web unknowns):
- subagent_type: general-purpose
- description: "Research: {unknown}"
- run_in_background: true (if multiple)
- prompt: [research prompt]
```

Display:
```
Spawning {N} research agents...

Agent 1: {unknown_1} (Explore)
Agent 2: {unknown_2} (general-purpose)
Agent 3: {unknown_3} (Explore)

Researching in parallel. This may take a few minutes...
```
</step>

<step name="consolidate_findings">
When all agents complete:

1. Create research directory for phase:
   ```bash
   mkdir -p .paul/phases/{NN}-{name}/research
   ```

2. Save individual findings:
   - `.paul/phases/{NN}-{name}/research/{unknown-slug}.md`

3. Create consolidated RESEARCH.md:
   - `.paul/phases/{NN}-{name}/RESEARCH.md`
   - Summarizes all findings
   - Links to individual research files

4. Present summary:
```
════════════════════════════════════════
PHASE RESEARCH COMPLETE
════════════════════════════════════════

Phase: {N} — {phase_name}
Unknowns researched: {count}

Summary:
1. {unknown_1}: {key finding}
2. {unknown_2}: {key finding}
3. {unknown_3}: {key finding}

Detailed findings:
- .paul/phases/{NN}-{name}/RESEARCH.md (consolidated)
- .paul/phases/{NN}-{name}/research/*.md (individual)

────────────────────────────────────────
Review the findings above. This research informs but does not
automatically integrate into plans.

What's next?
[1] Review consolidated findings
[2] Plan this phase (/paul:plan)
[3] Discuss this phase (/paul:discuss)
[4] Done for now
────────────────────────────────────────
```
</step>

</process>

<success_criteria>
- [ ] Phase validated against ROADMAP.md
- [ ] Unknowns identified and classified
- [ ] User confirmed research list
- [ ] Appropriate agents spawned in parallel
- [ ] Findings consolidated into phase RESEARCH.md
- [ ] Summary presented for review
</success_criteria>
