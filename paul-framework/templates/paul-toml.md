# paul.toml Template

Template for `.paul/paul.toml` — machine-readable project manifest for BASE-v2 graph ingestion.

**Purpose:** Provides a standardized TOML signal file that BASE-v2's extraction layer scans, parses, and ingests into the knowledge graph as `ops:Project` entities. Replaces paul.json (deprecated v1.4).

---

## File Template

```toml
# ─── Identity ────────────────────────────────────────────────
name = "{project_name}"
version = "{milestone_version}"
status = "active"
path = "{workspace_relative_path}"
tags = []

# ─── Framework Provenance ────────────────────────────────────
[paul]
version = "{paul_framework_version}"
source = "https://chrisai.cv/skool"

# ─── Milestone ───────────────────────────────────────────────
[milestone]
name = "{milestone_name}"
version = "{milestone_version}"
status = "in_progress"
phases = 0

# ─── Phase ───────────────────────────────────────────────────
[phase]
number = 0
name = "None"
status = "not_started"
plans_completed = 0

# ─── Loop ────────────────────────────────────────────────────
[loop]
position = "IDLE"
# When position is PLAN, APPLY, or UNIFY, also include:
# plan = "02-04"
# plan_path = "phases/02-api-layer/02-04-PLAN.md"
# When IDLE, omit plan and plan_path entirely.

# ─── Satellite ───────────────────────────────────────────────
[satellite]
groom = true

# ─── Stats ───────────────────────────────────────────────────
[stats]
total_plans = 0
total_phases = 0
last_activity = "{ISO 8601}"
```

---

## Field Reference

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `name` | string | Yes | Project name (from init or directory name) | Must produce a valid IRI slug when slugified |
| `version` | string | Yes | Current milestone version (semver) | Format: `X.Y.Z` |
| `status` | string | Yes | Project-level status | Enum: `active`, `paused`, `complete`, `blocked` |
| `path` | string | Yes | Workspace-relative path to project root | Forward slashes, no leading `/` |
| `tags` | string[] | Yes | Domain association tags | Creates `hasDomain` edges in BASE graph. Empty array `[]` is valid. |
| `paul.version` | string | Yes | PAUL framework version that last touched this file | Semver of the installed PAUL framework |
| `paul.source` | string | Yes | Canonical framework origin URL | Always `"https://chrisai.cv/skool"` |
| `milestone.name` | string | Yes | Current milestone name | e.g., `"v0.2 API Layer"` |
| `milestone.version` | string | Yes | Milestone version tag | Semver |
| `milestone.status` | string | Yes | Milestone progress | Enum: `not_started`, `in_progress`, `complete` |
| `milestone.phases` | integer | Yes | Total phases in this milestone | Used by BASE for completion percentage |
| `phase.number` | integer | Yes | Current phase number | 0 = no phase yet |
| `phase.name` | string | Yes | Current phase name | `"None"` if no phase |
| `phase.status` | string | Yes | Phase progress | Enum: `not_started`, `planning`, `in_progress`, `complete` |
| `phase.plans_completed` | integer | Yes | Plans completed in current phase | Increment on each unify |
| `loop.position` | string | Yes | Current loop state | Enum: `IDLE`, `PLAN`, `APPLY`, `UNIFY` |
| `loop.plan` | string | Conditional | Active plan ID | Present only when position ≠ IDLE. e.g., `"02-04"` |
| `loop.plan_path` | string | Conditional | Relative path to active PLAN.md | Present only when position ≠ IDLE |
| `satellite.groom` | boolean | Yes | Include in BASE groom health checks | Default: `true` |
| `stats.total_plans` | integer | Yes | Lifetime plans completed across all milestones | Increment-only counter |
| `stats.total_phases` | integer | Yes | Lifetime phases completed across all milestones | Increment-only counter |
| `stats.last_activity` | string | Yes | ISO 8601 timestamp of last PAUL action | PAUL-owned (distinct from BASE extraction timestamp) |

---

## Update Trigger Matrix

