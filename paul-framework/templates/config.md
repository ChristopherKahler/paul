# Project Config Template

Template for `.paul/config.md` - project-specific configuration and integrations.

**Purpose:** Store project settings and optional integration flags. Allows PAUL to adapt behavior based on available tools.

---

## File Template

```markdown
# Project Config

**Project:** [project-name]
**Created:** [YYYY-MM-DD]

## Project Settings

```yaml
project:
  name: [project-name]
  version: [current-version or "0.0.0"]
```

## Integrations

Optional integrations that enhance PAUL functionality.

### SonarQube

Code quality scanning and static analysis.

```yaml
sonarqube:
  enabled: false
  project_key: [project-key]  # Must match sonar-project.properties
  server_url: http://localhost:9000  # Optional, for reference
```

**When enabled:**
- `/paul:quality-gate` runs scans and updates CONCERNS.md
- Quality metrics inform planning decisions
- Issues feed into tech debt tracking

**Requirements:**
- SonarQube server running (local or cloud)
- `sonar-project.properties` in project root
- SonarQube MCP server configured

### Enterprise Plan Audit

Architectural review gate between PLAN and APPLY phases.

```yaml
enterprise_plan_audit:
  enabled: false
```

**When enabled:**
- `/paul:plan` suggests running `/paul:audit` before APPLY
- `/paul:audit` performs enterprise-grade architectural review
- Must-have and strongly-recommended findings auto-applied to plan
- Audit report saved alongside PLAN.md as `{NN}-{PP}-AUDIT.md`

**Requirements:**
- No external dependencies (runs within Claude Code session)
- Best suited for commercial, regulated, or enterprise-grade projects

### Future Integrations

Reserved for future use:

```yaml
# linting:
#   enabled: false
#   config_file: .eslintrc

# testing:
#   enabled: false
#   coverage_threshold: 80
```

## Preferences

Optional user preferences for PAUL behavior.

```yaml
preferences:
  auto_commit: false          # Auto-commit after successful tasks
  verbose_output: false       # Show detailed step output
  parallel_agents: false      # Allow parallel agent spawning (advanced)
```

---

*Config created: [timestamp]*
*Edit anytime - changes take effect on next command*
```

---

## Good Example

```markdown
# Project Config

**Project:** expense-tracker
**Created:** 2026-01-28

## Project Settings

```yaml
project:
  name: expense-tracker
  version: 0.2.0
```

## Integrations

### SonarQube

```yaml
sonarqube:
  enabled: true
  project_key: expense-tracker
  server_url: http://localhost:9000
```

### Enterprise Plan Audit

```yaml
enterprise_plan_audit:
  enabled: false
```

### Future Integrations

```yaml
# linting:
#   enabled: false
```

## Preferences

```yaml
preferences:
  auto_commit: false
  verbose_output: false
  parallel_agents: false
```

---

*Config created: 2026-01-28*
```

---

## Guidelines

**What belongs in config.md:**
- Project identification (name, version)
- Integration toggles (enabled/disabled flags)
- Integration-specific settings (project keys, URLs)
- User preferences for PAUL behavior

**What does NOT belong here:**
- Sensitive credentials (use environment variables)
- Build configuration (use native config files)
- Project requirements (that's PROJECT.md)
- Roadmap information (that's ROADMAP.md)

**When to create config.md:**
- During `/paul:init` if user enables integrations
- Manually when adding integrations later
- Not required for basic PAUL usage

**Git behavior:**
- Can be committed (no secrets)
- Or gitignored if preferences are personal
- Recommend: commit integration flags, gitignore preferences
