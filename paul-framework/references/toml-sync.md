<toml_sync>

## Purpose

Shared reference for paul.toml sync, ledger.toml append, and paul.json auto-migration. All PAUL workflows that change project state reference this document for consistent behavior.

**Templates:** @src/templates/paul-toml.md (field schema), @src/templates/ledger-toml.md (ledger schema)

---

## Pattern 1: Sync paul.toml

**Read-modify-write pattern used by every lifecycle workflow.**

1. Check for `.paul/paul.toml`:
   - If found → read it, proceed to step 3
   - If not found → check for `.paul/paul.json`
     - If paul.json found → execute **Pattern 3: Auto-migrate** first, then proceed with the resulting paul.toml
     - If neither found → skip silently (pre-v1.1 project or non-PAUL-managed)

2. **Never skip this step when paul.toml exists.** Every state change must be reflected.

3. Read current paul.toml content.

4. Update ONLY the fields listed for the calling workflow in the Update Trigger Matrix below. Do not touch fields not in your workflow's column.

5. **Always update these two fields regardless of workflow:**
   - `paul.version` → current PAUL framework version (e.g., `"1.4.0"`)
   - `stats.last_activity` → current ISO 8601 timestamp with timezone

6. Write paul.toml back (full overwrite — it's a state snapshot, not append).

### Update Trigger Matrix (which fields each workflow updates)

| Field | init | plan | apply | unify | transition | create-ms | complete-ms | verify | pause | resume |
|-------|------|------|-------|-------|------------|-----------|-------------|--------|-------|--------|
| `name` | ✓ | | | | | | | | | |
| `version` | ✓ | | | | | ✓ | | | | |
| `status` | ✓ | | | | | | ✓* | | ✓ | ✓ |
| `path` | ✓ | | | | | | | | | |
| `tags` | ✓ | | | | | | | | | |
| `paul.version` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `paul.source` | ✓ | | | | | | | | | |
| `milestone.*` | ✓ | | | | | ✓ | ✓ | | | |
| `phase.*` | ✓ | | | ✓ | ✓ | ✓ | | | | |
| `phase.plans_completed` | | | | +1 | | 0 | | | | |
| `loop.position` | ✓ | ✓ | ✓ | ✓ | | ✓ | | | | |
| `loop.plan` | | ✓ | | omit | | omit | | | | |
| `loop.plan_path` | | ✓ | | omit | | omit | | | | |
| `satellite.groom` | ✓ | | | | | | | | | |
| `stats.total_plans` | ✓ | | | +1 | | | | | | |
| `stats.total_phases` | ✓ | | | | +1 | | | | | |
| `stats.last_activity` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

*`complete-ms` sets `status` → "complete" only if this is the final milestone.

**TOML null handling:** When setting loop to IDLE, REMOVE the `plan` and `plan_path` keys entirely rather than setting them to empty strings. TOML has no null — field absence = idle.

---

## Pattern 2: Append to ledger.toml

**Append-only pattern used after every state change.**

1. If `.paul/ledger.toml` doesn't exist, create it with header:
   ```toml
   # .paul/ledger.toml — Session history for cost/time attribution
   # Append-only. BASE extracts for usage analytics cross-reference.
   ```

2. Append one `[[entry]]` block to the end of the file:
   ```toml

   [[entry]]
   action = "{action_value}"
   phase = {phase_number}
   plan = "{plan_id}"
   at = "{ISO 8601 timestamp with timezone}"
   ```

3. Include `plan` field only for plan-level actions (plan, apply, unify, iteration, verify). Omit for milestone-level and status-change actions (transition, milestone_create, milestone_complete).

4. Include `note` field only when there is meaningful context (iteration reasons, gap descriptions). Do not add empty notes.

5. This is APPEND — never overwrite existing entries, never modify previous entries.

### Action Values by Workflow

| Workflow | `action` value | Include `plan`? |
|----------|---------------|-----------------|
| plan-phase | `"plan"` | Yes |
| apply-phase | `"apply"` | Yes |
| unify-phase | `"unify"` | Yes |
| iteration (fix cycles) | `"iteration"` | Yes |
| verify-work | `"verify"` | Yes |
| transition-phase | `"transition"` | No |
| create-milestone | `"milestone_create"` | No |
| complete-milestone | `"milestone_complete"` | No |

---

## Pattern 3: Auto-migrate paul.json

**Triggered when a workflow finds `.paul/paul.json` but no `.paul/paul.toml`.**

### Step 1: Read paul.json

```bash
cat .paul/paul.json
```

### Step 2: Map fields to paul.toml

| paul.json field | paul.toml field | Notes |
|-----------------|-----------------|-------|
| `name` | `name` | Direct map |
| `version` | `version` | Direct map |
| *(absent)* | `status` | Default: `"active"` |
| *(absent)* | `path` | Auto-detect: cwd relative to workspace root |
| *(absent)* | `tags` | Default: `[]` |
| *(absent)* | `[paul].version` | Current PAUL framework version |
| *(absent)* | `[paul].source` | `"https://chrisai.cv/skool"` |
| `milestone.name` | `[milestone].name` | Direct map |
| `milestone.version` | `[milestone].version` | Direct map |
| `milestone.status` | `[milestone].status` | Direct map |
| *(absent)* | `[milestone].phases` | Default: `0` (corrected on next milestone action) |
| `phase.number` | `[phase].number` | Direct map |
| `phase.name` | `[phase].name` | Direct map |
| `phase.status` | `[phase].status` | Direct map |
| *(absent)* | `[phase].plans_completed` | Default: `0` (corrected on next unify) |
| `loop.position` | `[loop].position` | Direct map |
| `loop.plan` | `[loop].plan` | Omit if null/IDLE |
| *(absent)* | `[loop].plan_path` | Omit (unknown from paul.json) |
| `satellite.groom` | `[satellite].groom` | Direct map |
| *(absent)* | `[stats].total_plans` | Default: `0` |
| *(absent)* | `[stats].total_phases` | Default: `0` |
| *(absent)* | `[stats].last_activity` | Current ISO timestamp |
| `id` | *(dropped)* | BASE-v2 uses IRI identity, not satellite UUIDs |
| `timestamps.*` | *(dropped)* | BASE manages lastActive via extraction |
| `handoff.*` | *(dropped)* | Not part of manifest |
| `next_action` | *(dropped)* | Not part of manifest |
| `last_plan_completed_at` | *(dropped)* | Replaced by stats.last_activity |

### Step 3: Write paul.toml

Write the mapped TOML to `.paul/paul.toml`.

### Step 4: Delete paul.json

```bash
rm .paul/paul.json
```

### Step 5: Check for BASE v2

```bash
which base 2>/dev/null && base --version 2>/dev/null
```

**Evaluate result:**

- **base binary found + version output contains a semver** (Rust binary) → Silent pass. Integration active.

- **base binary found + version output is empty/error/Python format** (v1 detected) → Display:
  ```
  ⚠️ BASE v1 detected — no longer supported with PAUL.
  BASE v2 is part of the Official Agentic OS by Chris AI Systems.
  Upgrade: https://chrisai.cv/skool
  ```

- **No base binary on PATH** → Display:
  ```
  ℹ️ BASE not installed. PAUL works standalone, but for the full
  Agentic OS experience — workspace intelligence, proactive context,
  knowledge graph — get BASE v2: https://chrisai.cv/skool
  ```

### Step 6: Confirm

Display: `"Migrated paul.json → paul.toml ✓"`

---

## Workflow Integration

Each workflow that changes state includes two steps after its core STATE.md update:

```markdown
<step name="sync_paul_toml">
**Sync project manifest and ledger:**

Reference: @src/references/toml-sync.md

1. **Sync paul.toml** (Pattern 1):
   [workflow-specific field updates listed here]

2. **Append to ledger.toml** (Pattern 2):
   action = "[workflow action value]"
   phase = [current phase number]
   plan = "[current plan ID]" (if applicable)
</step>
```

This replaces the old `sync_paul_json` step in all workflows.

</toml_sync>