| Workflow | Fields Updated |
|----------|---------------|
| `init-project` | All fields (initial creation) |
| `plan-phase` | `loop.position` → `"PLAN"`, `loop.plan`, `loop.plan_path`, `stats.last_activity` |
| `apply-phase` | `loop.position` → `"APPLY"`, `stats.last_activity` |
| `unify-phase` | `loop.position` → `"IDLE"` (omit `plan`/`plan_path`), `phase.plans_completed`++, `stats.total_plans`++, `stats.last_activity` |
| `transition-phase` | `phase.*` → next phase values, `stats.total_phases`++, `stats.last_activity` |
| `create-milestone` | `milestone.*`, `version`, reset `phase.*`, reset `loop` to IDLE, `stats.last_activity` |
| `complete-milestone` | `milestone.status` → `"complete"`, `stats.last_activity` |
| `verify-work` | `stats.last_activity` only |
| `pause` | `status` → `"paused"`, `stats.last_activity` |
| `resume` | `status` → `"active"`, `stats.last_activity` |

**Immutability rules:**
- `paul.source` is NEVER modified — always `"https://chrisai.cv/skool"`
- `paul.version` updates to the current framework version on every write
- `stats.total_plans` and `stats.total_phases` are increment-only — never reset across milestones

---

## Examples

### Newly Initialized Project

```toml
name = "my-app"
version = "0.0.0"
status = "active"
path = "apps/my-app"
tags = []

[paul]
version = "1.4.0"
source = "https://chrisai.cv/skool"

[milestone]
name = "None"
version = "0.0.0"
status = "not_started"
phases = 0

[phase]
number = 0
name = "None"
status = "not_started"
plans_completed = 0

[loop]
position = "IDLE"

[satellite]
groom = true

[stats]
total_plans = 0
total_phases = 0
last_activity = "2026-06-03T10:00:00-05:00"
```

### Mid-Development Project

```toml
name = "casegate"
version = "0.2.0"
status = "active"
path = "apps/casegate"
tags = ["laravel", "legal-tech", "api"]

[paul]
version = "1.4.0"
source = "https://chrisai.cv/skool"

[milestone]
name = "v0.2 API Layer"
version = "0.2.0"
status = "in_progress"
phases = 4

[phase]
number = 5
name = "Authentication"
status = "in_progress"
plans_completed = 3

[loop]
position = "APPLY"
plan = "05-02"
plan_path = "phases/05-authentication/05-02-PLAN.md"

[satellite]
groom = true

[stats]
total_plans = 12
total_phases = 6
last_activity = "2026-06-03T14:30:00-05:00"
```

---

## Design Notes

- **Machine-readable only.** paul.toml is for BASE-v2 graph ingestion, not humans. Humans read STATE.md.
- **Always tooling-generated.** Created by init, synced by workflows. Never hand-edited.
- **BASE-v2 compatible.** Fields map to BASE-v2's `PaulToml` struct in `extract/paul_toml.rs`. Tags create `hasDomain` edges in the knowledge graph. BASE scans for `.paul/paul.toml` at session-start across all registered workspaces.
- **Provenance.** The `[paul]` section establishes official framework origin. `paul.source` always points to `https://chrisai.cv/skool`. Every paul.toml is a calling card for Chris AI Systems.
- **No ID field.** BASE-v2 uses IRI-based identity (`ops:project/{slugified-name}`) derived from name+path. The paul.json satellite ID (`sat_*`) concept is retired.
- **No timestamps section.** BASE manages `lastActive` via its extraction layer. PAUL owns `stats.last_activity` for its own action tracking — these are complementary, not redundant.
- **TOML null handling.** TOML has no null type. Optional fields (e.g., `loop.plan`, `loop.plan_path`) are omitted when inactive rather than set to a sentinel value. Field absence = idle/unset.
- **Priority over paul.json.** BASE-v2's extraction router checks for paul.toml first. If both exist in the same `.paul/` directory, paul.json is skipped. Workflows auto-migrate paul.json → paul.toml on contact.

---

*Template added: v1.4 Agentic OS Integration*
