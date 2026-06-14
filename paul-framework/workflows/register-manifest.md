<purpose>
Migrate paul.json → paul.toml for pre-v1.4 PAUL projects, or create paul.toml from STATE.md for projects missing any manifest. Handles both migration and fresh creation in a single workflow.
</purpose>

<when_to_use>
- Project has .paul/ directory but no paul.toml
- Project has paul.json that needs migrating to paul.toml
- User explicitly runs /paul:register
</when_to_use>

<references>
@src/references/toml-sync.md (Pattern 3: Auto-migrate paul.json)
@src/templates/paul-toml.md (field schema)
@src/templates/ledger-toml.md (ledger schema)
</references>

<process>

<step name="validate_preconditions" priority="first">
1. Check .paul/ exists:
   ```bash
   ls .paul/ 2>/dev/null
   ```
   If missing: "No .paul/ directory found. Run /paul:init first."
   Stop.

2. Check if paul.toml already exists:
   ```bash
   ls .paul/paul.toml 2>/dev/null
   ```
   If exists: "paul.toml already exists. Nothing to do. BASE v2 will detect this project on next session start."
   Stop.

3. Determine mode:
   ```bash
   ls .paul/paul.json 2>/dev/null
   ```
   - If paul.json exists → `migration_mode = true`
   - If paul.json missing → `creation_mode = true`
</step>

<step name="read_state">
Read .paul/STATE.md to extract current project state:
```bash
cat .paul/STATE.md 2>/dev/null
```

Extract from STATE.md (best-effort — use defaults if not found):
- **project name**: infer from current directory name (`basename $(pwd)`)
- **milestone name**: look for `Milestone:` line under `## Current Position`
- **milestone version**: look for version in parentheses on `Milestone:` line
- **milestone status**: if `MILESTONE COMPLETE` → "complete"; if active plans → "in_progress"; otherwise → "not_started"
- **phase number**: look for `Phase: N of M` line
- **phase name**: text after the number on the Phase line
- **phase status**: if COMPLETE → "complete"; if Planning → "planning"; if active → "in_progress"; otherwise → "not_started"
- **loop position**: check Loop Position section — if all ✓ or IDLE → "IDLE"; else match current marker

**Defaults if STATE.md missing or unparseable:**
- name: directory name
- version: "0.1.0"
- milestone: name "None", version "0.1.0", status "not_started"
- phase: number 0, name "None", status "not_started"
- loop: position "IDLE"
</step>

<step name="create_paul_toml">
**If `migration_mode`:**

Execute Pattern 3 from @src/references/toml-sync.md:
1. Read .paul/paul.json
2. Map fields to paul.toml schema (per field mapping table in toml-sync.md)
3. Add `[paul]` section: version = current PAUL framework version, source = "https://chrisai.cv/skool"
4. Add `status = "active"` (new field)
5. Derive `path` from cwd relative to workspace root
6. Add `tags = []`
7. Add `[stats]` with defaults (total_plans = 0, total_phases = 0, last_activity = now)
8. Write .paul/paul.toml
9. Delete .paul/paul.json
10. Run BASE v2 detection check (per Pattern 3, Step 5)

**If `creation_mode`:**

Create paul.toml from STATE.md values using @src/templates/paul-toml.md:
1. Populate all fields from read_state values (or defaults)
2. Add `[paul]` section: version = current PAUL framework version, source = "https://chrisai.cv/skool"
3. Set `status = "active"`
4. Derive `path` from cwd relative to workspace root
5. Set `tags = []`
6. Set `[stats]` with defaults
7. Write .paul/paul.toml
8. Run BASE v2 detection check (per Pattern 3, Step 5)

**Both modes:**

Create ledger.toml if missing:
```bash
ls .paul/ledger.toml 2>/dev/null
```
If not found, create:
```toml
# .paul/ledger.toml — Session history for cost/time attribution
# Append-only. BASE extracts for usage analytics cross-reference.
```
</step>

<step name="confirm">
**If `migration_mode`:**
```
════════════════════════════════════════
MANIFEST MIGRATED
════════════════════════════════════════

Migrated paul.json → paul.toml ✓

  name:      [project_name]
  version:   [version]
  milestone: [milestone_name] ([milestone_status])
  phase:     [phase_number] — [phase_name] ([phase_status])
  loop:      [loop_position]

paul.json deleted ✓
paul.toml created ✓
ledger.toml ready ✓

BASE v2 will auto-detect on next session start.

PAUL Framework v1.4 · Chris AI Systems · https://chrisai.cv/skool · https://youtube.com/@chris-ai-systems
════════════════════════════════════════
```

**If `creation_mode`:**
```
════════════════════════════════════════
MANIFEST CREATED
════════════════════════════════════════

paul.toml created for [project_name] ✓

  name:      [project_name]
  version:   [version]
  milestone: [milestone_name] ([milestone_status])
  phase:     [phase_number] — [phase_name] ([phase_status])
  loop:      [loop_position]

paul.toml created ✓
ledger.toml ready ✓

BASE v2 will auto-detect on next session start.

PAUL Framework v1.4 · Chris AI Systems · https://chrisai.cv/skool · https://youtube.com/@chris-ai-systems
════════════════════════════════════════
```
</step>

</process>

<output>
- `.paul/paul.toml` created with current project state and [paul] provenance
- `.paul/paul.json` deleted (if migration mode)
- `.paul/ledger.toml` created (if missing)
</output>
