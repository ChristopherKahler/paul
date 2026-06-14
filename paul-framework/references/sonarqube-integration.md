# SonarQube Integration

Reference for integrating SonarQube code quality scanning with PAUL.

---

## Overview

**What SonarQube provides:**
- Static code analysis (bugs, vulnerabilities, code smells)
- Quality gates (pass/fail thresholds)
- Technical debt estimation
- Code coverage tracking
- Duplicate code detection

**Why integrate with PAUL:**
- Auto-populate CONCERNS.md with real issues
- Objective quality metrics for planning
- Track improvement over time
- Catch issues before they become problems

---

## Prerequisites

### 1. SonarQube Server

You need a running SonarQube instance:

**Option A: Local Docker (recommended for development)**
```bash
docker run -d --name sonarqube -p 9000:9000 sonarqube:community
```

**Option B: SonarCloud (cloud hosted)**
- Create account at sonarcloud.io
- Use cloud URL in configuration

### 2. Project Configuration

Create `sonar-project.properties` in project root:

```properties
sonar.projectKey=my-project
sonar.projectName=My Project
sonar.sources=src
sonar.exclusions=**/node_modules/**,**/dist/**
```

### 3. SonarQube MCP Server

Ensure sonarqube MCP is configured in Claude Code:

```json
{
  "mcpServers": {
    "sonarqube": {
      "command": "node",
      "args": ["/path/to/sonarqube-mcp/index.js"]
    }
  }
}
```

---

## Setup Steps

### Step 1: Enable in PAUL Config

Edit `.paul/config.md`:

```yaml
sonarqube:
  enabled: true
  project_key: my-project  # Must match sonar-project.properties
```

### Step 2: Create Project in SonarQube

Use the MCP tool or SonarQube UI:

```
mcp__sonarqube__sonar_create_project
  project_key: "my-project"
  name: "My Project"
  project_path: "/path/to/project"
```

This also creates `sonar-project.properties` if missing.

### Step 3: Run Initial Scan

```
mcp__sonarqube__sonar_scan
  project_path: "/path/to/project"
```

Or use PAUL workflow:
```
/paul:quality-gate
```

### Step 4: Verify Integration

Check that scan completed:
```
mcp__sonarqube__sonar_get_metrics
  project: "my-project"
```

---

## Usage Patterns

### Manual Scan via Workflow

Run quality checks anytime:
```
/paul:quality-gate
```

This will:
1. Verify SonarQube is enabled
2. Run scan
3. Check quality gate status
4. Fetch issues
5. Update CONCERNS.md

### Before Planning

Run quality gate before planning new phases:
- Identifies existing issues to address
- Provides objective baseline
- Informs scope decisions

### After Major Changes

Run after completing significant work:
- Verify no new issues introduced
- Check quality gate still passes
- Update CONCERNS.md with current state

### Reading Results

**Get metrics:**
```
mcp__sonarqube__sonar_get_metrics
  project: "my-project"
```

Returns: bugs, vulnerabilities, code smells, coverage, duplications

**Get issues:**
```
mcp__sonarqube__sonar_get_issues
  project: "my-project"
  severity: "CRITICAL"  # Optional filter
```

Returns: file, line, message, severity for each issue

---

## Integration with PAUL

### CONCERNS.md Auto-Population

The quality-gate workflow updates `.paul/codebase/CONCERNS.md`:

```markdown
## SonarQube Analysis

**Last Scan:** 2026-01-28
**Quality Gate:** PASSED

### Issues by Severity

| Severity | Count | Examples |
|----------|-------|----------|
| CRITICAL | 0 | - |
| MAJOR | 3 | SQL injection in `src/db.ts`, ... |
| MINOR | 12 | ... |

### Metrics

- Bugs: 2
- Vulnerabilities: 1
- Code Smells: 15
- Coverage: 72%
- Duplications: 3.2%
```

### Quality Gates as Planning Input

When planning, reference CONCERNS.md:
- Address CRITICAL issues before new features
- Factor MAJOR issues into phase scope
- Track code smell reduction over time

### Tracking Improvement

Compare scans over time:
- Note issue count changes in SUMMARY.md
- Celebrate quality improvements
- Identify recurring problem areas

---

## Troubleshooting

### "SonarQube not enabled"

Check `.paul/config.md` has:
```yaml
sonarqube:
  enabled: true
```

### "Project not found"

Ensure project_key matches between:
- `.paul/config.md`
- `sonar-project.properties`
- SonarQube server

### "Scan failed"

Common causes:
- SonarQube server not running
- sonar-project.properties missing
- Invalid source path in properties

Check with:
```bash
curl http://localhost:9000/api/system/status
```

### "MCP tools not available"

Verify sonarqube MCP server is:
- Configured in Claude Code settings
- Running without errors
- Has correct authentication token
