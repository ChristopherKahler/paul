<subagent_criteria>

## Purpose

Define strategic criteria for when subagents are appropriate. Subagents are a tool, not a default. Use them deliberately when criteria are met, not reflexively to "save context."

**Key principle:** Strategic criteria, not default behavior.

## When Subagents Are Appropriate

Subagents are APPROPRIATE when **ALL** of the following are true:

### 1. Task Independence
Work is self-contained and doesn't require iterative human feedback during execution.

```
GOOD for subagent:
- "Create User model with these exact fields"
- "Write unit tests for existing calculateTotal function"

BAD for subagent:
- "Design the UI for dashboard" (needs feedback)
- "Figure out why tests are failing" (may need clarification)
```

### 2. Clear Scope
Inputs and outputs are well-defined with low ambiguity.

```
GOOD for subagent:
- Input: PLAN.md with specific tasks
- Output: Code files, test results

BAD for subagent:
- "Make the API better" (ambiguous)
- "Optimize performance" (unclear targets)
```

### 3. Parallel Value
Multiple independent tasks can run simultaneously, providing actual time savings.

```
GOOD for subagent:
- Plan 01-01 (User model) and Plan 01-02 (Product model) - independent
- Three test suites for different modules

BAD for subagent:
- Single sequential task (no parallelization benefit)
- Tasks with shared state or outputs
```

### 4. Complexity Sweet Spot
Not too complex (risk of drift), not too granular (overhead not worth it).

```
GOOD complexity:
- 2-3 well-defined tasks
- 15-60 minutes of work
- Clear verification criteria

TOO complex:
- Multi-phase architectural work
- Requires judgment calls on ambiguous requirements

TOO simple:
- "Add one import statement"
- "Fix typo in comment"
```

### 5. Token Efficiency
Subagent cost < in-session cost for equivalent work.

Consider:
- Subagent startup overhead (~2-3k tokens)
- Full context re-establishment
- Result serialization back to main session

### 6. State Compatibility
Current workflow state supports async completion.

```
GOOD state:
- APPLY phase with autonomous plan
- No pending decisions or blockers

BAD state:
- Mid-checkpoint, waiting for human input
- Iterative refinement cycle with user
```

## When Subagents Are NOT Appropriate

**Do NOT use subagents when:**

- **Task requires iterative refinement** - Human feedback needed during execution
- **Output quality depends on nuanced context** - Only available in main session
- **Task is too simple** - Overhead exceeds value (< 5 min work)
- **Task is too complex** - Risk of drift, hard to verify (> 60 min work)
- **Tight coupling to other work** - Dependencies on in-progress tasks
- **Uncertain requirements** - Need to clarify before execution

## Decision Framework

```
┌─────────────────────────────────────────┐
│ Is task self-contained and well-defined?│
└─────────────────┬───────────────────────┘
                  │
         ┌────────▼────────┐
         │     NO          │──► Work in main session
         └─────────────────┘
                  │
                 YES
                  │
         ┌────────▼────────┐
         │ Multiple tasks  │
         │ that can run    │──► NO ──► Work in main session
         │ in parallel?    │          (no parallelization benefit)
         └─────────────────┘
                  │
                 YES
                  │
         ┌────────▼────────┐
         │ Complexity in   │
         │ sweet spot?     │──► NO ──► Split or simplify first
         │ (15-60 min)     │
         └─────────────────┘
                  │
                 YES
                  │
         ┌────────▼────────┐
         │ SUBAGENT        │
         │ APPROPRIATE     │
         └─────────────────┘
```

## Subagent Usage Pattern

When using subagents:

1. **Document decision** - Why subagent was chosen
2. **Define clear handoff** - PLAN.md with full context
3. **Specify verification** - How to validate subagent output
4. **Plan integration** - How results merge back to main session

## Anti-Patterns

**Subagent by default:**
```
# BAD
"Let me spawn a subagent to handle this small task"
(Task is 5 minutes, overhead exceeds value)
```

**Subagent for uncertain work:**
```
# BAD
"I'll have a subagent figure out the best approach"
(Requires judgment that needs human input)
```

**Subagent chain:**
```
# BAD
Subagent A → Subagent B → Subagent C
(Serial subagents have no parallel benefit, just overhead)
```

## Prefer In-Session When Uncertain

When criteria are borderline, prefer working in the main session:
- Lower overhead
- Better context continuity
- Easier course correction
- Direct human interaction available

**Subagents are for parallelization of well-defined work, not context offloading.**

</subagent_criteria>
