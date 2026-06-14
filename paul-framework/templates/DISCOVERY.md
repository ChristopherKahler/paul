# DISCOVERY.md Template

Template for `.paul/phases/{phase-number}-{name}/DISCOVERY.md` — technical discovery documentation.

**Purpose:** Document technical research, options comparison, and recommendations before planning.

---

## File Template

```markdown
---
phase: XX-name
topic: [what was discovered]
depth: [quick | standard | deep]
confidence: [HIGH | MEDIUM | LOW]
created: YYYY-MM-DD
---

# Discovery: [Topic]

**Recommendation:** [One-liner recommendation]

**Confidence:** [HIGH/MEDIUM/LOW] — [Brief justification]

## Objective

What we needed to learn before planning:
- [Question 1]
- [Question 2]
- [Question 3]

## Scope

**Include:**
- [What was researched]

**Exclude:**
- [What was explicitly out of scope]

## Findings

### Option A: [Name]

**Source:** [URL or documentation reference]

**Summary:** [Brief description]

**Pros:**
- [Advantage 1]
- [Advantage 2]

**Cons:**
- [Disadvantage 1]
- [Disadvantage 2]

**For our use case:** [Fit assessment]

### Option B: [Name]

**Source:** [URL or documentation reference]

**Summary:** [Brief description]

**Pros:**
- [Advantage 1]
- [Advantage 2]

**Cons:**
- [Disadvantage 1]
- [Disadvantage 2]

**For our use case:** [Fit assessment]

## Comparison

| Criteria | Option A | Option B |
|----------|----------|----------|
| [Criterion 1] | [Rating] | [Rating] |
| [Criterion 2] | [Rating] | [Rating] |
| [Criterion 3] | [Rating] | [Rating] |

## Recommendation

**Choose: [Option]**

**Rationale:**
[Why this option is best for our specific use case]

**Caveats:**
- [Any limitations or concerns to watch for]

## Open Questions

[Questions that remain after discovery - may affect implementation]

- [Question 1] — Impact: [low/medium/high]
- [Question 2] — Impact: [low/medium/high]

Or: "None — discovery answered all questions."

## Quality Report

**Sources consulted:**
- [Source 1 with date]
- [Source 2 with date]

**Verification:**
- [Claim 1]: Verified via [source]
- [Claim 2]: Verified via [source]

**Assumptions (not verified):**
- [Assumption 1]

---
*Discovery completed: [date]*
*Confidence: [level]*
*Ready for: /paul:plan [phase]*
```

---

## Section Specifications

### Frontmatter

| Field | Required | Purpose |
|-------|----------|---------|
| `phase` | Yes | Phase this discovery informs |
| `topic` | Yes | What was discovered |
| `depth` | Yes | quick, standard, or deep |
| `confidence` | Yes | HIGH, MEDIUM, or LOW |
| `created` | Yes | Discovery date |

### Confidence Levels

| Level | Meaning | Evidence Required |
|-------|---------|-------------------|
| HIGH | Verified, low risk | Multiple authoritative sources, tested |
| MEDIUM | Likely accurate | Official docs OR multiple sources |
| LOW | Uncertain | Single source, assumptions, gaps |

### Quality Report

Required for Level 2-3 discovery:
- List all sources with dates
- Verify each key claim
- Document assumptions explicitly
