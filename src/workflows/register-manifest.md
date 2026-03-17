<purpose>
Generate .paul/paul.json for an existing PAUL project that predates v1.1. Reads current STATE.md to populate fields accurately, falls back to sensible defaults if STATE.md is unreadable.
</purpose>

<when_to_use>
- Project has .paul/ directory but no paul.json
- User needs BASE satellite auto-detection to work for this project
- Migrating a pre-v1.1 project to v1.1+ infrastructure
</when_to_use>

<process>

<step name="validate_preconditions" priority="first">
1. Check .paul/ exists:
   ```bash
   ls .paul/ 2>/dev/null
   ```
   If missing: "No .paul/ directory found. Run /paul:init first."
   Stop.

2. Check paul.json doesn't already exist:
   ```bash
   ls .paul/paul.json 2>/dev/null
   ```
   If exists: "paul.json already exists. Nothing to do. BASE will detect this project on next session start."
   Stop.
</step>

<step name="read_state">
Read .paul/STATE.md to extract current project state:
```bash
cat .paul/STATE.md 2>/dev/null
```

Extract from STATE.md (best-effort — use defaults if not found):
- **project name**: infer from current directory name (`basename $(pwd)`)
- **milestone name**: look for `Milestone:` line under `## Current Position`
- **milestone version**: look for version in parentheses on `Milestone:` line (e.g., `(v1.0.0)`)
- **milestone status**: if `MILESTONE COMPLETE` in the line → "complete"; if `In Progress` or active plans → "in_progress"; otherwise → "not_started"
- **phase number**: look for `Phase: N of M` line
- **phase name**: text after the number on the Phase line (e.g., `Phase: 3 of 7 (Auth Layer)` → "Auth Layer")
- **phase status**: if COMPLETE → "complete"; if Planning → "planning"; if active → "in_progress"; otherwise → "not_started"
- **loop position**: check Loop Position section — if all three ✓ or IDLE → "IDLE"; if PLAN ✓ but APPLY ○ → "PLAN"; if APPLY ✓ but UNIFY ○ → "APPLY"; if UNIFY in progress → "UNIFY"

**Defaults if STATE.md missing or unparseable:**
- name: directory name
- version: "0.1.0"
- milestone: name "None", version "0.1.0", status "not_started"
- phase: number 0, name "None", status "not_started"
- loop: plan null, position "IDLE"
</step>

<step name="create_paul_json">
Generate `.paul/paul.json` using extracted values:

```json
{
  "name": "[project_name]",
  "version": "[milestone_version]",
  "milestone": {
    "name": "[milestone_name]",
    "version": "[milestone_version]",
    "status": "[milestone_status]"
  },
  "phase": {
    "number": [phase_number],
    "name": "[phase_name]",
    "status": "[phase_status]"
  },
  "loop": {
    "plan": null,
    "position": "[loop_position]"
  },
  "timestamps": {
    "created_at": "[current ISO 8601 timestamp]",
    "updated_at": "[current ISO 8601 timestamp]"
  },
  "satellite": {
    "groom": true
  }
}
```

Write to `.paul/paul.json`.
</step>

<step name="confirm">
Report:
```
paul.json created for [project_name]

.paul/paul.json registered with:
  name:      [project_name]
  version:   [version]
  milestone: [milestone_name] ([milestone_status])
  phase:     [phase_number] — [phase_name] ([phase_status])
  loop:      [loop_position]

BASE will auto-detect and register this project on next session start.
```
</step>

</process>

<output>
`.paul/paul.json` created with current project state populated from STATE.md.
</output>
