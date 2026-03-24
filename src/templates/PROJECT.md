# PROJECT.md Template

Template for `.paul/PROJECT.md` — the project's business context and requirements.

**Purpose:** Define what we're building, why it matters, and constraints. This is the "brief" that informs all planning. Init populates this from a type-adapted requirements walkthrough — instead of leaving placeholders, because plans built against real requirements produce better output.

---

## File Template

```markdown
# [Project Name]

## What This Is

[One paragraph describing what we're building. Be specific about the product/feature, not the technology.]

## Core Value

[Single sentence: What problem does this solve for whom? This is THE thing that matters.]

## Current State

| Attribute | Value |
|-----------|-------|
| Type | [Application / Campaign / Workflow / Other] |
| Version | [current version] |
| Status | [Prototype / MVP / Beta / Production] |
| Last Updated | [YYYY-MM-DD] |

**Production URLs:** (if applicable)
- [URL 1]: [Description]
- [URL 2]: [Description]

## Requirements

### Core [Features / Deliverables / Automation Scope]

<!-- Label adapts by project type:
     Application: "Core Features" — the 3-5 things users do in this app
     Campaign: "Core Deliverables" — landing pages, emails, ad copy, etc.
     Workflow: "Automation Scope" — what this automates and what triggers it
     Other: "Core Deliverables" — primary outputs of this project -->

- [item 1]
- [item 2]
- [item 3]

### Validated (Shipped)

[Requirements that have been implemented and proven]

- [x] [Requirement 1] — [version shipped]

### Active (In Progress)

[Requirements currently being worked on]

- [ ] [Requirement 1] — [status/notes]

### Planned (Next)

[Requirements queued for upcoming work]

- [ ] [Requirement 1]

### Out of Scope

[Explicitly excluded requirements — important for preventing scope creep]

- [Excluded feature 1] — [reason]

## Target Users

**Primary:** [Who is the main user]
- [Key characteristic 1]
- [Key characteristic 2]
- [Their main goal/need]

**Secondary:** [Other users, if applicable]
- [Characteristics]

## Context

**Business Context:**
[Relevant business information — market, partners, strategy]

**Technical Context:**
[Relevant technical information — existing systems, integrations, constraints]

## Constraints

### Technical Constraints

<!-- Type-adapted examples:
     Application: deployment platform limits, framework constraints, auth requirements, external API dependencies
     Campaign: platform limitations, character limits, image specs, automation constraints
     Workflow: rate limits, API auth requirements, platform-specific restrictions, error handling needs -->

- [Constraint 1]
- [Constraint 2]

### Business Constraints

<!-- Type-adapted examples:
     Application: budget, timeline, team skills, compliance requirements
     Campaign: budget, timeline, brand guidelines, approval chains, legal review
     Workflow: SLAs, uptime requirements, data handling policies, vendor contracts -->

- [Constraint 1]
- [Constraint 2]

### Compliance Constraints
- [Constraint 1: e.g., "GDPR data handling required"]

## Key Decisions

| Decision | Rationale | Date | Status |
|----------|-----------|------|--------|
| [What was decided] | [Why] | [YYYY-MM-DD] | Active / Superseded |

## Success Metrics

<!-- Type-adapted examples:
     Application: test coverage, uptime, response time, user adoption, error rate
     Campaign: conversion rate, open rate, click-through rate, ROAS, lead volume, cost per lead
     Workflow: execution success rate, processing time, error rate, throughput, data accuracy -->

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| [Metric 1] | [Target value] | [Current value] | [On track / At risk / Achieved] |

## Tech Stack / Tools

<!-- Adapts by project type:
     Application: framework, frontend, database, hosting, auth, payments
     Campaign: platform (GHL, ClickFunnels), ad platforms (Meta, Google), email tool, analytics
     Workflow: integration platform (Zapier, Make, custom), APIs, scheduler, monitoring
     Other: whatever tools/platforms are involved -->

| Layer | Technology | Notes |
|-------|------------|-------|
| [Layer/Category] | [Tool/Technology] | [Why this choice] |

## Links

| Resource | URL |
|----------|-----|
| Repository | [URL] |
| Production | [URL] |
| Documentation | [URL] |

---
*PROJECT.md — Updated when requirements or context change*
*Last updated: [YYYY-MM-DD]*
```

---

## Section Specifications

### What This Is
**Purpose:** Concrete description of the product/feature.
**Length:** One paragraph.
**Focus:** What it is, not how it's built.

### Core Value
**Purpose:** The ONE thing that matters. Used to guide all decisions.
**Format:** Single sentence answering "What problem for whom?"
**Example:** "Attorneys can make informed accept/reject decisions on cases in under 2 minutes without reading raw documents."

### Core Features / Deliverables / Automation Scope
**Purpose:** The 3-5 primary capabilities or outputs this project delivers. Populated during init walkthrough.
**Type-adaptive label:**
- Application → "Core Features"
- Campaign → "Core Deliverables"
- Workflow → "Automation Scope"
- Other → "Core Deliverables"
**Why:** Plans that reference specific features produce better acceptance criteria than plans referencing "[To be defined]" placeholders.

### Requirements
**Purpose:** Track feature state across development.
**Categories:**
- **Core [Features/Deliverables]:** Top-level project capabilities (populated during init)
- **Validated:** Shipped and proven
- **Active:** Currently being implemented
- **Planned:** Queued for future
- **Out of Scope:** Explicitly excluded (prevents scope creep)

### Target Users
**Purpose:** Who we're building for.
**Include:** Characteristics, goals, needs.
**Why:** Prevents building for imaginary users.
**Note:** For campaigns, this is the target audience. For workflows, this may be internal team or system consumers.

### Constraints
**Purpose:** Hard limits on solutions.
**Categories:**
- Technical (platform, technology requirements)
- Business (partnerships, integrations, budget)
- Compliance (legal, regulatory, security)
**Type-adaptive:** Comments in template show relevant examples per project type.

### Key Decisions
**Purpose:** Record of significant decisions.
**Include:** What, why, when, status (Active/Superseded).
**Integration:** Can sync with decision-logger MCP.
**Note:** Init walkthrough may capture early decisions (tech stack, platform choice, approach). These are pre-populated if gathered.

### Success Metrics
**Purpose:** Measurable outcomes.
**Include:** Target values and current state.
**Type-adaptive:** Application metrics differ from campaign metrics differ from workflow metrics. Comments show relevant examples per type.
**Why:** Objective success criteria prevent endless scope expansion.

### Tech Stack / Tools
**Purpose:** What technologies and platforms are involved.
**Type-adaptive:** "Tech Stack" for applications, "Platforms & Tools" for campaigns, "Integration Stack" for workflows. The table format accommodates all types.
**Note:** Populated during init walkthrough when user discusses their stack/tools/platforms.
