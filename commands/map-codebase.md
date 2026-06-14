<objective>
Analyze existing codebase and create structured documentation in .paul/codebase/

Spawns parallel Explore agents to analyze technology stack, architecture, conventions, testing patterns, external integrations, and areas of concern.
</objective>

<execution_context>
@src/workflows/map-codebase.md
</execution_context>

<process>
**Follow workflow:** @src/workflows/map-codebase.md

The workflow implements:
1. Check if .paul/codebase/ exists (offer refresh/update/skip)
2. Create directory structure
3. Spawn 4 parallel Explore agents:
   - Agent 1: Stack + Integrations (Technology Focus)
   - Agent 2: Architecture + Structure (Organization Focus)
   - Agent 3: Conventions + Testing (Quality Focus)
   - Agent 4: Concerns (Issues Focus)
4. Collect and aggregate agent findings
5. Write 7 codebase documents from templates
6. Verify and commit
7. Offer next steps
</process>

<success_criteria>
- [ ] .paul/codebase/ directory created
- [ ] All 7 documents populated with findings
- [ ] Documents include actual file paths (actionable)
- [ ] Codebase map committed
- [ ] User informed of next steps
</success_criteria>
