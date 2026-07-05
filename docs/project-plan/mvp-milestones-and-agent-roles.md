# MVP Milestones And Agent Roles

## Scope

This milestone plan covers the Project Seal MVP: a bilingual, Windows-first, offline Steam desktop pet centered on a cute white baby seal and priced around USD 1.

## Agent Roles

| Role | Short Name | Core Responsibility |
| --- | --- | --- |
| Main Owner | Owner | Product direction, task split, integration, review, final decisions |
| Planning + Gameplay Programmer | Planning | Core loop, interactions, state machine, content data |
| Desktop Client Engineer | Client | Electron shell, transparent window, renderer, app runtime |
| Local AI Engineer | AI | Local chat bridge, persona prompts, model fallback, performance guardrails |
| Art Pipeline Lead | Art | White seal art direction, sprite specs, import/generation pipeline |
| Build + Release Engineer | Release | Packaging, smoke tests, Steam readiness, logs, release checklist |
| QA Tester | QA | Milestone QA, regression checks, bug reproduction, owner-facing pass/fail report |

## Milestone Overview

| Milestone | Target | Exit Criteria |
| --- | --- | --- |
| M0: Product Lock | Day 0-1 | Product inputs, repo setup, toolchain, and MVP boundaries are locked |
| M1: Desktop Shell Prototype | Week 1 | A transparent always-on-top pet window can launch, move, hide, and exit |
| M2: Pet Runtime | Week 2 | Seal can idle, move, react, and persist basic state |
| M3: Character Pack + Seal Art Pass | Week 3 | Default seal pack format works and first art pack can be swapped without code changes |
| M4: Photo-To-Pixel Customization | Week 4 | User can import an image, generate a template-based pixel character, preview it, and save it as a custom character |
| M5: AI + Scene Interaction | Week 5 | Basic offline chat and 2-3 scene props are connected to pet reactions |
| M6: Steam Candidate | Week 6 | Packaged Windows build passes smoke tests and has first store/demo material |

## M0: Product Lock

Goal: Make sure everyone builds the same product.

| Role | Responsibilities |
| --- | --- |
| Owner | Confirm Project Seal name, white baby seal direction, bilingual scope, USD 1 target, and MVP cut line |
| Planning | Convert product direction into a concise feature priority list and define the initial state machine |
| Client | Confirm Electron + PixiJS + TypeScript project structure and dev scripts |
| AI | Define the local AI MVP as optional/fallback-safe, not a blocker for core desktop pet behavior |
| Art | Define white baby seal silhouette rules, first palette constraints, and reference needs |
| Release | Confirm local toolchain, Git repository, package scripts, and Windows-first release assumptions |
| QA | Verify M0 documents, toolchain checks, typecheck, Git state, and missing non-blocking inputs |

Exit checklist:

- Product inputs are documented.
- Typecheck passes.
- Git repo exists.
- MVP cuts are explicit.

## M1: Desktop Shell Prototype

Goal: Make the pet exist on the Windows desktop.

| Role | Responsibilities |
| --- | --- |
| Owner | Review first desktop prototype and decide interaction defaults |
| Planning | Define first interaction rules: drag, poke, idle timeout, hide/show, lock mode |
| Client | Implement transparent frameless window, always-on-top, tray menu, show/hide/exit, drag mode, renderer canvas |
| AI | No implementation required; provide placeholder chat entry requirements if needed |
| Art | Provide temporary seal placeholder sprite or simple shape guide; confirm readable size |
| Release | Add smoke test checklist for launch, tray exit, multi-monitor, DPI, and two-hour idle later |
| QA | Run M1 QA checklist, verify launch/build, check tray show/hide/exit, and record any visual checks needing owner confirmation |

Exit checklist:

- App launches from `npm run dev`.
- Window is transparent and always-on-top.
- Pet can be moved or positioned.
- Tray can hide/show/exit.
- First short recording is possible.

## M2: Pet Runtime

Goal: Make the seal feel alive.

| Role | Responsibilities |
| --- | --- |
| Owner | Verify behavior feels cute and non-annoying |
| Planning | Specify finite state machine, priority order, mood/energy/affection/hunger values, and event effects |
| Client | Implement state machine, animation player, timers, pointer reactions, position save, low-FPS idle mode |
| AI | Define how `Talking` state will interrupt or queue with other pet states |
| Art | Provide or specify placeholder frames for idle, walk, sleep, happy, annoyed, dragged, poke |
| Release | Add runtime logging for state transitions and crash/debug collection basics |
| QA | Run M2 QA checklist, verify state transitions, click/drag behavior, persistence, build health, and flag multi-monitor checks for owner confirmation if needed |

Exit checklist:

