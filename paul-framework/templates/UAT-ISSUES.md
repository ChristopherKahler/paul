# UAT Issues Template

Template for `.paul/phases/XX-name/{phase}-{plan}-UAT.md` — issues discovered during user acceptance testing.

**Purpose:** Capture problems found during verify-work workflow. Unlike global ISSUES.md (for deferred enhancements), this file tracks bugs and problems in specific delivered work.

**Location:** Same directory as the SUMMARY.md being tested.

---

## File Template

```markdown
# UAT Issues: Phase [X] Plan [Y]

**Tested:** [date]
**Source:** [path to SUMMARY.md that was tested]
**Tester:** User via verify-work workflow

## Open Issues

### UAT-001: [Brief description]

**Discovered:** [date]
**Phase/Plan:** [XX]-[YY]
**Severity:** [Blocker/Major/Minor/Cosmetic]
**Feature:** [Which feature from the test checklist]
**Description:** [User's description of the problem]
**Expected:** [What should have happened]
**Actual:** [What actually happened]
**Repro:** [Steps to reproduce, if captured]

### UAT-002: [Brief description]

...

## Resolved Issues

[Moved here after fix plan executes and fixes are verified]

### UAT-001: [Brief description]
**Resolved:** [date] — Fixed in {phase}-{plan}-FIX.md
**Commit:** [hash]

---

*Phase: XX-name*
*Plan: YY*
*Tested: [date]*
```

---

## Severity Guide

| Severity | Definition | Example | Action |
|----------|------------|---------|--------|
| **Blocker** | Feature completely unusable | App crashes on button click | Stop, fix immediately |
| **Major** | Feature works but significant problem | Form submits but data not saved | Fix before shipping |
| **Minor** | Feature usable but has issues | Button text slightly cut off | Fix if time permits |
| **Cosmetic** | Visual only, no functional impact | Wrong shade of color | Log, fix later |

---

## UAT Numbering

- **Prefix:** `UAT-` (distinguishes from ISS- enhancement issues)
- **Scope:** Per-file numbering (UAT-001, UAT-002, etc. within each file)
- **No global numbering:** Each {phase}-{plan}-UAT.md has its own sequence

---

## Good Example

```markdown
# UAT Issues: Phase 5 Plan 2

**Tested:** 2026-01-15
**Source:** .paul/phases/05-auth/05-02-SUMMARY.md
**Tester:** User via verify-work workflow

## Open Issues

### UAT-001: Login form doesn't show validation errors

**Discovered:** 2026-01-15
**Phase/Plan:** 05-02
**Severity:** Major
**Feature:** User login form
**Description:** When I enter an invalid email, nothing happens. No error message appears.
**Expected:** Red error message below email field saying "Invalid email format"
**Actual:** Field border turns red but no text explanation
**Repro:**
1. Go to /login
2. Enter "notanemail" in email field
3. Click Login button

### UAT-002: Password field allows paste

**Discovered:** 2026-01-15
**Phase/Plan:** 05-02
**Severity:** Cosmetic
**Feature:** User login form
**Description:** Can paste into password field. Minor UX inconsistency.
**Expected:** Paste disabled (matches signup form)
**Actual:** Paste works in login but not signup
**Repro:** Ctrl+V in password field

## Resolved Issues

[None yet]

---

*Phase: 05-auth*
*Plan: 02*
*Tested: 2026-01-15*
```

---

## Workflow

1. **verify-work workflow** runs against a SUMMARY.md
2. User tests each feature from the plan's AC
3. Issues found → create/update {phase}-{plan}-UAT.md
4. If blockers exist → create FIX plan immediately
5. If majors exist → create FIX plan before shipping
6. After FIX plan executes → move issues to "Resolved" section
7. File becomes historical record of what was found and fixed

---

## Difference from ISSUES.md

| File | Purpose | Content | Timing |
|------|---------|---------|--------|
| **ISSUES.md** | Deferred enhancements | Nice-to-haves discovered during APPLY | During development |
| **UAT-ISSUES.md** | Testing problems | Bugs found during verification | During UAT |
