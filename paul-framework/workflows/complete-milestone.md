<purpose>
Mark a milestone complete after all phases are done. Creates permanent milestone entry in MILESTONES.md, archives the milestone state, evolves PROJECT.md requirements, updates ROADMAP.md, and prepares for the next milestone.

**Completion ritual:** This is a moment to reflect on what was accomplished before moving forward.
</purpose>

<when_to_use>
- All phases in current milestone have status "Complete"
- User explicitly triggers milestone completion
- Triggered by transition-phase when last phase completes
</when_to_use>

<loop_context>
N/A - This is a milestone transition workflow, not a loop phase.
After completion, project is ready for /paul:discuss-milestone or /paul:milestone.
</loop_context>

<required_reading>
@.paul/STATE.md
@.paul/PROJECT.md
@.paul/ROADMAP.md
@.paul/phases/{milestone-phases}/*-SUMMARY.md
</required_reading>

<references>
@src/templates/MILESTONES.md (entry format)
@src/templates/milestone-archive.md (archive format)
</references>

<process>

<step name="verify_readiness" priority="first">
1. Read ROADMAP.md to identify current milestone phases
2. For each phase in milestone:
   - Check if Status = "Complete" or "✅ Complete"
   - Count completed vs total

3. **If all phases complete:**
   - Display: "All {N} phases complete. Ready to finalize milestone."
   - Proceed to next step

4. **If incomplete phases exist:**
   ```
   ════════════════════════════════════════
   MILESTONE INCOMPLETE
   ════════════════════════════════════════

   {milestone_name} has incomplete phases:

   | Phase | Name | Status |
   |-------|------|--------|
   | {N} | {name} | ✓ Complete |
   | {N+1} | {name} | ✗ In Progress |

   Options:
   [1] Complete remaining phases first
   [2] Mark complete anyway (skip remaining)
   ════════════════════════════════════════
   ```
   Wait for decision. If "1" → exit workflow. If "2" → proceed.
</step>

<step name="gather_stats">
Calculate milestone statistics:

1. **Duration:**
   - Read first SUMMARY.md `started:` timestamp
   - Read last SUMMARY.md `completed:` timestamp
   - Calculate elapsed time

2. **Files:**
   - Count unique files in all SUMMARY.md `key-files.created` + `key-files.modified`

3. **Plans:**
   - Count SUMMARY.md files across all phases

4. **Phases:**
   - Count phase directories in milestone

Store as stats object:
```
duration: "X days" or "X hours"
files_changed: N
plans_completed: N
phases: N
```
</step>

<step name="extract_accomplishments">
Read all SUMMARY.md files from milestone phases:

1. Collect all "Accomplishments" sections
2. Deduplicate similar items
3. Group by theme/feature
4. Create 5-10 bullet summary

Store as `accomplishments` list.
</step>

<step name="create_milestone_entry">
Create or update `.paul/MILESTONES.md`:

**If file doesn't exist, create with header:**
```markdown
# Milestones

Completed milestone log for this project.

| Milestone | Completed | Duration | Stats |
|-----------|-----------|----------|-------|

---

```

**Add entry:**
```markdown
## ✅ {milestone_name}

**Completed:** {date}
**Duration:** {duration}

### Stats

| Metric | Value |
|--------|-------|
| Phases | {phases} |
| Plans | {plans_completed} |
| Files changed | {files_changed} |

### Key Accomplishments

{accomplishments as bullets}

### Key Decisions

{decisions from SUMMARY.md files}

---

```

**Update table at top:**
```markdown
| {milestone_name} | {date} | {duration} | {phases} phases, {plans} plans |
```
</step>

<step name="evolve_project">
**Full PROJECT.md review — the milestone boundary is the right time to evolve requirements.**

Read PROJECT.md and assess each section:

1. **Requirements - Validated:**
   - What requirements shipped in this milestone?
   - Move from "Active" to "Validated": `- [x] {requirement} — {milestone_name}`

2. **Requirements - Invalidated:**
   - What requirements were discovered unnecessary?
   - Move to "Out of Scope": `- {requirement} — Discovered during {milestone_name}`

3. **Requirements - Emerged:**
   - What new requirements emerged during building?
   - Add to "Active": `- [ ] {new requirement}`

4. **Key Decisions:**
   - Extract significant decisions from milestone SUMMARYs
   - Add to Key Decisions table with date and rationale

5. **Success Metrics:**
   - Update "Current" column with actual values

6. **Version:**
   - Update version number to milestone version

Update footer: `*Last updated: {date} after {milestone_name}*`
</step>

<step name="archive_milestone">
Create milestone archive:

1. Create directory:
   ```bash
   mkdir -p .paul/milestones
   ```

2. Create archive file `.paul/milestones/{version}-ROADMAP.md`:
   - Copy current ROADMAP.md content
   - Add archive header with completion date
   - This preserves the state at milestone completion

3. Archive structure:
   ```markdown
   # {milestone_name} - Archive

   **Archived:** {date}
   **Status:** Complete

   ---

   {ROADMAP.md content at time of completion}
   ```
</step>

<step name="reorganize_roadmap">
Update ROADMAP.md to collapse completed milestone:

1. **Update Current Milestone section:**
   ```markdown
   ## Current Milestone
   **{milestone_name}** ({version})
   Status: ✅ Complete
   Completed: {date}
   ```

2. **Add Next Milestone placeholder:**
   ```markdown
   ## Next Milestone
   Run /paul:discuss-milestone or /paul:milestone to define.
   ```

3. **Move completed phases to Completed section:**
   ```markdown
   ## Completed Milestones

   <details>
   <summary>{milestone_name} - {date} ({phases} phases)</summary>

   | Phase | Name | Plans | Completed |
   |-------|------|-------|-----------|
   | {N} | {name} | {X/X} | {date} |

   </details>
   ```

4. **Update footer timestamp**
</step>

<step name="update_state">
Update STATE.md for post-milestone state:

1. **Current Position:**
   ```markdown
   ## Current Position

   Milestone: Awaiting next milestone
   Phase: None active
   Plan: None
   Status: Milestone {milestone_name} complete — ready for next
   Last activity: {timestamp} — Milestone completed
   ```

2. **Progress:**
   ```markdown
   Progress:
   - {milestone_name}: [██████████] 100% ✓
   ```

3. **Loop Position:**
   ```markdown
   ## Loop Position

   Current loop state:
   ```
   PLAN ──▶ APPLY ──▶ UNIFY
     ○        ○        ○     [Milestone complete - ready for next]
   ```
   ```

4. **Session Continuity:**
   ```markdown
   ## Session Continuity

   Last session: {timestamp}
   Stopped at: Milestone {milestone_name} complete
   Next action: /paul:discuss-milestone or /paul:milestone
   Resume file: .paul/MILESTONES.md
   ```
</step>

<step name="verify_version_alignment">
**Verify version consistency across all locations before tagging:**

**Version locations to check:**

| Location | Field | Example |
|----------|-------|---------|
| `.paul/PROJECT.md` | Current State table → Version | `0.3.0` |
| `.paul/ROADMAP.md` | Version Overview table | `v0.3` |
| `.paul/STATE.md` | Version field | `v0.3.0` |
| `.paul/config.md` | version field (if exists) | `0.3.0` |
| `package.json` | "version" field (if exists) | `"0.3.0"` |

**1. Read current version from each location:**
```bash
# PROJECT.md - extract from Current State table
grep -A5 "Current State" .paul/PROJECT.md | grep "Version"

# ROADMAP.md - check Version Overview
grep -A10 "Version Overview" .paul/ROADMAP.md

# STATE.md - Version field
grep "^Version:" .paul/STATE.md

# config.md (if exists)
[ -f .paul/config.md ] && grep "version:" .paul/config.md

# package.json (if exists)
[ -f package.json ] && grep '"version"' package.json
```

**2. Compare versions:**

**If all aligned:**
```
Version alignment check: ✓
All locations show: {version}
```
Proceed to git_tag.

**If misaligned:**
```
════════════════════════════════════════
VERSION MISMATCH DETECTED
════════════════════════════════════════

| Location | Current Version |
|----------|-----------------|
| PROJECT.md | {version_1} |
| ROADMAP.md | {version_2} |
| STATE.md | {version_3} |
| config.md | {version_4} |
| package.json | {version_5} |

Which version is correct? [{version_1}] / [{version_2}] / [other]
════════════════════════════════════════
```

**3. Update misaligned versions:**
After user confirms correct version, update all locations:
- PROJECT.md: Update Current State table
- ROADMAP.md: Update Version Overview table
- STATE.md: Update Version field
- config.md: Update version field (if exists)
- package.json: Update "version" field (if exists)

```bash
# Example: Update package.json
npm version {version} --no-git-tag-version
```

**4. Commit version alignment if changes made:**
```bash
git add .paul/PROJECT.md .paul/ROADMAP.md .paul/STATE.md
[ -f .paul/config.md ] && git add .paul/config.md
[ -f package.json ] && git add package.json
git commit -m "chore: align version to {version} for milestone release

Co-Authored-By: Claude <noreply@anthropic.com>"
```

Display:
```
Version alignment: ✓
All locations now show: {version}
```
</step>

<step name="git_tag">
Create annotated git tag:

```bash
git tag -a "{version}" -m "{milestone_name} complete - {accomplishment_summary}"
```

Display:
```
Git tag created: {version}
(Push with: git push origin {version})
```

**Note:** Do not push automatically — user controls when to push.
</step>

<step name="sync_paul_toml">
**Sync project manifest and ledger:**

Reference: @src/references/toml-sync.md

**1. Sync paul.toml** (Pattern 1):
   - Check for `.paul/paul.toml` first
   - If not found: check for `.paul/paul.json` → auto-migrate per Pattern 3
   - If neither found: skip silently
   - Update fields:
     - `milestone.status` → "complete"
     - `paul.version` → current PAUL framework version
     - `stats.last_activity` → current ISO timestamp

**2. Append to ledger.toml** (Pattern 2):
   ```toml
   [[entry]]
   action = "milestone_complete"
   phase = [last phase number]
   at = "[ISO timestamp]"
   ```
</step>

<step name="offer_next">
Display completion with celebration:

```
════════════════════════════════════════
🎉 MILESTONE COMPLETE
════════════════════════════════════════

{milestone_name}

Stats:
| Metric | Value |
|--------|-------|
| Duration | {duration} |
| Phases | {phases} |
| Plans | {plans_completed} |
| Files | {files_changed} |

Key Accomplishments:
{top 3 accomplishments}

Created:
  .paul/MILESTONES.md entry    ✓
  .paul/milestones/{version}-ROADMAP.md    ✓
  git tag: {version}    ✓

Updated:
  PROJECT.md (evolved)    ✓
  ROADMAP.md (reorganized)    ✓
  STATE.md (cleared)    ✓

────────────────────────────────────────
▶ NEXT: /paul:discuss-milestone
  Define the scope for the next milestone
────────────────────────────────────────

Or /paul:milestone to create milestone directly.
```
</step>

</process>

<output>
- MILESTONES.md entry created
- .paul/milestones/{version}-ROADMAP.md archive created
- PROJECT.md evolved (requirements validated/invalidated)
- ROADMAP.md reorganized (milestone collapsed)
- STATE.md cleared for next milestone
- Git tag created
</output>

<success_criteria>
- [ ] All phases verified complete (or user chose to skip)
- [ ] Statistics gathered from SUMMARYs
- [ ] MILESTONES.md entry created with accomplishments
- [ ] Archive file created in .paul/milestones/
- [ ] PROJECT.md evolved (requirements audited)
- [ ] ROADMAP.md reorganized (milestone collapsed)
- [ ] STATE.md updated for post-milestone state
- [ ] Version alignment verified across 5 locations
- [ ] Git tag created
- [ ] Clear next action offered
</success_criteria>

<error_handling>
**MILESTONES.md doesn't exist:**
- Create it with header template
- Proceed with entry creation

**No SUMMARY.md files found:**
- Warn: "No summaries found for milestone phases"
- Offer to proceed anyway or investigate

**Git tag already exists:**
- Warn: "Tag {version} already exists"
- Offer: increment patch version or skip tag

**PROJECT.md evolution unclear:**
- Ask user which requirements to validate/invalidate
- Don't make assumptions about requirement status
</error_handling>
