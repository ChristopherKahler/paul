<research_quality_control>

<purpose>
Quality assurance patterns for research subagents. When PAUL deploys subagents for research or discovery, this reference ensures findings are accurate, well-sourced, and actionable.

**Core principle:** Research quality is measured by accuracy and source verification, not speed or volume.

**When used:** Referenced by research workflows when spawning subagents for documentation lookups, web searches, or codebase exploration.
</purpose>

<quality_patterns>

<pattern name="explicit_enumeration">
**DO:** Enumerate all known possibilities before investigating.

**Why:** Prevents gaps in coverage and ensures systematic research.

**Example:**
```xml
<verification_checklist>
Before investigating "configuration options":
□ User/global scope configuration
□ Project scope configuration
□ Local scope overrides
□ Environment variables
□ CLI flags
□ Check for additional unlisted options
</verification_checklist>
```
</pattern>

<pattern name="source_verification">
**DO:** Verify every claim with authoritative sources.

**Why:** Prevents outdated or incorrect information from entering the project.

**Requirements for each claim:**
- Official documentation URL
- Publication/update date verified
- Version relevance confirmed
- Cross-referenced with at least one other source for critical claims
</pattern>

<pattern name="confidence_levels">
**DO:** Assign confidence levels to findings.

**Why:** Distinguishes verified facts from educated guesses.

| Level | Meaning | Evidence Required |
|-------|---------|-------------------|
| HIGH | Verified fact | Official docs + tested |
| MEDIUM | Likely accurate | Official docs OR multiple sources |
| LOW | Uncertain | Single source OR inference |
| UNKNOWN | Cannot determine | No reliable source found |
</pattern>

<pattern name="scope_awareness">
**DO:** Check all configuration scopes explicitly.

**Why:** Prevents false negatives from incomplete investigation.

For any "where is X configured?" research:
- [ ] System/global scope
- [ ] User scope
- [ ] Project scope
- [ ] Workspace scope
- [ ] Environment scope
- [ ] Runtime flags
</pattern>

<pattern name="currency_verification">
**DO:** Check publication dates and version numbers.

**Why:** Outdated documentation causes incorrect conclusions.

Before trusting any source:
- [ ] Publication date within last 12 months (prefer current)
- [ ] Version number matches current version
- [ ] Changelog checked for recent updates
- [ ] Not marked deprecated or archived
</pattern>

</quality_patterns>

<anti_patterns>

<anti_pattern name="assumed_completeness">
**DON'T:** Assume search results are complete.

**Problem:** First Google result may be outdated or incomplete.

**Instead:** Try multiple search queries, check official docs first, verify publication dates.
</anti_pattern>

<anti_pattern name="negative_claims_without_evidence">
**DON'T:** Make "X is not possible" statements without explicit verification.

**Problem:** Absence of evidence is not evidence of absence.

**Instead:** For any "not possible" claim:
- [ ] Official documentation explicitly states it?
- [ ] Recent updates checked?
- [ ] All possible mechanisms verified?
- [ ] Distinguishing "I didn't find it" from "it doesn't exist"?
</anti_pattern>

<anti_pattern name="vague_sources">
**DON'T:** Say "according to documentation" without specific URL.

**Problem:** Claims cannot be verified or updated.

**Instead:** Always provide exact URL: "According to https://docs.example.com/config#scopes..."
</anti_pattern>

<anti_pattern name="tool_conflation">
**DON'T:** Assume capabilities are the same across tools/environments.

**Problem:** "Claude Desktop supports X" ≠ "Claude Code supports X"

**Instead:** Document which environment supports which features explicitly.
</anti_pattern>

<anti_pattern name="single_source_reliance">
**DON'T:** Rely on a single source for critical claims.

**Problem:** Stack Overflow answer from 2021 may not reflect current best practices.

**Instead:** Cross-reference official docs, release notes, and at least one other authoritative source.
</anti_pattern>

<anti_pattern name="search_vagueness">
**DON'T:** Give vague research instructions like "search for documentation."

**Problem:** Finds outdated community blogs instead of official docs.

**Instead:** Specify exact sources:
```xml
<sources>
Official sources (use WebFetch):
- https://exact-url-to-official-docs
- https://exact-url-to-api-reference

Search queries (use WebSearch):
- "specific search query 2026"
- "another specific query site:official-domain.com"
</sources>
```
</anti_pattern>

</anti_patterns>

<verification_checklists>

<checklist name="pre_submission">
Before submitting research findings:

- [ ] All enumerated items investigated (not just some)
- [ ] Negative claims verified with official docs
- [ ] Multiple sources cross-referenced for critical claims
- [ ] URLs provided for all official documentation
- [ ] Publication dates checked (prefer recent/current)
- [ ] Tool/environment-specific variations documented
- [ ] Confidence levels assigned honestly
- [ ] Assumptions distinguished from verified facts
- [ ] "What might I have missed?" review completed
</checklist>

<checklist name="critical_claims">
For any "X is not possible" or "Y is the only way" statement:

- [ ] Is this verified by official documentation stating it explicitly?
- [ ] Have I checked for recent updates that might change this?
- [ ] Have I verified all possible approaches/mechanisms?
- [ ] Am I confusing "I didn't find it" with "it doesn't exist"?
</checklist>

<checklist name="source_quality">
For each source consulted:

- [ ] Publication/update date verified (prefer recent/current)
- [ ] Source authority confirmed (official docs, not blogs)
- [ ] Version relevance checked (matches current version)
- [ ] Multiple search queries tried (not just one)
</checklist>

</verification_checklists>

<red_flags>

<red_flag name="perfect_success">
**Warning:** Every investigation succeeds perfectly.
**Problem:** Real research encounters dead ends, ambiguity, and unknowns.
**Action:** Expect honest reporting of limitations, contradictions, and gaps.
</red_flag>

<red_flag name="uniform_confidence">
**Warning:** All findings presented as equally certain.
**Problem:** Can't distinguish verified facts from educated guesses.
**Action:** Require confidence levels (High/Medium/Low) for key findings.
</red_flag>

<red_flag name="missing_urls">
**Warning:** "According to documentation..." without specific URL.
**Problem:** Can't verify claims or check for updates.
**Action:** Require actual URLs for all official documentation claims.
</red_flag>

<red_flag name="unsupported_absolutes">
**Warning:** "X cannot do Y" or "Z is the only way" without citation.
**Problem:** Strong claims require strong evidence.
**Action:** Flag for verification against official sources.
</red_flag>

<red_flag name="incomplete_coverage">
**Warning:** Verification checklist lists 4 items, output covers 2.
**Problem:** Systematic gaps in coverage.
**Action:** Ensure all enumerated items addressed or marked "not found."
</red_flag>

</red_flags>

<quick_reference>

## Research Quality Checklist

**Before starting:**
- [ ] Enumerate all items to investigate
- [ ] Identify official documentation sources
- [ ] Set clear success criteria

**During research:**
- [ ] Use official sources first
- [ ] Check publication dates
- [ ] Cross-reference critical claims
- [ ] Document URLs for every claim

**Before submitting:**
- [ ] All items addressed (or marked not found)
- [ ] Confidence levels assigned
- [ ] Assumptions clearly labeled
- [ ] "What did I miss?" self-review

**Living document:** Update after research gaps are discovered.

</quick_reference>

</research_quality_control>
