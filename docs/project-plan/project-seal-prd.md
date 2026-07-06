# Project Seal PRD

## 1. Product Summary

Project Seal is a Windows-first, offline Steam desktop pet priced around USD 1. The MVP delivers a cute pixel companion that lives on the desktop, reacts to simple interactions, supports character packs, and includes a lightweight local/offline chat or fallback response layer.

The product initially centered on a white baby seal. The current production direction also supports owner-directed photo-commission characters created through a controlled Meowa art pipeline. Live in-client photo-to-pixel generation is not an MVP promise.

## 2. Product Goals

| Goal | Requirement |
| --- | --- |
| Prove desktop pet appeal | Pet is visible, cute, draggable, reactive, and non-invasive. |
| Ship a lean Steam MVP | Windows package works offline and has clear exit/settings path. |
| Support character expansion | Character packs load from manifests and can be swapped without code changes. |
| Support art-directed customization | Owner photos can become commissioned pixel character packs through Meowa and QA. |
| Avoid overpromising AI | Chat works locally or falls back cleanly when no model is installed. |

## 3. Target Users

Primary users:

- Players who like cute desktop companions and low-commitment idle software.
- Users who enjoy personalized pixel avatars and screenshot sharing.
- Steam users willing to buy a low-price novelty/companion app.

Secondary users:

- Streamers or social users who may share short desktop clips.
- Users who want local/offline behavior instead of account-based companion products.

## 4. MVP Feature Requirements

### P0 Must Have

| Feature | Requirement | Acceptance |
| --- | --- | --- |
| Desktop shell | Transparent frameless always-on-top window | Pet appears without opaque rectangle and can stay above normal windows |
| Tray control | Show, hide, exit | User can safely hide and fully exit the app |
| Drag | Pet can be moved | Drag works across normal and mixed-resolution screens without losing the pet |
| Poke | Click/poke reaction | Visible feedback occurs and state returns safely |
| State machine | Idle, walk, sleep, dragged, happy/poke, annoyed fallback | No stuck states after repeated interaction |
| Character pack loader | Manifest-driven assets with fallback | Missing optional animation does not crash app |
| Current animated character | `photo_001_travel_girl` runtime frames | Brown beanie/sunglasses/jacket/white shirt/blue jeans visible in screenshot QA |
| Default mascot direction | White baby seal remains product identity | White seal spec exists and must carry Steam page later |
| Save/settings foundation | Position and basic runtime values persist | Restart does not lose expected state |
| Offline-first | Core pet runs without network | App launches and pet remains usable offline |
| QA gate | Milestone QA and screenshot QA for art | QA report exists before owner acceptance |

### P1 Should Have

| Feature | Requirement |
| --- | --- |
| Scene props | Bed, toy, and food/snack trigger visible reactions and value changes |
| Local chat bridge | Local model adapter or deterministic fallback replies |
| Bilingual text foundation | Core UI/menu/reply text can support two languages |
| Settings panel | Always-on-top, animation, language, volume, lock mode where applicable |
| Steam package | Windows build launches outside dev tooling |
| Store capture | Real screenshots/clips can be captured from runtime |

### P2 Can Defer

| Feature | Reason To Defer |
| --- | --- |
| Dedicated annoyed/dragged art | MVP can reuse happy/idle with renderer feedback |
| Advanced photo-to-pixel editor | Previous procedural path produced poor art and is not MVP direction |
| Achievements | Not needed to prove core desktop pet loop |
| Workshop | Too much moderation/platform scope for USD 1 MVP |
| Cloud save/account | Conflicts with offline-first lean scope |
| Voice features | High cost and QA risk |
| Multi-pet runtime | More collision, performance, and interaction complexity |

## 5. Current Implementation Baseline

Completed:

- Electron + PixiJS + TypeScript desktop app.
- Transparent desktop pet runtime.
- State machine and drag/poke behavior.
- Cross-monitor drag fixes verified by owner for M2.
- Character pack format and fallback behavior.
- Product direction change from live photo generator to photo-commission character pipeline.
- Meowa skill installed and first character pack generated/animated.
- Old import/save UI removed from runtime.
- M5 animation frames implemented for idle/walk/sleep/happy.
- Screenshot QA process required for art changes.
- Git rule requires non-ignored changes to be committed and pushed.

Current active character:

- `photo_001_travel_girl`.
- Selected visual target: top-right small chibi candidate.
- Runtime status: `right_top_small_meowa_v2_animation_screenshot_qa_passed`.
- Meowa credit after last generation: 176.

