# Project Issues Log

Template for `.paul/ISSUES.md` — deferred enhancements discovered during execution.

**Purpose:** Track nice-to-haves that aren't critical to current work. These follow deviation rule #5: log enhancements, continue with plan.

**Location:** `.paul/ISSUES.md` (project-level, not phase-level)

---

## File Template

```markdown
# Project Issues Log

Enhancements discovered during execution. Not critical - address in future phases.

## Open Enhancements

### ISS-001: [Brief description]

- **Discovered:** Phase [X] Plan [Y] (YYYY-MM-DD)
- **Type:** [Performance / Refactoring / UX / Testing / Documentation / Accessibility]
- **Description:** [What could be improved and why it would help]
- **Impact:** Low (works correctly, this would enhance)
- **Effort:** [Quick / Medium / Substantial]
- **Suggested phase:** [Phase number or "Future"]

### ISS-002: [Brief description]

...

## Closed Enhancements

[Moved here when addressed]

### ISS-001: [Brief description]
**Resolved:** [date] — Addressed in Phase [X] Plan [Y]
**Commit:** [hash or "N/A"]

---

*Last updated: [date]*
```

---

## Issue Types

| Type | Description | Example |
|------|-------------|---------|
| Performance | Speed or efficiency improvements | "Cache API responses" |
| Refactoring | Code quality improvements | "Extract shared utility" |
| UX | User experience enhancements | "Add loading spinner" |
| Testing | Test coverage additions | "Add edge case tests" |
| Documentation | Doc improvements | "Add JSDoc comments" |
| Accessibility | A11y improvements | "Add ARIA labels" |

---

## Effort Estimates

| Effort | Definition |
|--------|------------|
| Quick | < 30 min, single task |
| Medium | 1-2 hours, may need its own plan |
| Substantial | Half day+, definitely needs dedicated plan |

---

## When to Create

**Create an issue when:**
- During APPLY, you notice something that could be better
- It's not blocking current work
- It's not a bug (bugs get fixed immediately)
- It would be scope creep to address now

**Don't create an issue when:**
- It's a bug (fix it or document as blocker)
- It's required for current AC (do it)
- It's already in the roadmap

---

## Workflow

1. During APPLY, notice enhancement opportunity
2. Log to `.paul/ISSUES.md` with ISS-NNN format
3. Note in SUMMARY.md: "Logged ISS-003 for future consideration"
4. Continue with current plan
5. Review ISSUES.md during phase planning
6. Address issues in appropriate future phase
