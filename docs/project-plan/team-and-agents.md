# Team And Agents

## Operating Model

The project should use one main owner plus six focused subagents.

The main owner is responsible for product direction, technical decisions, task splitting, final review, and integration. Subagents should receive concrete tasks with clear output requirements. They can inspect files, run builds, run tests, start local services, and produce implementation or research output when instructed, but they are not a replacement for project ownership.

## Recommended Subagents

| Subagent | Primary Responsibility | Typical Outputs |
| --- | --- | --- |
| Planning + Gameplay Programmer | Core loop, interaction design, pet state machine, content data | Feature specs, event tables, state charts, balance notes, simple scripts |
| Desktop Client Engineer | Transparent desktop window, drag/drop, tray, renderer, packaging | Client architecture, platform adapters, runtime code, build scripts |
| Local AI Engineer | Local LLM integration, prompt/persona system, model packaging | Inference service, model selection, memory/performance budget, fallback modes |
| Art Pipeline Lead | Pixel character specs, animation lists, import pipeline, generated asset QA | Sprite specs, art bible, ComfyUI workflow, asset validation |
| Build + Release Engineer | Steamworks, installer, save data, crash logs, update/release flow | Release checklist, store build, CI, packaging and smoke tests |
| QA Tester | Milestone verification, regression checks, owner-facing QA reports | QA pass/fail report, bug list, reproduction steps, milestone acceptance recommendation |

## Command Path

All subagent instructions should go through the main owner. This keeps the product coherent and prevents duplicate or conflicting work.

Subagents can run processes when the task requires it, such as:

- Starting the app locally for verification.
- Running tests and builds.
- Running asset conversion scripts.
- Running local inference benchmarks.
- Inspecting Steam packaging outputs.

Long-running autonomous work should be avoided unless the task has clear stop conditions and a review checkpoint.

## QA Gate

Every milestone must pass QA Tester review before owner acceptance.

Flow:

1. Owner marks implementation ready for QA.
2. QA Tester runs the relevant checklist from `milestone-qa-checklists.md`.
3. QA Tester reports:
   - Passed checks.
   - Failed checks.
   - Reproduction steps.
   - Severity: blocker, major, or minor.
   - Recommendation: accept, accept with tracked issues, or reject.
4. Owner reviews the QA Tester report and performs final acceptance.

The QA Tester can run processes such as typecheck, build, dev launch, smoke checks, and log inspection. Visual or hardware-dependent checks, such as mixed-resolution multi-monitor movement, should be marked as requiring owner confirmation when the subagent cannot directly observe them.

## Initial Staffing Priority

For the first six weeks, the highest leverage setup is:

1. Main owner.
2. One planning/gameplay hybrid.
3. One desktop client engineer.
4. One art pipeline lead.
5. One QA tester.

The local AI and release roles can start as part-time subagent responsibilities until the core desktop pet loop is stable.
