# RESEARCH.md Template

Template for `.paul/research/{topic-slug}.md` - research findings from subagent discovery.

**Purpose:** Captures research findings for main session review. Created by `/paul:research` or `/paul:research-phase`.

---

## File Template

```markdown
# Research: {Topic}

**Generated:** {date}
**Status:** Draft | Reviewed | Integrated
**Agent Type:** Explore | general-purpose
**Spawn Time:** {timestamp}

## Topic

{Original research question or topic}

## Sources

{List of sources consulted}
- [Source 1](url) - {brief description}
- [Source 2](url) - {brief description}
- Codebase: {file paths examined}

## Findings

### Key Points

{Main findings as bullets}
- Finding 1
- Finding 2
- Finding 3

### Details

{Detailed findings, organized by subtopic}

#### {Subtopic 1}

{Details, code examples, patterns found}

#### {Subtopic 2}

{Details, code examples, patterns found}

## Recommendations

{Actionable recommendations based on findings}
- Recommendation 1: {what to do and why}
- Recommendation 2: {what to do and why}

## Open Questions

{Items that need further investigation}
- Question 1
- Question 2

## Subagent Metadata

| Field | Value |
|-------|-------|
| Agent Type | {Explore \| general-purpose} |
| Spawned | {timestamp} |
| Duration | {approximate} |
| Token Estimate | {rough estimate if available} |

---

*Created by /paul:research. Review before integrating.*
*Status should be updated when findings are reviewed or integrated.*
```

---

## Field Descriptions

| Field | Purpose |
|-------|---------|
| `Topic` | Original research question |
| `Status` | Draft (new), Reviewed (vetted), Integrated (used) |
| `Agent Type` | Which subagent performed research |
| `Sources` | Documentation, URLs, or files consulted |
| `Findings` | Key points and detailed findings |
| `Recommendations` | Actionable next steps |
| `Open Questions` | Items needing more research |
| `Subagent Metadata` | Tracking info for research task |

---

## Status Lifecycle

```
Draft ──▶ Reviewed ──▶ Integrated
  │          │            │
  │          │            └── Findings used in plan/code
  │          └── Main session vetted findings
  └── Fresh from subagent
```

**Draft:** Subagent just completed research
**Reviewed:** Main session has vetted and confirmed findings
**Integrated:** Findings have been incorporated into plans or code

---

## Usage Pattern

1. User runs `/paul:research <topic>`
2. Workflow spawns appropriate subagent
3. Subagent researches and returns findings
4. RESEARCH.md created with status: Draft
5. Main session reviews findings
6. Status updated to Reviewed when vetted
7. Status updated to Integrated when used

---

## Relationship to Other Files

| File | Relationship |
|------|--------------|
| CONTEXT.md | May inform discussion or result from questions |
| PLAN.md | May reference research findings |
| RESEARCH.md | This file (research output) |
| subagent-criteria.md | Validates when to spawn research |
