# QA Tester Process

## Purpose

The QA Tester subagent verifies each milestone before owner acceptance. The QA pass is a gate, not a replacement for owner review.

## When QA Runs

QA runs after the owner or implementation subagent says a milestone is ready.

Required order:

1. Implementation complete.
2. QA Tester review.
3. Fix blocker/major failures.
4. QA Tester recheck when needed.
5. Owner final acceptance.

## QA Tester Inputs

Each QA run should receive:

- Milestone name.
- Relevant acceptance document.
- Relevant section from `milestone-qa-checklists.md`.
- Current known limitations.
- Any checks that require owner hardware confirmation.

## QA Tester Output Format

QA Tester must report in this format:

```text
Milestone:
Build/Test Commands Run:
Environment:

Summary:
- Recommendation: Accept / Accept with tracked issues / Reject
- Blockers:
- Major Issues:
- Minor Issues:
- Owner Confirmation Required:

Checklist Results:
| Check | Result | Notes |
| --- | --- | --- |

Bugs:
1. Severity:
   Steps:
   Expected:
   Actual:
   Evidence:

Retest Needed:
```

## What QA Tester Can Automate

- `npm.cmd run typecheck`
- `npm.cmd run build`
- Launch smoke checks when possible.
- File existence checks.
- Configuration checks.
- Save file inspection when safe.
- Log/error output review.

## What QA Tester Cannot Fully Automate

- Visual cuteness judgment.
- Real multi-monitor behavior on the user's exact hardware.
- Long soak tests unless explicitly asked.
- Steam store review.
- Final commercial art quality.

These should be reported as owner confirmation required.

## Severity Rules

Blocker:

- App cannot launch.
- App cannot exit.
- Core milestone feature is missing.
- Data loss or crash.
- Unsafe desktop behavior.

Major:

- Feature works unreliably.
- Visual behavior is confusing.
- Persistence is inconsistent.
- Performance risk is visible.

Minor:

- Debug UI polish.
- Placeholder visuals.
- Copy/text issues.
- Non-final asset quality.
