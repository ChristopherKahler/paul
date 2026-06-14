---
name: help
description: Show available PAUL commands and usage guide
---

<objective>
Display the complete PAUL command reference.

Output ONLY the reference content below. Do NOT add:

- Project-specific analysis
- Git status or file context
- Next-step suggestions
- Any commentary beyond the reference
</objective>

<reference>
# PAUL Command Reference

**PAUL** (Plan-Apply-Unify Loop) is a structured AI-assisted development framework for Claude Code.

## The Loop

Every unit of work follows this cycle:

```
┌─────────────────────────────────────┐
│  PLAN ──▶ APPLY ──▶ UNIFY          │
│                                     │
│  Define    Execute    Reconcile     │
│  work      tasks      & close       │
└─────────────────────────────────────┘
```

**Never skip UNIFY.** Every plan needs a summary.

## Quick Start

1. `/paul:init` - Initialize PAUL in your project
2. `/paul:plan` - Create a plan for your work
3. `/paul:apply` - Execute the approved plan
4. `/paul:unify` - Close the loop with summary

## Commands Overview

| Category | Commands |
|----------|----------|
| Core Loop | init, plan, apply, unify, help, status |
| Session | pause, resume, progress, handoff |
| Roadmap | add-phase, remove-phase |
| Milestone | milestone, complete-milestone, discuss-milestone |
| Pre-Planning | discuss, assumptions, discover, consider-issues |
| Research | research, research-phase |
| Specialized | flows, config, map-codebase |
| Quality | verify, plan-fix, audit |

---

## Core Loop Commands

### `/paul:init`
Initialize PAUL in a project.

- Creates `.paul/` directory structure
- Creates PROJECT.md, STATE.md, ROADMAP.md
- Prompts for project context and phases
- Optionally configures integrations (SonarQube, etc.)

Usage: `/paul:init`

---

### `/paul:plan [phase]`
Enter PLAN phase - create an executable plan.

- Reads current state from STATE.md
- Creates PLAN.md with tasks, acceptance criteria, boundaries
- Populates skills section from SPECIAL-FLOWS.md (if configured)
- Updates loop position

Usage: `/paul:plan` (auto-detects next phase)
Usage: `/paul:plan 3` (specific phase)

---

### `/paul:apply [plan-path]`
Execute an approved PLAN.md file.

- **Blocks if required skills not loaded** (from SPECIAL-FLOWS.md)
- Validates plan exists and hasn't been executed
- Executes tasks sequentially
- Handles checkpoints (decision, human-verify, human-action)
- Reports completion and prompts for UNIFY

Usage: `/paul:apply`
Usage: `/paul:apply .paul/phases/01-foundation/01-01-PLAN.md`

---

### `/paul:unify [plan-path]`
Reconcile plan vs actual and close the loop.

- Creates SUMMARY.md documenting what was built
- Audits skill invocations (if SPECIAL-FLOWS.md configured)
- Records decisions made, deferred issues
- Updates STATE.md with loop closure
- **Required** - never skip this step

Usage: `/paul:unify`
Usage: `/paul:unify .paul/phases/01-foundation/01-01-PLAN.md`

---

### `/paul:help`
Show this command reference.

Usage: `/paul:help`

---

### `/paul:status` *(deprecated)*
> Use `/paul:progress` instead.

Shows current loop position. Deprecated in favor of `/paul:progress` which provides better routing.

---

## Session Commands

### `/paul:pause [reason]`
Create handoff file and prepare for session break.

- Creates HANDOFF.md with complete context
- Updates STATE.md session continuity section
- Designed for context limits or multi-session work

Usage: `/paul:pause`
Usage: `/paul:pause "switching to other project"`

---

### `/paul:resume [handoff-path]`
Restore context from handoff and continue work.

- Reads STATE.md and any HANDOFF files
- Determines current loop position
- Suggests exactly ONE next action
- Archives consumed handoffs

Usage: `/paul:resume`
Usage: `/paul:resume .paul/HANDOFF-context.md`

---

### `/paul:progress [context]`
Smart status with routing - suggests ONE next action.

- Shows milestone and phase progress visually
- Displays current loop position
- Suggests exactly ONE next action (prevents decision fatigue)
- Accepts optional context to tailor suggestion
- Warns about context limits

