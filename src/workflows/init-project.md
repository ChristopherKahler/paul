<purpose>
Initialize PAUL structure in a new project. Creates .paul/ directory with PROJECT.md, ROADMAP.md, STATE.md, and phases/ directory. Gathers project context through a type-adapted requirements walkthrough before populating files — instead of leaving skeleton placeholders for planning to fill.
</purpose>

<when_to_use>
- Starting PAUL in a project that doesn't have .paul/ directory
- User explicitly requests project initialization
- Beginning a new project from scratch
</when_to_use>

<loop_context>
N/A - This is a setup workflow, not a loop phase.
After init, project is ready for first PLAN.
</loop_context>

<philosophy>
**Flow and momentum:** Init should feel like the natural start of work, not a chore.
- Ask questions conversationally — instead of presenting all sections at once, because users disengage when faced with a wall of questions
- Populate files from answers (user doesn't edit templates)
- Adapt depth to what the user is actually building — instead of one-size-fits-all, because a CLI tool and a SaaS platform need different scoping depth
- End with ONE next action
- Build momentum into planning
</philosophy>

<references>
@src/templates/config.md
@src/templates/paul-json.md
@src/references/sonarqube-integration.md
</references>

<process>

<step name="check_existing" priority="first">
1. Check if .paul/ directory exists:
   ```bash
   ls .paul/ 2>/dev/null
   ```
2. If exists:
   - "PAUL already initialized in this project."
   - Route to `/paul:resume` or `/paul:progress`
   - Exit this workflow
3. If not exists: proceed with initialization
</step>

<step name="detect_planning_md" priority="early">
**Check for existing PLANNING.md (from SEED graduation or manual creation).**

1. Check if PLANNING.md exists in project root:
   ```bash
   ls PLANNING.md 2>/dev/null
   ```
2. **If found:**
   - Display:
     ```
     Found PLANNING.md in this directory.

     This file contains project requirements that can populate your PAUL setup
     automatically — instead of answering setup questions from scratch.

     [1] Yes, import from PLANNING.md
     [2] No, start fresh
     ```
   - Wait for response
   - **If "1" or "yes" or "import":**
     - Read PLANNING.md fully
     - Parse: project name, description, core value, type, tech stack, requirements, constraints, phases, success criteria
     - Store all parsed fields
     - Skip to `create_structure` → then directly to `create_project_md` (using imported data)
     - Skip the requirements walkthrough (PLANNING.md already covers it)
   - **If "2" or "no" or "fresh":**
     - Proceed with normal flow

3. **If not found:** Proceed with normal flow (no message needed)
</step>

<step name="create_structure">
Create directories first (gives immediate feedback):
```bash
mkdir -p .paul/phases
```

Display:
```
PAUL structure created.

Before planning, I need to understand what you're building.
```
</step>

<step name="gather_core_value">
**Ask ONE question at a time — instead of batching questions, because single-question flow produces more thoughtful answers and builds conversational momentum.**

**Question 1: Core Value**
```
What's the core value this project delivers?

(Example: "Users can track expenses and see spending patterns")
```

Wait for user response. Store as `core_value`.
</step>

<step name="gather_description">
**Question 2: What are you building?**
```
What are you building? (1-2 sentences)

(Example: "A CLI tool for managing Docker containers"
 or "An email drip campaign for our SaaS launch"
 or "An automation that syncs CRM contacts to our email platform")
```

Wait for user response. Store as `description`.
</step>

<step name="gather_project_name">
**Question 3: Project name**

Infer from:
1. Directory name
2. package.json name field
3. Ask if unclear

If obvious, confirm:
```
Project name: [inferred-name]

Is this correct? (yes/different name)
```

Store as `project_name`.
</step>

<step name="detect_project_type">
**Determine what kind of project this is — instead of assuming everything is a software application, because PAUL manages campaigns, workflows, and other non-code projects equally well.**

Present type selection:
```
What kind of project is this?

[1] Application — software (web app, CLI, API, mobile app)
[2] Campaign — marketing (funnel, ads, email sequence, launch)
[3] Workflow — automation (integrations, processes, pipelines)
[4] Other — tell me what you're building
```

Wait for user response.

**If "4" or "other":**
- Ask: "Describe it briefly — I'll adapt the setup questions."
- Store response, proceed with universal sections only

Store as `project_type`.

**Infer complexity from description + type:**
- **Simple:** description mentions single purpose, 1-2 features, small scope → store `complexity = simple`
- **Standard:** typical scope for the type → store `complexity = standard`
- **Complex:** multi-service, multi-channel, enterprise, or user mentions multiple major systems → store `complexity = complex`

Do NOT ask the user about complexity — infer it. If uncertain, default to `standard`.
</step>

<step name="requirements_walkthrough">
**Type-adapted requirements gathering. Work through sections conversationally — offer concrete suggestions when the user is stuck, push toward decisions when it's time, let ideas breathe when they need space.**

**Style rules:**
- Present 1-2 related sections at a time, not all at once — instead of dumping every question, because focused conversations produce deeper answers
- If the user already addressed something naturally in prior answers, acknowledge it and move on — instead of re-asking, because repetition kills momentum
- Offer concrete suggestions: "For this kind of project, most builders use X because..." or "Given your timeline, you might consider Y"
- If the user is stuck, propose a direction: "Here's one way this could work: ..."
- If the user is going too broad, gently constrain: "That's ambitious — what's the minimum slice that proves the concept?"

**Section routing by type:**

**Application projects — ask in this order:**
1. **Tech Stack:** "Do you have a stack in mind, or exploring? What's the deployment target?" (Suggest: "For solo builders, Next.js + SQLite ships fast. For teams, consider what everyone knows.")
2. **Core Features:** "What are the 3-5 things a user does in this app? What's the minimum slice that proves the concept?"
3. **Data Model (skip if complexity=simple):** "What are the core things this app tracks? How do they relate? Start with 3-5 entities."
4. **Deployment Target (skip if complexity=simple):** "Where does this run? Local dev, cloud, Docker? CI/CD needed?"
5. **Known Constraints:** "Any auth requirements? External APIs you need to integrate? Compliance needs? Hard timeline?"
6. **Success Criteria:** "What does 'working' look like? How will you know this project succeeded?"

**Campaign projects — ask in this order:**
1. **Deliverables:** "What are the deliverables? (landing pages, emails, ad copy, video scripts, etc.)"
2. **Platforms & Tools:** "What platforms are you using? (GHL, ClickFunnels, Mailchimp, Meta Ads, etc.)"
3. **Target Audience:** "Who is this for? What channels will you reach them on? What's the timeline?"
4. **Known Constraints:** "Budget limits? Brand guidelines? Approval chains? Hard deadlines?"
5. **Success Metrics:** "What metrics define success? (conversion rate, open rate, ROAS, lead volume, etc.)"

**Workflow projects — ask in this order:**
1. **Automation Scope:** "What does this automate? What triggers it?"
2. **Integrations & Tools:** "What systems does this connect? APIs, webhooks, platforms involved?"
3. **Data Flow:** "What data goes in, what comes out? Where does it execute — cron, webhook, manual trigger?"
4. **Known Constraints:** "Rate limits? Auth requirements? Error handling needs? SLAs?"
5. **Success Criteria:** "What does 'done' look like? How do you verify it works?"

**Other projects — universal sections only:**
1. **Core Deliverables:** "What are the main things this project produces or delivers?"
2. **Tools Involved:** "What tools, platforms, or technologies are involved?"
3. **Known Constraints:** "Any hard limits, requirements, or timeline constraints?"
4. **Success Criteria:** "How will you know this project succeeded?"

**Adaptive depth:**
- If `complexity = simple`: Ask core features/deliverables + constraints + success criteria only. Skip data model, deployment detail, and any section not essential.
- If `complexity = standard`: Full walkthrough for the selected type.
- If `complexity = complex`: Full walkthrough. After completing, trigger `seed_recommendation` step.

Store all gathered data by section name.

Wait for user response at each section boundary before proceeding.
</step>

<step name="seed_recommendation">
**Only triggers if `complexity = complex` OR if user's answers were notably thin across 2+ sections.**

Present SEED recommendation:
```
This project has significant scope. For deeper incubation — detailed planning,
phased breakdown, design decisions, data model design — PAUL has a companion
tool called SEED that specializes in this.

SEED produces a PLANNING.md that PAUL can consume directly.

[1] Install SEED and start there (recommended for complex projects)
[2] Continue with PAUL init using what we've gathered
```

Wait for user response.

**If "1" or "install":**
1. Run: `npx paul-framework add-skill seed` (or applicable install command)
2. Display: "SEED installed. Starting ideation with your project context..."
3. Hand off to `/seed` — pass project_name, description, core_value, project_type, and any gathered requirements as context
4. Exit init workflow (SEED will handle the rest; user returns via `/seed launch`)

**If "2" or "continue":**
- Proceed to create_project_md with gathered data
</step>

<step name="create_project_md">
**Generate PROJECT.md populated from walkthrough data — instead of skeleton placeholders, because plans built against real requirements produce better output.**

Create `.paul/PROJECT.md`:

```markdown
# [project_name]

## What This Is

[description]

## Core Value

[core_value]

## Current State

| Attribute | Value |
|-----------|-------|
| Type | [project_type] |
| Version | 0.0.0 |
| Status | Initializing |
| Last Updated | [timestamp] |

## Requirements

### Core [Features / Deliverables / Automation Scope — label adapts by type]

[Populated from walkthrough — the 3-5 core items identified]
- [item 1]
- [item 2]
- [item 3]

### Validated (Shipped)
None yet.

### Active (In Progress)
None yet.

### Planned (Next)
[If phases were discussed during walkthrough, list high-level phase goals here]

### Out of Scope
[If user mentioned things they explicitly excluded during walkthrough, capture here]

## Constraints

### Technical Constraints
[Populated from known constraints — tech/platform/deployment limits]
- [constraint 1]

### Business Constraints
[Populated from known constraints — timeline, budget, dependencies]
- [constraint 1]

## Key Decisions

| Decision | Rationale | Date | Status |
|----------|-----------|------|--------|
[If tech stack or approach decisions were made during walkthrough, record them]

## Success Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
[Populated from success criteria walkthrough — label adapts by type]
| [metric 1] | [target] | - | Not started |

## Tech Stack / Tools

| Layer | Technology | Notes |
|-------|------------|-------|
[Populated from tech stack / platforms / tools walkthrough — adapts by type]
[Application: Framework, DB, Hosting, Auth, etc.]
[Campaign: Platform, Ad tools, Email tool, etc.]
[Workflow: Integration platform, APIs, Scheduler, etc.]

---
*Created: [timestamp]*
```

**If PLANNING.md was imported:** Populate all sections from parsed PLANNING.md data instead of walkthrough data. Preserve all decisions, tech stack choices, phase breakdowns, and constraints from the original document.

**Fallback:** If any section has no data from the walkthrough (user skipped or answered minimally), use a single-line placeholder: `- To be defined during /paul:plan` — instead of multi-line placeholder blocks, because minimal placeholders signal "not yet explored" without cluttering the document.
</step>

<step name="create_roadmap_md">
Create `.paul/ROADMAP.md`:

```markdown
# Roadmap: [project_name]

## Overview
[description]

## Current Milestone
**v0.1 Initial Release** (v0.1.0)
Status: Not started
Phases: 0 of TBD complete

## Phases

| Phase | Name | Plans | Status | Completed |
|-------|------|-------|--------|-----------|
| 1 | TBD | TBD | Not started | - |

## Phase Details

Phases will be defined during `/paul:plan`.

---
*Roadmap created: [timestamp]*
```

Note: Phase details are populated during planning, not init.
</step>

<step name="create_state_md">
Create `.paul/STATE.md`:

```markdown
# Project State

## Project Reference

See: .paul/PROJECT.md (updated [timestamp])

**Core value:** [core_value]
**Current focus:** Project initialized — ready for planning

## Current Position

Milestone: v0.1 Initial Release
Phase: Not yet defined
Plan: None yet
Status: Ready to create roadmap and first PLAN
Last activity: [timestamp] — Project initialized

Progress:
- Milestone: [░░░░░░░░░░] 0%

## Loop Position

Current loop state:
```
PLAN ──▶ APPLY ──▶ UNIFY
  ○        ○        ○     [Ready for first PLAN]
```

## Accumulated Context

### Decisions
[If any decisions were made during init walkthrough, record them here]

### Deferred Issues
None yet.

### Blockers/Concerns
None yet.

## Session Continuity

Last session: [timestamp]
Stopped at: Project initialization complete
Next action: Run /paul:plan to define phases and first plan
Resume file: .paul/PROJECT.md

---
*STATE.md — Updated after every significant action*
```
</step>

<step name="create_paul_json">
**Create satellite manifest for external system discovery.**

Reference: @src/templates/paul-json.md

Create `.paul/paul.json`:
```json
{
  "name": "[project_name]",
  "version": "0.0.0",
  "milestone": {
    "name": "None",
    "version": "0.0.0",
    "status": "not_started"
  },
  "phase": {
    "number": 0,
    "name": "None",
    "status": "not_started"
  },
  "loop": {
    "plan": null,
    "position": "IDLE"
  },
  "timestamps": {
    "created_at": "[ISO timestamp]",
    "updated_at": "[ISO timestamp]"
  },
  "satellite": {
    "groom": true
  }
}
```

**Note:** paul.json is infrastructure — no extra display or user prompts needed.
</step>

<step name="prompt_integrations">
**Ask about optional integrations:**

```
Optional integrations:

Would you like to enable SonarQube code quality scanning?
(Requires SonarQube server and MCP server - can enable later)

[1] Yes, enable SonarQube
[2] Skip for now
```

Wait for user response.

**If "1" or "yes" or "enable":**

1. Prompt for project key:
   ```
   SonarQube project key?
   (Press Enter to use: [project_name])
   ```

   - If user presses Enter: use `project_name`
   - Otherwise: use provided key

2. Create `.paul/config.md`:
   ```markdown
   # Project Config

   **Project:** [project_name]
   **Created:** [timestamp]

   ## Project Settings

   ```yaml
   project:
     name: [project_name]
     version: 0.0.0
   ```

   ## Integrations

   ### SonarQube

   ```yaml
   sonarqube:
     enabled: true
     project_key: [project_key]
   ```

   ## Preferences

   ```yaml
   preferences:
     auto_commit: false
     verbose_output: false
   ```

   ---
   *Config created: [timestamp]*
   ```

3. Store `integrations_enabled = true`

**If "2" or "skip" or "no":**

Store `sonarqube_enabled = false`
(Don't create config.md yet - check enterprise audit next)
</step>

<step name="prompt_enterprise_audit">
**Ask about enterprise plan audit:**

```
Is this a commercial/enterprise project that needs architectural plan auditing?
(Adds enterprise-grade review step between PLAN and APPLY)

[1] Yes, enable enterprise plan audit
[2] Skip for now
```

Wait for user response.

**If "1" or "yes" or "enable":**

Store `enterprise_audit_enabled = true`

**If "2" or "skip" or "no":**

Store `enterprise_audit_enabled = false`
</step>

<step name="create_config_if_needed">
**Create config.md if any integration was enabled.**

If `sonarqube_enabled` OR `enterprise_audit_enabled`:

Create `.paul/config.md`:
```markdown
# Project Config

**Project:** [project_name]
**Created:** [timestamp]

## Project Settings

```yaml
project:
  name: [project_name]
  version: 0.0.0
```

## Integrations

### SonarQube

```yaml
sonarqube:
  enabled: [true/false based on sonarqube_enabled]
  project_key: [project_key if enabled]
```

### Enterprise Plan Audit

```yaml
enterprise_plan_audit:
  enabled: [true/false based on enterprise_audit_enabled]
```

## Preferences

```yaml
preferences:
  auto_commit: false
  verbose_output: false
```

---
*Config created: [timestamp]*
```

Store `integrations_enabled = true`

**If neither was enabled:**

Store `integrations_enabled = false`
(Don't create config.md - user can add later via /paul:config)
</step>

<step name="check_specialized_flows">
**Ask about specialized skills:**

```
Do you have specialized skills or commands for this project?
(e.g., /revops-expert, /frontend-design, custom workflows)

[1] Yes, configure now
[2] Skip for now (add later via /paul:flows)
```

Wait for user response.

**If "1" or "yes" or "configure":**

1. Store `specialized_flows_enabled = true`
2. Route to: @workflows/configure-special-flows.md
3. After completion, return to init confirmation
4. Store `skills_configured_count` from workflow output

**If "2" or "skip" or "no":**

Store `specialized_flows_enabled = false`
(User can add later via /paul:flows)
</step>

<step name="confirm_and_route">
**Display confirmation with ONE next action:**

**Display based on enabled features:**

```
════════════════════════════════════════
PAUL INITIALIZED
════════════════════════════════════════

Project: [project_name]
Type: [project_type]
Core value: [core_value]

Created:
  .paul/PROJECT.md    ✓  (requirements populated from walkthrough)
  .paul/ROADMAP.md    ✓
  .paul/STATE.md      ✓
  .paul/paul.json     ✓
  .paul/config.md     ✓  (if integrations_enabled: list enabled integrations)
  .paul/SPECIAL-FLOWS.md  ✓  (if specialized_flows_enabled: "[N] skills configured")
  .paul/phases/       ✓

────────────────────────────────────────
▶ NEXT: /paul:plan
  Define your phases and create your first plan.
────────────────────────────────────────

Type "yes" to proceed, or ask questions first.
```

**Note:** Only show config.md and SPECIAL-FLOWS.md lines if those features were enabled.
If neither was enabled, show the minimal version without those lines.

**Config line detail:** When showing config.md, list what's enabled:
- If sonarqube_enabled: include "SonarQube"
- If enterprise_audit_enabled: include "Enterprise Plan Audit"
- Example: `.paul/config.md ✓ (SonarQube, Enterprise Plan Audit enabled)`

**Do NOT suggest multiple next steps.** ONE action only.
</step>

</process>

<output>
- `.paul/` directory structure
- `.paul/PROJECT.md` (populated from walkthrough or PLANNING.md import)
- `.paul/ROADMAP.md` (skeleton for planning)
- `.paul/STATE.md` (initialized state)
- `.paul/paul.json` (satellite manifest for external system discovery)
- `.paul/config.md` (if integrations enabled)
- `.paul/SPECIAL-FLOWS.md` (if specialized flows enabled)
- `.paul/phases/` (empty directory)
- Clear routing to `/paul:plan`
</output>

<error_handling>
**Permission denied:**
- Report filesystem error
- Ask user to check permissions

**User declines to answer:**
- Use single-line placeholder: "- To be defined during /paul:plan"
- Note that planning will ask for this information

**Partial creation failure:**
- Report what was created vs failed
- Offer to retry or clean up

**PLANNING.md parse failure:**
- Warn: "Couldn't parse all sections from PLANNING.md. I'll use what I can and ask about the rest."
- Fall back to walkthrough for unparsed sections
</error_handling>
