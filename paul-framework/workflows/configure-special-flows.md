<purpose>
Configure specialized skill integrations for a PAUL project. Discovers available skills, prompts user to select applicable ones, maps skills to work types, and generates .paul/SPECIAL-FLOWS.md.
</purpose>

<when_to_use>
- During init when user has specialized skills/commands
- Ad-hoc via `/paul:flows` command
- When adding new skills to an existing project
- When amending existing SPECIAL-FLOWS.md
</when_to_use>

<loop_context>
N/A - This is a utility workflow, not a loop phase.
Can be run at any time without affecting PLAN/APPLY/UNIFY state.
</loop_context>

<required_reading>
@.paul/PROJECT.md (project context)
@.paul/SPECIAL-FLOWS.md (if exists, for amendment)
</required_reading>

<references>
@src/references/specialized-workflow-integration.md
@src/templates/SPECIAL-FLOWS.md
</references>

<process>

<step name="check_existing" priority="first">
1. Check if .paul/SPECIAL-FLOWS.md exists:
   ```bash
   ls .paul/SPECIAL-FLOWS.md 2>/dev/null
   ```
2. If exists:
   ```
   Existing SPECIAL-FLOWS.md found.

   [1] Amend (add new skills)
   [2] Replace (start fresh)
   [3] View current configuration
   ```
   Wait for user response before proceeding.
3. If not exists: proceed with fresh creation
</step>

<step name="discover_available_skills">
1. Scan for available skills:
   ```bash
   ls ~/.claude/commands/ 2>/dev/null | head -20
   ```

2. Present categorized list to user:
   ```
   Available skills in your environment:

   Commands:
   - /revops-expert
   - /frontend-design
   - /site-launcher-wp
   - /content-manager
   [... etc]

   Which skills apply to this project?
   (Enter comma-separated names, or "none" to skip)

   Example: revops-expert, frontend-design
   ```

3. Wait for user response. Store as `selected_skills`.
4. If "none" or empty: skip to end with minimal SPECIAL-FLOWS.md
</step>

<step name="map_skills_to_work_types">
For each selected skill, gather mapping:

```
Configuring: /{{skill_name}}

1. What type of work triggers this skill?
   (Example: "Persuasion copy", "UI components", "Database changes")

   Work type:
```
Wait for response. Store as `work_type`.

```
2. Is this skill required or optional?
   - required: Gap logged if not used
   - optional: Informational only

   [1] Required (Recommended)
   [2] Optional
```
Wait for response. Store as `priority`.

```
3. When should this skill be invoked?
   (Example: "Before writing headlines", "When creating HTML")

   Trigger:
```
Wait for response. Store as `trigger`.

Repeat for each selected skill.
</step>

<step name="check_phase_overrides">
```
Do any phases need additional skills beyond the defaults?
(Example: Phase 3 might need a specific framework skill)

[1] Yes, configure phase overrides
[2] No, defaults are sufficient
```

**If "1" or "yes":**
```
Phase number (e.g., 3):
```
Wait for response.

```
Additional skill for this phase:
```
Wait for response.

```
Why is this needed for this phase?
```
Wait for response.

Repeat or ask "Add another phase override? [y/n]"
</step>

<step name="identify_templates_assets">
```
Do you have reference templates or assets for this project?
(HTML templates, external docs, reference materials)

[1] Yes, add templates/assets
[2] No, skip this section
```

**If "1" or "yes":**
```
Asset type (e.g., "Hero template", "API docs"):
```
Wait for response.

```
Location (file path or URL):
```
Wait for response.

```
When is this used?
```
Wait for response.

Repeat or ask "Add another asset? [y/n]"
</step>

<step name="generate_output">
1. Create .paul/SPECIAL-FLOWS.md using template:
   - Replace all {{placeholders}} with gathered data
   - Populate tables with skill mappings
   - Set timestamp to current date/time

2. Update PROJECT.md with quick reference section:
   ```markdown
   ## Specialized Flows

   See: .paul/SPECIAL-FLOWS.md

   Quick Reference:
   - /skill1 → Work type 1
   - /skill2 → Work type 2
   ```

3. Display confirmation:
   ```
   ════════════════════════════════════════
   SPECIAL-FLOWS CONFIGURED
   ════════════════════════════════════════

   Created: .paul/SPECIAL-FLOWS.md

   Skills configured:
   - /skill1 (required) → Work type 1
   - /skill2 (optional) → Work type 2

   Phase overrides: [N configured / None]
   Templates/assets: [N configured / None]

   ────────────────────────────────────────
   Verification will occur during UNIFY.
   Run /paul:flows audit to check current phase.
   ────────────────────────────────────────
   ```
</step>

</process>

<subcommand name="add">
Quick add a single skill without full configuration:

1. Ask for skill name
2. Ask for work type
3. Ask for priority (required/optional)
4. Ask for trigger
5. Append to existing SPECIAL-FLOWS.md table
6. Confirm addition
</subcommand>

<subcommand name="audit">
Check current phase against declared flows:

1. Read .paul/SPECIAL-FLOWS.md
2. Read .paul/STATE.md for current phase
3. Check ROADMAP.md for phase skill requirements
4. Display:
   ```
   SKILL AUDIT - Phase {{N}}

   Required for this phase:
   - /skill1 (project-level)
   - /skill2 (phase override)

   Check invocations before UNIFY.
   ```
</subcommand>

<subcommand name="list">
Display current configuration:

1. Read .paul/SPECIAL-FLOWS.md
2. Display formatted summary:
   ```
   SPECIAL-FLOWS CONFIGURATION

   Project-Level Skills:
   - /skill1 (required) → Work type 1
   - /skill2 (optional) → Work type 2

   Phase Overrides:
   - Phase 3: /skill3

   Templates/Assets: 2 configured
   ```
</subcommand>

<output>
- `.paul/SPECIAL-FLOWS.md` created or updated
- `.paul/PROJECT.md` updated with quick reference
- User informed of configuration
</output>

<error_handling>
**No .claude/commands/ directory:**
```
No skills directory found at ~/.claude/commands/
Add skills to your Claude Code configuration first.

You can still manually specify skill names.
Enter skill names (comma-separated) or "skip":
```

**Existing SPECIAL-FLOWS.md and user chooses amend:**
- Read existing configuration
- Preserve existing entries
- Add new entries from this session
- Update timestamp

**No .paul/ directory:**
```
PAUL not initialized in this project.
Run /paul:init first, or create .paul/ manually.
```

**User provides invalid skill name:**
- Warn but proceed (skill may exist elsewhere)
- Note: "Skill not found in ~/.claude/commands/ but adding anyway"
</error_handling>
