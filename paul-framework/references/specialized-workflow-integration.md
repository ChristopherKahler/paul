<specialized_workflow_integration>

## Purpose

SPECIAL-FLOWS enables explicit tracking of specialized skills, commands, and workflows within PAUL governance. Instead of ad-hoc skill invocation, projects declare which skills apply, when they're required, and UNIFY verifies they were actually used.

**Core principle:** If a skill is important enough to use, it's important enough to track.

## Why This Matters

### The Problem
Users build specialized skills for their work (e.g., `/revops-expert` for persuasion copy, `/frontend-design` for UI components). Without explicit integration:
- Skills are invoked ad-hoc, inconsistently
- No verification that required skills were used
- No gap analysis for continuous improvement
- Knowledge about "which skills for which work" lives only in human memory

### The Solution
Layered reinforcement through the PAUL loop:

```
SPECIAL-FLOWS.md   →  "This project uses X, Y, Z skills"
       ↓
ROADMAP.md         →  "Phase 2 requires X skill"
       ↓
PLAN.md            →  "Task 2.1 invokes /frontend-design"
       ↓
UNIFY              →  "Was skill invoked? Gap noted if not"
```

## Skill Flow

### 1. Declaration (SPECIAL-FLOWS.md)
At project setup, declare which skills apply:

```markdown
| Work Type | Skill/Command | Priority | When Required |
|-----------|---------------|----------|---------------|
| Persuasion copy | /revops-expert | required | Before headlines, CTAs |
| UI components | /frontend-design | optional | Before writing HTML |
```

### 2. Phase Annotation (ROADMAP.md)
Optionally annotate phases with required skills:

```markdown
### Phase 4: Landing Page
**Required Skills:** /revops-expert (copy), /frontend-design (UI)
```

### 3. Task Invocation (PLAN.md)
Plans can reference skills in pre-implementation or task notes:

```markdown
## Pre-Implementation
- [ ] Load /revops-expert (Hormozi frameworks)

## Tasks
1. Write headline copy
   - **Skill:** /revops-expert (value equation)
```

### 4. Verification (UNIFY)
During UNIFY, audit skill invocation:

| Expected | Invoked | Gap? | Notes |
|----------|---------|------|-------|
| /revops-expert | ✓ | - | Loaded Hormozi stack |
| /frontend-design | ○ | Yes | Used inline CSS instead |

Gaps are documented in STATE.md Deviations, not blocked.

## Priority Levels

### Required
- **Definition:** Skill should be invoked for this type of work
- **Verification:** Gap documented in STATE.md if not used
- **Use case:** Core skills that significantly impact quality

### Optional
- **Definition:** Skill is available but not mandatory
- **Verification:** Informational only, no gap logged
- **Use case:** Nice-to-have skills, situational enhancements

## Verification Behavior

### Manual During UNIFY (Not Hook-Based)
Skill usage is verified manually during UNIFY phase:
1. Read SPECIAL-FLOWS.md for declared skills
2. Review conversation/session for invocations
3. Mark each required skill as invoked or gap
4. Document gaps in STATE.md Deviations

**Why not automatic?** Hook-based tracking is complex, may miss invocations, and adds fragility. Manual verification during UNIFY keeps it simple and reliable.

### Warn, Don't Block
Gaps generate warnings, not blocking errors:
- Gaps are documented for learning
- User can note "intentional deviation"
- UNIFY still completes
- Continuous improvement, not rigid enforcement

## Examples

### Example 1: Client Website Project

```markdown
# Specialized Flows

## Project-Level Dependencies

| Work Type | Skill/Command | Priority | When Required |
|-----------|---------------|----------|---------------|
| Persuasion copy | /revops-expert | required | Headlines, CTAs, offers |
| UI components | /frontend-design | required | All HTML generation |
| Pricing sections | /revops-expert:hormozi | optional | Offer stacking phases |

## Phase Overrides

| Phase | Additional Skills | Notes |
|-------|-------------------|-------|
| 3 (Pricing) | /revops-expert:hormozi | Value stacking for offers |

## Templates & Assets

| Asset Type | Location | When Used |
|------------|----------|-----------|
| Hero template | templates/hero-section.html | Homepage hero |
| Testimonial | templates/testimonial-card.html | Social proof sections |
```

### Example 2: Technical Project

```markdown
# Specialized Flows

## Project-Level Dependencies

| Work Type | Skill/Command | Priority | When Required |
|-----------|---------------|----------|---------------|
| API documentation | /docs-generator | optional | After API changes |
| Database changes | /migration-helper | required | Schema modifications |
```

## Evolution and Improvement

### Pattern Recognition
Over time, SPECIAL-FLOWS reveals patterns:
- Which skills are consistently used
- Which are often skipped (maybe not required?)
- New skills that should be added

### Updating Patterns
When intentional deviation becomes the norm:
1. Note deviation in UNIFY
2. Consider updating SPECIAL-FLOWS.md
3. Log decision if significant change

## Integration Points

### With Init
During `/paul:init`, optionally configure specialized flows:
- "Do you have specialized skills for this project?"
- If yes, route to configuration workflow
- If no, skip (can add later via `/paul:flows`)

### With UNIFY
During UNIFY, audit skill usage:
- Check SPECIAL-FLOWS.md for declared skills
- Verify invocations in session
- Document gaps in STATE.md Deviations

### With PROJECT.md
Quick reference in PROJECT.md:

```markdown
## Specialized Flows

See: .paul/SPECIAL-FLOWS.md

Quick Reference:
- /revops-expert → Persuasion copy, offers, CTAs
- /frontend-design → UI components, HTML generation
```

</specialized_workflow_integration>