## 6. Planned Milestones

| Milestone | Product Outcome | Status |
| --- | --- | --- |
| M0 Product Lock | Product boundaries, team roles, and MVP promise defined | Complete |
| M1 Desktop Shell | Desktop pet window launches, moves, hides, exits | Complete |
| M2 Pet Runtime | Pet state machine, interactions, save, cross-screen safety | Complete |
| M3 Character Packs | Manifest-driven character packs and fallback | Complete |
| M4 Photo Commission Pipeline | Owner photo to art-directed character pack workflow | Complete |
| M5 Character Animation MVP | Meowa-assisted animation frames and state playback | Complete pending owner acceptance |
| M6 AI + Scene Slice | Local/fallback chat plus bed/toy/food props | Next |
| M7 Steam Candidate | Packaged offline Windows build and store-capture readiness | Planned |

## 7. Photo-Commission Character Pipeline

The MVP character customization promise is a production workflow:

1. Owner provides photo/reference.
2. Art Director extracts visual traits and writes/approves Meowa prompts.
3. Meowa generates candidates or animation passes.
4. Owner selects a direction.
5. Implementation normalizes assets into a character pack.
6. QA runs frame checks and screenshot QA.
7. Non-ignored assets and docs are committed and pushed.

This is not an end-user runtime editor for MVP.

Required records per Meowa batch:

- Source reference path.
- Art Director prompt summary.
- Template/model or endpoint used.
- Job IDs.
- Output paths.
- Remaining Meowa credit.
- Owner selection/rejection notes.

## 8. Idea Note Backlog And Version Placement

The idea-note subagent may add raw ideas, but implementation priority is controlled by version buckets.

| Bucket | Product Rule | Example Ideas |
| --- | --- | --- |
| MVP | Required for a stable, cute, offline, Steam-viable desktop pet | Core pet, state animation, character pack, photo-commission pipeline, local/fallback chat, scene props |
| EA | Strong value after first playable MVP but not required for Steam candidate | Extra props, screenshot mode, more reactions, more commissioned characters, daily greetings |
| 1.0 | Requires broader QA or stable systems | Full settings polish, low-spec pass, complete bilingual table, store asset set, installer hardening |
| DLC/Update | Mostly cosmetic or content expansion | Seasonal skins, prop packs, themed scene packs, extra animation packs |
| Later/Reject | Too costly, online-dependent, or misaligned with USD 1 offline promise | Social feed, cloud accounts, Workshop at MVP, exact likeness generation, voice recognition/synthesis, multi-pet runtime |

If an idea does not clearly fit a bucket, default it to Later/Reject until the owner approves a higher version.

## 9. Non-Functional Requirements

| Area | Requirement |
| --- | --- |
| Stability | Two-hour idle test passes before Steam candidate. |
| Performance | Idle CPU/GPU must be low enough for everyday background use. |
| Safety | Clear tray/menu exit path is always available. |
| Offline | Core runtime does not require network. |
| Privacy | Raw owner photos and API keys are not committed. |
| Art QA | Every art/animation change has screenshot QA evidence. |
| Git | Non-ignored verified changes are committed and pushed to the tracked remote. |
| Bilingual | Text should move to a central table as UI grows. |

## 10. Success Metrics

MVP success:

- Owner accepts M7 with no blocker QA failures.
- Packaged Windows app launches without dev tooling.
- Pet can run offline and be exited cleanly.
- Current active character is visible and animated in screenshot QA.
- First store screenshots can be captured from real runtime, not mockups.

Post-release learning metrics:

- User reviews mention cuteness and non-intrusive behavior.
- Users share screenshots or clips.
- Users request more skins/props rather than reporting launch/exit issues.

## 11. Risks And Mitigations

| Risk | Mitigation |
| --- | --- |
| Generated art inconsistency | Unified Art Director prompt gate and screenshot QA. |
| Desktop behavior differs across monitors/DPI | Windows-first QA, owner hardware checks, bounds correction. |
| AI package too large or fragile | Optional local model or fallback-only replies for MVP. |
| Feature creep beyond USD 1 scope | Version bucket rules and explicit MVP cuts. |
| Steam review concern over desktop behavior | Clear exit, non-invasive default, offline operation, stable packaging. |

## 12. Open Questions

- Is the white baby seal still the Steam-facing hero mascot if the first implemented character is `photo_001_travel_girl`?
- Should M6 ship fallback-only chat first, or should a small local model be integrated before props?
- Which bilingual pair is final for launch copy and UI?
- What is the minimum store asset set needed before M7 owner review?
