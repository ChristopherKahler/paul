<purpose>
Research a topic using subagents and save findings for main session review.

**Philosophy:** Subagents are appropriate for research because research is self-contained, has clear scope, can parallelize, and doesn't require iterative feedback.

**Key principle:** Main session always reviews findings. Never auto-integrate research.
</purpose>

<when_to_use>
- User needs information on a topic before planning
- Technical unknowns need investigation
- Documentation or patterns need gathering
- Multiple topics can be researched in parallel
</when_to_use>

<loop_context>
N/A - This is a pre-planning workflow, not a loop phase.
Research informs planning but doesn't gate it.
</loop_context>

<required_reading>
@${CLAUDE_PLUGIN_ROOT}/paul-framework/references/subagent-criteria.md
</required_reading>

<references>
@src/templates/RESEARCH.md (output format)
</references>

<process>

<step name="validate_topic" priority="first">
1. Parse topic from $ARGUMENTS

**If argument missing:**
```
Error: Topic required.

Usage: /paul:research <topic> [--codebase | --web]
Examples:
  /paul:research "nextjs app router patterns"
  /paul:research "auth patterns in this codebase" --codebase
  /paul:research "prisma vs drizzle comparison" --web
```
Exit workflow.

2. Check topic complexity against subagent-criteria.md:
   - Is this substantial (15+ min research)? → Proceed with subagent
   - Is this trivial (< 5 min lookup)? → Handle in main session

**If trivial:**
```
This looks like a quick lookup. Handling in main session...

[provide answer directly]
```
Exit workflow.
</step>

<step name="classify_research">
Determine research type:

**Codebase research (use Explore agent):**
- Questions about existing code patterns
- Finding implementations in the codebase
- Understanding architecture or conventions
- "How does X work in this project?"

**Web research (use general-purpose agent):**
- Documentation lookups
- Library comparisons
- Best practices research
- "What's the recommended approach for X?"

**Auto-detection logic:**
- Contains "codebase", "this project", "our code" → Codebase
- Contains "documentation", "library", "vs", "comparison" → Web
- References specific file paths → Codebase
- Default → Web (broader scope)

**Override with flags:**
- `--codebase` forces Explore agent
- `--web` forces general-purpose agent

Display:
```
Research type: {Codebase | Web}
Agent: {Explore | general-purpose}

Spawning research agent...
```
</step>

<step name="spawn_agent">
**Subagent criteria validation (from subagent-criteria.md):**

| Criterion | Check |
|-----------|-------|
| Task Independence | Research is self-contained ✓ |
| Clear Scope | Topic defines inputs/outputs ✓ |
| Parallel Value | Can run with other research ✓ |
| Complexity Sweet Spot | 15-30 min expected ✓ |
| Token Efficiency | Single spawn, consolidated return ✓ |
| State Compatibility | No blocking checkpoints ✓ |

**Spawn the appropriate agent:**

For **Codebase** research:
```
Use Task tool:
- subagent_type: Explore
- description: "Research: {topic}"
- prompt: |
    Research the following topic in this codebase:

    Topic: {topic}

    Please find:
    1. Relevant files and patterns
    2. How this is currently implemented (if applicable)
    3. Conventions being followed
    4. Any related code or dependencies

    Return findings in a structured format with file paths and code examples.
```

For **Web** research:
```
Use Task tool:
- subagent_type: general-purpose
- description: "Research: {topic}"
- prompt: |
    Research the following topic:

    Topic: {topic}

    Please find:
    1. Official documentation
    2. Best practices and patterns
    3. Pros/cons if comparing options
    4. Example implementations
    5. Common pitfalls to avoid

    Use WebSearch and WebFetch as needed.
    Return findings in a structured format with sources.
```

**For multiple topics (parallel):**
- Spawn multiple agents in single message
- Each agent researches one topic
- Consolidate findings when all complete
</step>

<step name="save_findings">
Create `.paul/research/{topic-slug}.md`:

1. Create research directory if needed:
   ```bash
   mkdir -p .paul/research
   ```

2. Generate topic slug (lowercase, hyphens):
   - "nextjs app router patterns" → "nextjs-app-router-patterns"
   - "auth patterns in this codebase" → "auth-patterns-codebase"

3. Write findings using RESEARCH.md template format

4. Display:
```
════════════════════════════════════════
RESEARCH COMPLETE
════════════════════════════════════════

Topic: {topic}
Agent: {agent_type}
Output: .paul/research/{topic-slug}.md

Summary:
{key findings in 3-5 bullets}

────────────────────────────────────────
Review the findings above. This research informs but does not
automatically integrate into plans or code.

What's next?
[1] View full findings | [2] Research another topic | [3] Done
────────────────────────────────────────
```
</step>

</process>

<output>
- .paul/research/{topic-slug}.md created with findings
- Summary presented for review
- Main session can use findings for planning
</output>

<success_criteria>
- [ ] Topic validated (not trivial)
- [ ] Research type classified correctly
- [ ] Subagent criteria validated
- [ ] Appropriate agent spawned
- [ ] Findings saved to research directory
- [ ] Summary presented for review
</success_criteria>

<anti_patterns>
**Spawning for trivial lookups:**
DON'T: Spawn subagent for "what's the syntax for X"
DO: Answer directly if < 5 min lookup

**Auto-integrating findings:**
DON'T: Automatically apply research to code or plans
DO: Present findings for human review

**Using wrong agent type:**
DON'T: Use Explore for web documentation research
DO: Match agent type to research type

**Serial research chains:**
DON'T: Spawn agent A, wait, spawn agent B, wait
DO: Spawn independent agents in parallel

**Over-researching:**
DON'T: Research every possible topic
DO: Focus on genuine unknowns that inform decisions
</anti_patterns>

<error_handling>
**Subagent timeout:**
- Report partial findings if available
- Offer to retry or continue without

**No relevant findings:**
- Report that topic may be too specific
- Suggest broader or alternative search terms

**Agent error:**
- Report error
- Offer to retry with different approach or agent type
</error_handling>
