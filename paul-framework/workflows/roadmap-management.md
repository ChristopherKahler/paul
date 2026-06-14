<purpose>
Handle dynamic roadmap modifications: adding phases to the current milestone and removing future phases. These are the "escape hatches" when scope changes mid-milestone.

**Operations:**
- **add-phase:** Append a new phase to the current milestone
- **remove-phase:** Remove a future (not-started) phase
</purpose>

<when_to_use>
- User realizes more phases are needed mid-milestone
- Scope changed and a planned phase is no longer needed
- Emergency phase insertion (use decimal phases for interruptions)
- Roadmap cleanup after requirements change
</when_to_use>

<loop_context>
N/A - This is a roadmap modification workflow, not a loop phase.
Can be invoked at any time during a milestone.
</loop_context>

<required_reading>
@.paul/ROADMAP.md
@.paul/STATE.md
</required_reading>

<references>
@src/templates/ROADMAP.md (phase section format)
</references>

---

## Operation: add-phase

<process>

<step name="add_validate" priority="first">
1. Read ROADMAP.md for current milestone
2. Identify highest phase number in milestone
3. Calculate next phase number = highest + 1

**If no active milestone:**
- Error: "No active milestone. Run /paul:milestone first."
- Exit workflow
</step>

<step name="add_gather_info">
Ask for phase details:

```
Adding phase {next_number} to {milestone_name}.

Phase name?
(Example: "Testing", "Documentation", "Performance")
```

Wait for response. Store as `phase_name`.

Optional follow-up:
```
Brief description? (Press Enter to skip)
```

Store as `phase_description` or derive from name.
</step>

<step name="add_update_roadmap">
Update ROADMAP.md:

1. **Update milestone header:**
   ```markdown
   Phases: {X} of {new_total} complete
   ```

2. **Add to phases table:**
   ```markdown
   | {next_number} | {phase_name} | TBD | Not started | - |
   ```

3. **Add phase details section:**
   ```markdown
   ### Phase {next_number}: {phase_name}

   Focus: {phase_description}
   Plans: TBD (defined during /paul:plan)
   Status: Not started
   ```

4. **Update footer timestamp**
</step>

<step name="add_create_directory">
Create phase directory:

```bash
mkdir -p .paul/phases/{NN}-{phase-slug}
```

Where:
- `NN` = zero-padded phase number
- `phase-slug` = lowercase, hyphenated phase name
</step>

<step name="add_update_state">
Update STATE.md:

1. **Last activity:**
   ```markdown
   Last activity: {timestamp} — Added Phase {number}: {name}
   ```

2. **Decisions (add to table):**
   ```markdown
   | Added Phase {number}: {name} | Phase {current} | Extends milestone scope |
   ```
</step>

<step name="add_confirm">
Display confirmation:

```
════════════════════════════════════════
PHASE ADDED
════════════════════════════════════════

Phase {number}: {name}
Directory: .paul/phases/{slug}/

{milestone_name} now has {total} phases.

ROADMAP.md updated ✓
STATE.md updated ✓

Continue with current work or plan this phase later.
════════════════════════════════════════
```
</step>

</process>

---

## Operation: remove-phase

<process>

<step name="remove_validate" priority="first">
1. Read ROADMAP.md for current milestone
2. Find target phase by number or name
3. Check phase status

**Validation rules:**
- Phase must be "Not started" — cannot remove in-progress or complete phases
- Phase must be in current milestone
- Cannot remove if it's the only remaining phase

**If validation fails:**
```
Cannot remove Phase {number}: {name}
Reason: {status is not "Not started" / only remaining phase / not in current milestone}

Only future (not started) phases can be removed.
```
Exit workflow.
</step>

<step name="remove_confirm_intent">
Ask for confirmation:

```
════════════════════════════════════════
REMOVE PHASE?
════════════════════════════════════════

Phase {number}: {name}
Status: Not started

This will:
- Remove from ROADMAP.md
- Delete .paul/phases/{slug}/ (if empty)
- Renumber subsequent phases

[1] Yes, remove | [2] Cancel
════════════════════════════════════════
```

Wait for confirmation. If "2" or "cancel" → exit.
</step>

<step name="remove_update_roadmap">
Update ROADMAP.md:

1. **Remove phase from table**

2. **Remove phase details section**

3. **Renumber subsequent phases:**
   - Phase 7 removed → Phase 8 becomes 7, Phase 9 becomes 8, etc.
   - Update both table and details sections

4. **Update milestone header:**
   ```markdown
   Phases: {X} of {new_total} complete
   ```

5. **Update footer timestamp**
</step>

<step name="remove_cleanup_directory">
Handle phase directory:

```bash
rmdir .paul/phases/{NN}-{slug} 2>/dev/null
```

**If directory not empty:**
- Warn: "Directory not empty — preserved at .paul/phases/{slug}/"
- User can manually delete if desired

**If directory empty or doesn't exist:**
- Silently removed or was never created
</step>

<step name="remove_renumber_directories">
**If subsequent phases exist:**

Renumber phase directories to match ROADMAP.md:

```bash
mv .paul/phases/08-name .paul/phases/07-name
mv .paul/phases/09-name .paul/phases/08-name
```

**Note:** This is why we only allow removing "Not started" phases — they have no artifacts yet.
</step>

<step name="remove_update_state">
Update STATE.md:

1. **Last activity:**
   ```markdown
   Last activity: {timestamp} — Removed Phase {number}: {name}
   ```

2. **Decisions (add to table):**
   ```markdown
   | Removed Phase {original_number}: {name} | Phase {current} | Scope reduction |
   ```

3. **If removed phase was "next":**
   - Update current position to reflect new next phase
</step>

<step name="remove_confirm">
Display confirmation:

```
════════════════════════════════════════
PHASE REMOVED
════════════════════════════════════════

Removed: Phase {original_number}: {name}
{renumbered_phases count} phases renumbered.

{milestone_name} now has {total} phases.

ROADMAP.md updated ✓
STATE.md updated ✓
════════════════════════════════════════
```
</step>

</process>

---

<output>
**add-phase:**
- ROADMAP.md updated with new phase
- Phase directory created
- STATE.md decision logged

**remove-phase:**
- ROADMAP.md updated (phase removed, subsequent renumbered)
- Phase directory removed (if empty)
- Subsequent directories renumbered
- STATE.md decision logged
</output>

<success_criteria>
**add-phase:**
- [ ] Next phase number calculated correctly
- [ ] Phase added to ROADMAP.md table and details
- [ ] Directory created
- [ ] STATE.md updated
- [ ] Milestone total updated

**remove-phase:**
- [ ] Phase status validated (not started only)
- [ ] User confirmed removal
- [ ] Phase removed from ROADMAP.md
- [ ] Directory cleaned up
- [ ] Subsequent phases renumbered
- [ ] STATE.md updated
</success_criteria>

<validation_rules>
**add-phase:**
- Active milestone must exist
- Phase name required
- Cannot add duplicate phase names (warning only)

**remove-phase:**
- Phase must exist
- Phase must be "Not started"
- Cannot remove last phase in milestone
- Cannot remove phase with artifacts (PLAN.md, SUMMARY.md)
</validation_rules>

<error_handling>
**No active milestone:**
- Route to /paul:milestone or /paul:init

**Phase directory not empty:**
- Preserve directory, warn user
- User can manually clean up

**Renumbering conflicts:**
- If directory already exists at target number, warn and skip
- Report which directories couldn't be renamed

**ROADMAP.md malformed:**
- Report parsing error
- Suggest manual fix
</error_handling>
