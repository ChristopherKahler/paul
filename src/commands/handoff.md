---
name: paul:handoff
description: Generate comprehensive session handoff document
argument-hint: "[context notes]"
allowed-tools: [Read, Write, Bash]
---

<objective>
Generate a comprehensive handoff document synthesizing session activity, decisions, gaps, and next actions.

**When to use:** End of session, context break, or when decisions need documentation.

**Smart context:** Uses conversation context for decisions/gaps. Optional argument for additional notes.
</objective>

<execution_context>
@.paul/STATE.md
</execution_context>

<context>
Optional notes: $ARGUMENTS (decisions, gaps, thoughts inline)

Session context is primary source - extract:
- What was accomplished (file changes, plans executed)
- Decisions made (explicit or implicit in conversation)
- Questions asked and answered
- Gaps identified
- User's stated intentions
</context>

<process>

<step name="gather_session_context" priority="first">
**From STATE.md:**
- Current phase and plan
- Loop position
- Last activity
- Session continuity notes

**From conversation context:**
- Files created/modified this session
- Commands executed
- Decisions discussed (look for "I want", "let's do", "decision:", user preferences)
- Questions raised (look for "?", "should we", "what about")
- Gaps identified (look for "missing", "need", "gap", "TODO")
- User's stated approach/thoughts

**From optional $ARGUMENTS:**
- Additional context user provided inline
- Override or supplement detected context
</step>

<step name="synthesize">
Combine Claude's observations with user input:

1. **Session Accomplishments:**
   - What was built/completed
   - Plans executed
   - Files created

2. **Decisions Made:**
   - Explicit decisions from conversation
   - Implicit decisions (choices made without discussion)
   - Rationale where stated

3. **Gap Analysis:**
   - Issues identified
   - User's decision on each gap
   - Effort estimates if discussed

4. **Open Questions:**
   - Unresolved items
   - Items needing more discussion

5. **Reference Files:**
   - Files mentioned that will be needed
   - Source files for next session
</step>

<step name="generate_handoff">
Create `.paul/HANDOFF-{date}-{context}.md`:

```markdown
# PAUL Session Handoff

**Session:** {date} {start_time} - {end_time}
**Phase:** {current_phase}
**Context:** {brief description}

---

## Session Accomplishments

{bulleted list of what was done}

---

## Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| {decision} | {why} | {effect} |

---

## Gap Analysis with Decisions

### {Gap Name}
**Status:** CREATE / DEFER / INTENTIONAL
**Notes:** {user's decision and reasoning}
**Effort:** {if discussed}
**Reference:** `@{source_file}`

---

## Open Questions

{items needing resolution}

---

## Reference Files for Next Session

```
{list of @-references}
```

---

## Prioritized Next Actions

| Priority | Action | Effort |
|----------|--------|--------|
| 1 | {action} | {effort} |

---

## State Summary

**Current:** {phase, plan, loop position}
**Next:** {recommended next action}
**Resume:** `/paul:resume` then read this handoff

---

*Handoff created: {timestamp}*
```

Display confirmation:
```
════════════════════════════════════════
HANDOFF CREATED
════════════════════════════════════════

Saved: .paul/HANDOFF-{date}-{context}.md

Includes:
- {N} accomplishments
- {N} decisions documented
- {N} gaps with your decisions
- {N} prioritized next actions

Next session: /paul:resume → read handoff
════════════════════════════════════════
```
</step>

<step name="register_handoff">
**Register the handoff with `base` so it resurfaces at next session start.**

Without this, the doc sits on disk but the session-start resume list never queues it (the gap that loses handoffs). The project slug comes from `.paul/paul.toml`'s `name` field; the doc path must be absolute.

```bash
if command -v base >/dev/null 2>&1; then
  PROJECT=$(grep -m1 '^name *= *' .paul/paul.toml 2>/dev/null | sed -E 's/^name *= *"(.*)"/\1/')
  DOC="$(pwd)/.paul/HANDOFF-{date}-{context}.md"
  if [ -n "$PROJECT" ] && [ -f "$DOC" ]; then
    base handoff create --project "$PROJECT" --doc "$DOC" \
      && echo "✓ Registered with base — resurfaces at next session start" \
      || echo "Note: base handoff registration skipped (pre-handoff base version)"
  fi
fi
```

Substitute the real `{date}-{context}` from the file just written. If `base` is absent or predates the `handoff` subcommand, the step no-ops — the handoff is still on disk.
</step>

</process>

<smart_context_detection>
**Decision indicators in conversation:**
- "I want to..." / "Let's do..."
- "Decision:" / "My decision:"
- "We should..." / "Go with..."
- User providing definitive answers
- Approval signals ("yes", "approved", "do it")

**Gap indicators:**
- "Missing..." / "We need..."
- "GAP" / "TODO"
- Questions about what doesn't exist

**Thought indicators:**
- "I think..." / "My thoughts:"
- "Here's my take..."
- User explaining reasoning

**Priority indicators:**
- Numbered lists from user
- "First..." / "Most important..."
- Effort/impact discussions
</smart_context_detection>

<success_criteria>
- [ ] STATE.md read for current position
- [ ] Session context extracted (not just prompted)
- [ ] User's inline input incorporated
- [ ] Structured handoff generated
- [ ] Reference files included
- [ ] Next actions prioritized
- [ ] Handoff registered with `base` (resurfaces next session)
</success_criteria>