Usage: `/paul:progress`
Usage: `/paul:progress "I only have 30 minutes"`

---

### `/paul:handoff [context]`
Generate comprehensive session handoff document.

- Creates detailed handoff for complex session breaks
- Captures decisions, progress, blockers, next steps
- More thorough than `/paul:pause`

Usage: `/paul:handoff`
Usage: `/paul:handoff "phase10-audit"`

---

## Roadmap Commands

### `/paul:add-phase <description>`
Append a new phase to the roadmap.

- Adds phase to end of ROADMAP.md
- Updates phase numbering
- Records in STATE.md decisions

Usage: `/paul:add-phase "API Authentication Layer"`

---

### `/paul:remove-phase <number>`
Remove a future (not started) phase from roadmap.

- Cannot remove completed or in-progress phases
- Renumbers subsequent phases
- Updates ROADMAP.md

Usage: `/paul:remove-phase 5`

---

## Milestone Commands

### `/paul:milestone <name>`
Create a new milestone with phases.

- Guides through milestone definition
- Creates phase structure
- Updates ROADMAP.md with milestone grouping

Usage: `/paul:milestone "v2.0 API Redesign"`

---

### `/paul:complete-milestone [version]`
Archive milestone, tag, and reorganize roadmap.

- Verifies all phases complete
- Creates git tag (if configured)
- Archives milestone to MILESTONES.md
- Evolves PROJECT.md for next milestone

Usage: `/paul:complete-milestone`
Usage: `/paul:complete-milestone v0.3`

---

### `/paul:discuss-milestone`
Explore and articulate vision before starting a milestone.

- Conversational exploration of goals
- Creates milestone context document
- Prepares for `/paul:milestone`

Usage: `/paul:discuss-milestone`

---

## Pre-Planning Commands

### `/paul:discuss <phase>`
Articulate vision and explore approach before planning.

- Conversational discussion of phase goals
- Creates CONTEXT.md capturing vision
- Prepares for `/paul:plan`

Usage: `/paul:discuss 3`
Usage: `/paul:discuss "authentication layer"`

---

### `/paul:assumptions <phase>`
Surface Claude's assumptions about a phase before planning.

- Shows what Claude would do if given free rein
- Identifies gaps in understanding
- Prevents misaligned planning

Usage: `/paul:assumptions 3`

---

### `/paul:discover <topic>`
Research technical options before planning a phase.

- Explores codebase for relevant patterns
- Documents findings for planning reference
- Lightweight alternative to full research

Usage: `/paul:discover "authentication patterns"`

---

### `/paul:consider-issues [source]`
Review deferred issues with codebase context, triage and route.

- Reads deferred issues from STATE.md or specified source
- Analyzes with current codebase context
- Suggests routing: fix now, defer, or close

Usage: `/paul:consider-issues`

---

## Research Commands

### `/paul:research <topic>`
Deploy research agents for documentation/web search.

- Spawns subagents for parallel research
- Gathers external documentation
- Creates RESEARCH.md with findings
- Main session vets and reviews results

Usage: `/paul:research "JWT best practices 2026"`

---

### `/paul:research-phase <number>`
Research unknowns for a phase using subagents.

- Identifies unknowns in phase scope
- Deploys research agents
- Synthesizes findings for planning

Usage: `/paul:research-phase 4`

---

## Specialized Commands

### `/paul:flows`
Configure specialized workflow integrations.

- Creates/updates SPECIAL-FLOWS.md
- Defines required skills per work type
- Skills are enforced at APPLY time

Usage: `/paul:flows`

---

### `/paul:config`
View or modify PAUL configuration.

- Shows current config.md settings
- Allows toggling integrations
- Manages project-level settings

Usage: `/paul:config`

---

### `/paul:map-codebase`
Generate codebase map for context.

- Creates structured overview of project
- Identifies key files and patterns
- Useful for research and planning

Usage: `/paul:map-codebase`

---

## Quality Commands

### `/paul:verify`
Guide manual user acceptance testing of recently built features.

- Generates verification checklist from SUMMARY.md
- Guides through manual testing
- Records verification results

Usage: `/paul:verify`

