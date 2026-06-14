<purpose>
Execute discovery at appropriate depth to inform planning decisions. Produces DISCOVERY.md with findings, recommendation, and confidence level.

Distinct from research workflow: Research gathers information. Discovery makes technical decisions.
</purpose>

<when_to_use>
- Before planning a phase with technical unknowns
- When choosing between libraries/frameworks
- For architectural decisions
- When integrating new external services
</when_to_use>

<depth_levels>

| Level | Name | Time | Output | When |
|-------|------|------|--------|------|
| 1 | Quick | 2-5 min | Verbal confirmation | Confirming known approach |
| 2 | Standard | 15-30 min | DISCOVERY.md | Choosing between options |
| 3 | Deep | 1+ hour | Detailed DISCOVERY.md | Novel problems, high-risk |

</depth_levels>

<process>

<step name="determine_depth">
**Determine discovery depth:**

If $ARGUMENTS specifies depth (e.g., "deep auth options"):
- Use specified depth

Otherwise, infer from context:
- Single known library, just verifying → Level 1 (quick)
- Comparing 2-3 options → Level 2 (standard)
- Novel problem, architectural decision → Level 3 (deep)

Confirm with user if unclear:
```
Discovery for: [topic]
Suggested depth: [level] - [rationale]

Proceed? (yes / suggest different depth)
```
</step>

<step name="level_1_quick">
**Level 1: Quick Verification (2-5 minutes)**

For: Confirming known approach still valid.

1. Quick search for current state of library/approach
2. Verify:
   - Still actively maintained
   - API unchanged from expectations
   - No critical issues

3. **If verified:** Proceed to planning. No DISCOVERY.md needed.
4. **If concerns:** Escalate to Level 2.

Output: Verbal confirmation to proceed.
</step>

<step name="level_2_standard">
**Level 2: Standard Discovery (15-30 minutes)**

For: Choosing between options, new integration.

1. **Identify what to discover:**
   - What options exist?
   - Key comparison criteria?
   - Our specific use case?

2. **Research each option:**
   Use research subagent (Task tool with Explore or general-purpose):
   - Official documentation
   - Current version/status
   - Key features for our use case

3. **Compare options:**
   - Build comparison table
   - Note pros/cons for each
   - Identify deal-breakers

4. **Reference quality patterns:**
   @src/references/research-quality-control.md
   - Cross-verify findings
   - Check source currency
   - Assign confidence

5. **Create DISCOVERY.md:**
   Use template: @src/templates/DISCOVERY.md
   - Summary with recommendation
   - Findings per option
   - Confidence level (should be MEDIUM-HIGH)

Output: `.paul/phases/XX-name/DISCOVERY.md`
</step>

<step name="level_3_deep">
**Level 3: Deep Dive (1+ hour)**

For: Architectural decisions, novel problems.

1. **Scope the discovery:**
   - Define clear scope
   - List specific questions to answer
   - Set include/exclude boundaries

2. **Exhaustive research:**
   Use research subagents for:
   - All relevant libraries/frameworks
   - Architecture patterns
   - Best practices
   - Known limitations

3. **Deep analysis:**
   - How others solved similar problems
   - Production experiences
   - Gotchas and anti-patterns

4. **Cross-verify ALL findings:**
   - Every claim verified with authoritative source
   - Mark verified vs assumed
   - Flag contradictions

5. **Create comprehensive DISCOVERY.md:**
   - Full template structure
   - Quality report with sources
   - Confidence per finding
   - Validation checkpoints if LOW confidence

6. **Confidence gate:**
   If LOW confidence on critical finding:
   ```
   Discovery confidence is LOW: [reason]

   Options:
   1. Dig deeper (more research)
   2. Proceed anyway (accept uncertainty)
   3. Pause (need to think)
   ```

Output: Comprehensive `.paul/phases/XX-name/DISCOVERY.md`
</step>

<step name="route_to_planning">
**Complete discovery and route:**

```
════════════════════════════════════════
DISCOVERY COMPLETE
════════════════════════════════════════

Topic: [what was discovered]
Depth: Level [N]
Confidence: [HIGH/MEDIUM/LOW]

Recommendation: [one-liner]

Output: [path to DISCOVERY.md or "verbal confirmation"]

────────────────────────────────────────
▶ NEXT: /paul:plan [phase]
────────────────────────────────────────
```
</step>

</process>

<success_criteria>
**Level 1:**
- [ ] Known approach verified
- [ ] Verbal confirmation to proceed

**Level 2:**
- [ ] Options researched
- [ ] Comparison made
- [ ] DISCOVERY.md created
- [ ] Confidence MEDIUM+

**Level 3:**
- [ ] Scope defined
- [ ] Exhaustive research
- [ ] All findings cross-verified
- [ ] DISCOVERY.md created
- [ ] Confidence gate passed
</success_criteria>
