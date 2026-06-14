---
paths:
  - "src/references/**/*.md"
---

# Reference File Rules

Rules for editing files in `src/references/`.

## No Frontmatter

References don't use YAML frontmatter. They are conceptual documentation, not executable artifacts.

## File Structure

References follow a teaching-oriented structure:

1. **Outer container** — Semantic XML tag matching the concept (optional but common)
2. **Purpose section** — What this reference explains
3. **Concepts section** — Core ideas with explanations
4. **Examples section** — Concrete illustrations (good vs bad when applicable)
5. **Anti-patterns section** — What to avoid and WHY

## Outer Container Pattern

References often use an outer XML container related to their topic:

```markdown
<!-- checkpoints.md -->
<checkpoints>
## Purpose
...

## Checkpoint Types
...
</checkpoints>

<!-- subagent-criteria.md -->
<subagent_criteria>
## Purpose
...

## When to Use Subagents
...
</subagent_criteria>
```

Not a strict requirement — use when it adds semantic clarity.

## Teaching Patterns

References explain concepts for workflows and commands to load when relevant.

**Teach by contrast:**
```markdown
## Vague vs Specific

<!-- BAD -->
<task>
  <action>Set up authentication</action>
</task>

<!-- GOOD -->
<task>
  <action>
    Create POST /api/auth/login endpoint:
    - Accept { email, password }
    - Validate with bcrypt compare
    - Return JWT token (15min expiry)
  </action>
</task>
```

**Explain WHY:**
```markdown
## Why Boundaries Matter

Without explicit boundaries, AI assistants may:
- Refactor code outside the plan scope
- "Improve" working code that wasn't part of the task
- Break existing functionality while fixing something else

Boundaries prevent scope creep by making off-limits areas explicit.
```

## Loading Pattern

References are lazy-loaded by workflows when conceptual context is needed:

```xml
<!-- In a workflow -->
<required_reading>
@src/references/checkpoints.md (when plan has checkpoints)
@src/references/subagent-criteria.md (when parallel execution considered)
</required_reading>
```

References should be self-contained — a workflow can load just one reference without needing others.

## Key Principle

References explain concepts and patterns. They are loaded by workflows/commands when relevant context is needed.

References are NOT:
- Step-by-step instructions (that's workflows)
- Document structure definitions (that's templates)
- Behavioral rules (that's CARL domains)