---

### `/paul:audit [plan-path]`
Run enterprise-grade architectural audit on a plan.

- Performs senior engineer + compliance review
- Auto-applies must-have and strongly-recommended findings to plan
- Creates AUDIT.md report in phase directory
- Optional: enabled via `enterprise_plan_audit` in config

Usage: `/paul:audit`
Usage: `/paul:audit .paul/phases/20-ai-schema/20-01-PLAN.md`

---

### `/paul:plan-fix`
Plan fixes for UAT issues from verify.

- Reads issues identified during verify
- Creates targeted fix plan
- Smaller scope than full phase plan

Usage: `/paul:plan-fix`

---

## Files & Structure

```
.paul/
├── PROJECT.md           # Project context and value prop
├── ROADMAP.md           # Phase breakdown and milestones
├── STATE.md             # Loop position and session state
├── config.md            # Optional integrations config
├── SPECIAL-FLOWS.md     # Optional skill requirements
├── MILESTONES.md        # Completed milestone archive
└── phases/
    ├── 01-foundation/
    │   ├── 01-01-PLAN.md
    │   ├── 01-01-AUDIT.md    (if enterprise audit enabled)
    │   └── 01-01-SUMMARY.md
    └── 02-features/
        ├── 02-01-PLAN.md
        ├── 02-01-AUDIT.md    (if enterprise audit enabled)
        └── 02-01-SUMMARY.md
```

## PLAN.md Structure

```markdown
---
phase: 01-foundation
plan: 01
plan_type: execute
autonomous: true
---

<objective>
Goal, Purpose, Output
</objective>

<context>
@-references to relevant files
</context>

<skills>
Required skills from SPECIAL-FLOWS.md
</skills>

<acceptance_criteria>
Given/When/Then format
</acceptance_criteria>

<tasks>
<task type="auto">...</task>
</tasks>

<boundaries>
DO NOT CHANGE, SCOPE LIMITS
</boundaries>

<verification>
Completion checks
</verification>
```

## Task Types

| Type | Use For |
|------|---------|
| `auto` | Fully autonomous execution |
| `checkpoint:decision` | Choices requiring human input |
| `checkpoint:human-verify` | Visual/functional verification |
| `checkpoint:human-action` | Manual steps (rare) |

## Common Workflows

**Starting a new project:**
```
/paul:init
/paul:plan
# Approve plan
/paul:apply
/paul:unify
```

**Enterprise workflow (with audit enabled):**
```
/paul:plan        # Create plan
/paul:audit       # Audit + auto-fix plan
# Approve audited plan
/paul:apply       # Execute
/paul:unify       # Close loop
```

**Checking where you are:**
```
/paul:progress   # State + ONE next action (recommended)
```

**Resuming work (new session):**
```
/paul:resume     # Restores context, suggests next action
```

**Pausing work (before break):**
```
/paul:pause      # Creates handoff, updates state
```

**Pre-planning exploration:**
```
/paul:discuss 3       # Articulate vision
/paul:assumptions 3   # See Claude's assumptions
/paul:research "topic"  # Gather external info
/paul:plan 3          # Now create the plan
```

**Managing roadmap:**
```
/paul:add-phase "New Feature"    # Add phase
/paul:remove-phase 5             # Remove future phase
/paul:milestone "v2.0"           # Create milestone
/paul:complete-milestone         # Archive milestone
```

## Key Principles

1. **Loop must complete** - PLAN -> APPLY -> UNIFY, no shortcuts
2. **Commands are thin** - Logic lives in workflows
3. **State is tracked** - STATE.md knows where you are
4. **Boundaries are real** - Respect DO NOT CHANGE sections
5. **Acceptance criteria first** - Define done before starting
6. **Skills are enforced** - Required skills block APPLY until loaded

## Getting Help

- Run `/paul:progress` to see where you are and what to do next
- Read `.paul/PROJECT.md` for project context
- Read `.paul/STATE.md` for current position
- Check `.paul/ROADMAP.md` for phase overview

---

*PAUL Framework v1.4 · Chris AI Systems · https://chrisai.cv/skool · https://youtube.com/@chris-ai-systems*
*23 commands | 14 workflows | 13 templates*
</reference>
