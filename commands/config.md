<objective>
Manage PAUL project configuration and integrations. Create or update .paul/config.md at any point in the project lifecycle.
</objective>

<when_to_use>
- Enable SonarQube after project init
- Disable an integration
- View current configuration
- Change project settings
</when_to_use>

<process>

**Step 1: Check for existing config**

```bash
ls .paul/config.md 2>/dev/null
```

**If config exists:**
```
Current configuration:

[Display config.md contents]

What would you like to do?
[1] Enable/disable integration
[2] View full config
[3] Reset to defaults
```

**If config doesn't exist:**
```
No configuration found.

Would you like to set up project configuration?
[1] Yes, create config
[2] Cancel
```

**Step 2: Handle user choice**

**For new config or "Enable/disable integration":**

```
Available integrations:

[1] SonarQube - Code quality scanning
    Status: [enabled/disabled/not configured]
[2] Enterprise Plan Audit - Architectural review gate
    Status: [enabled/disabled/not configured]

[3] Done - save and exit
```

**If user selects SonarQube:**

```
SonarQube integration:

Current: [enabled/disabled/not configured]

[1] Enable
[2] Disable
[3] Back
```

**If enabling:**
- Prompt for project_key (default: directory name)
- Create/update config.md with sonarqube.enabled = true

**If disabling:**
- Update config.md with sonarqube.enabled = false

**If user selects Enterprise Plan Audit:**

```
Enterprise Plan Audit:

Current: [enabled/disabled/not configured]

[1] Enable
[2] Disable
[3] Back
```

**If enabling:**
- Create/update config.md with enterprise_plan_audit.enabled = true
- Inform: "After /paul:plan, you'll be prompted to run /paul:audit before APPLY."

**If disabling:**
- Update config.md with enterprise_plan_audit.enabled = false
- Inform: "Plans will go directly from PLAN to APPLY without audit suggestion."

**Step 3: Write config**

Create or update `.paul/config.md`:

```markdown
# Project Config

**Project:** [project_name]
**Updated:** [timestamp]

## Project Settings

```yaml
project:
  name: [project_name]
  version: [version or "0.0.0"]
```

## Integrations

### SonarQube

```yaml
sonarqube:
  enabled: [true/false]
  project_key: [key]
```

### Enterprise Plan Audit

```yaml
enterprise_plan_audit:
  enabled: [true/false]
```

## Preferences

```yaml
preferences:
  auto_commit: false
  verbose_output: false
```

---
*Config updated: [timestamp]*
```

**Step 4: Confirm**

```
════════════════════════════════════════
CONFIG UPDATED
════════════════════════════════════════

Integrations:
  SonarQube: [enabled/disabled]
  Enterprise Plan Audit: [enabled/disabled]

Config saved to: .paul/config.md

────────────────────────────────────────
[If SonarQube just enabled:]
▶ NEXT: /paul:quality-gate
  Run your first code quality scan.

[If Enterprise Plan Audit just enabled:]
▶ Enterprise audit will run between PLAN and APPLY.
  After /paul:plan, you'll be prompted to run /paul:audit.

[Otherwise:]
Configuration complete.
────────────────────────────────────────
```

</process>

<output>
- `.paul/config.md` created or updated
- Integration status changed as requested
- Clear next steps if applicable
</output>