- Idle, walk, sleep, dragged, happy, annoyed, and poke states work.
- State transitions do not get stuck.
- Pet position and basic values persist across restart.
- Idle performance is acceptable for a prototype.

## M3: Character Pack + Seal Art Pass

Goal: Make the default seal and future character swaps data-driven.

| Role | Responsibilities |
| --- | --- |
| Owner | Approve first white baby seal direction and define emergency art cut if final art is late |
| Planning | Define character metadata fields, fallback behavior for missing animations, and unlock assumptions |
| Client | Implement manifest loading, sprite sheet metadata, animation fallback, character selection stub |
| AI | Attach personality metadata to character pack and define bilingual persona fields |
| Art | Deliver white baby seal art spec, first sprite pass, palette, frame dimensions, and animation naming |
| Release | Validate asset folder structure, missing file behavior, and package inclusion rules |
| QA | Run M3 QA checklist, test manifest loading/fallback, verify no crash on missing assets, and inspect seal readability against backgrounds |

Exit checklist:

- Default seal is loaded from a manifest.
- Adding/replacing a character pack does not require code changes.
- Missing animations fall back gracefully.
- Seal reads clearly on light and dark desktops.

## M4: Photo-To-Pixel Customization

Goal: Prove the customization hook with a deterministic pixel template generator before overbuilding AI generation.

| Role | Responsibilities |
| --- | --- |
| Owner | Keep the promise framed as template-based pixel character generation, not exact likeness |
| Planning | Define the user flow: import, generate from template, preview, save, select |
| Client | Implement image import, local feature/palette sampling, built-in template generation, preview, and custom character save |
| AI | Evaluate whether any local model is needed; keep non-AI template path as the default |
| Art | Provide pixel character templates, palette rules, outline rules, and QA criteria for generated output; treat the seal as default placeholder art only |
| Release | Check local-only privacy wording and make sure imported assets save in user data, not app install files |
| QA | Run M4 QA checklist with test images, verify import/crop/pixelize/save/select, and test invalid image handling |

Exit checklist:

- User can import a test image.
- User can preview a generated template pixel character.
- Result can be saved and selected.
- Bad images fail gracefully with manual adjustment.

## M5: AI + Scene Interaction

Goal: Add companionship and simple desktop objects without making AI the core dependency.

| Role | Responsibilities |
| --- | --- |
| Owner | Verify chat and props support the seal fantasy instead of becoming separate features |
| Planning | Define 2-3 props: bed, toy, food/snack; define effects on mood/energy/affection/hunger |
| Client | Implement prop placement/runtime, click interactions, chat bubble UI, and `Talking` state |
| AI | Implement local chat bridge or mockable adapter, bilingual persona prompt, timeout, cancel, and fallback replies |
| Art | Provide prop sprites and seal reaction requirements for eating, playing, sleeping, and talking |
| Release | Test offline behavior, model-missing behavior, CPU/memory impact, and log failures clearly |
| QA | Run M5 QA checklist, verify prop reactions, chat/fallback behavior, offline behavior, timeout recovery, and runtime stability |

Exit checklist:

- Bed, toy, and food/snack trigger visible seal reactions.
- Chat UI can produce a short bilingual character response or fallback.
- AI failure never breaks the pet runtime.
- Offline mode is cleanly supported.

## M6: Steam Candidate

Goal: Turn the prototype into a distributable MVP candidate.

| Role | Responsibilities |
| --- | --- |
| Owner | Final MVP acceptance review and cut any feature that threatens stability |
| Planning | Write first-run flow, settings labels, bilingual text list, and final feature checklist |
| Client | Implement settings panel, language toggle, volume/animation/always-on-top controls, and build fixes |
| AI | Freeze model strategy for MVP: bundled small model, optional local pack, or fallback-only |
| Art | Deliver app icon, first Steam visual drafts, screenshots, and short trailer capture plan |
| Release | Create Windows package, run smoke tests, verify clean install, offline launch, save migration, and Steam folder launch |
| QA | Run M6 QA checklist, verify packaged launch, offline mode, save/settings persistence, idle soak, known issues, and owner-facing release recommendation |

Exit checklist:

- Windows build launches without dev tooling.
- App works offline.
- Settings and saves persist.
- Two-hour idle test passes.
- Store screenshots/trailer capture are possible.
- Known issues and release cuts are documented.

## Cross-Milestone Rules

- Every milestone must end with a runnable build or verified document, not only discussion.
- Every milestone must receive a QA Tester report before owner acceptance.
- AI features must always have deterministic fallback behavior.
- Art scope is cut by animation count first, not by default seal quality.
- The app must always have a clear exit path from tray/menu.
- Bilingual text should go through a central text table once UI text begins to grow.
