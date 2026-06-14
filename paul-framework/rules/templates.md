---
paths:
  - "src/templates/**/*.md"
---

# Template Rules

Rules for editing files in `src/templates/`.

## File Structure

Templates define the structure for generated documents. Each template file contains:

1. **Header** — `# [NAME].md Template`
2. **Intro** — Brief description and file naming pattern
3. **File Template block** — The actual template in a fenced code block
4. **Field documentation** — Tables explaining frontmatter fields, sections
5. **Examples/Anti-patterns** — Good vs bad usage

## Placeholder Conventions

**Square brackets** for human-fillable placeholders:
```
[Project Name]
[Description of what this accomplishes]
[Specific implementation instructions]
```

**Curly braces** for variable interpolation:
```
{phase}-{plan}-PLAN.md
.paul/phases/{phase-number}-{name}/
```

## YAML Frontmatter in Template Content

Templates that define output documents show example frontmatter:

```yaml
---
phase: XX-name
plan: NN
plan_type: execute
wave: 1
depends_on: []
files_modified: []
autonomous: true
---
```

This is content TO BE GENERATED, not frontmatter for the template file itself.
