# Project Seal PRD

## 1. Product Summary

Project Seal is a personal-use Windows desktop pet inspired by QQ Pet. It is no longer planned as a Steam sale product. The app should run locally, show only the pixel pet by default, reveal status UI on hover, and open a conversation box on double-click.

The current active character is `photo_001_travel_girl`. The default white baby seal remains the mascot direction and fallback first-party character concept.

## 2. Product Goals

| Goal | Requirement |
| --- | --- |
| Quiet daily desktop use | Only the pet is visible by default; UI appears on hover or explicit interaction. |
| QQ Pet-style care loop | Health, mood, hunger, and money are the core values. |
| Personal conversation | Double-click opens chat; future WeChat import can simulate a selected person's speaking style. |
| Pixel-coherent art/UI | Character, status UI, chat box, and props use one locked pixel proportion system. |
| Local/private data | Photos, chat records, persona profiles, and API keys remain local and out of git. |

## 3. Target User

Primary user:

- The owner, using the app personally on Windows.

Secondary future user:

- A trusted private tester, only after local privacy and data handling are safe.

The product is not currently optimized for public sale, store onboarding, or broad customer support.

## 4. P0 Requirements

| Feature | Requirement | Acceptance |
| --- | --- | --- |
| Quiet desktop pet | Default screen shows only the pet sprite | No permanent import/settings/debug panel around the pet |
| Hover status | Mouse hover reveals health, mood, hunger, money | UI appears near pet, remains readable, disappears when not hovered |
| Core values | Replace active care model with health/mood/hunger/money | Values persist locally and can drive state changes |
| Double-click chat shell | Double-click opens a compact conversation box | Box opens/closes without breaking pet animation or drag |
| Existing animation stability | Current idle/walk/sleep/happy/poke still work | M5 screenshot QA remains valid after UI changes |
| Local save | Position, active character, and core values persist | Restart restores expected state |
| Art proportion lock | Art Director confirms pet/UI pixel scale before UI kit generation | UI implementation does not begin from mismatched proportions |
| Art Director prompt gate | Meowa UI/character prompts come from unified Art Director | Prompt summary and output path are recorded |
| Screenshot QA | Every visual/UI/art change is screenshot-verified | Screenshot shown before owner acceptance |

## 5. P1 Requirements

| Feature | Requirement |
| --- | --- |
| WeChat import parser | Import owner-provided WeChat chat export into local structured records |
| Style distillation | Extract tone, phrase habits, reply rhythm, emoji/punctuation patterns, and common expressions |
| Persona profile | Store distilled style locally as a profile separate from raw chat logs |
| Styled chat replies | Double-click chat uses the persona profile to imitate speaking style |
| Food/toy/bed actions | Care props affect health, mood, hunger, and money |
| Hungry/sick feedback | Low hunger or health changes pet state or hover UI warning |
| Meowa pixel UI kit | Generate and implement status/chat UI assets that match the locked pet scale |

## 6. P2 / Later Requirements

| Feature | Reason To Defer |
| --- | --- |
| Public Steam build | Cancelled for current direction |
| Store assets/trailer | Not needed for personal use |
| Cloud/account sync | Conflicts with local-private design |
| Workshop/public sharing | Not aligned with current personal-use scope |
| Voice recognition/synthesis | High privacy and implementation risk |
| Multi-pet runtime | More complexity than current care loop needs |
| Exact identity simulation claims | Risky and unnecessary; style imitation is enough |

## 7. Current Implementation Baseline

Completed:

- Electron + PixiJS + TypeScript desktop runtime.
- Transparent desktop pet window.
- State machine and drag/poke behavior.
- Cross-monitor drag fixes verified by owner for M2.
- Manifest-driven character pack loading and fallback.
- Photo-commission character production pipeline using Meowa.
- Active character `photo_001_travel_girl` with M5 animation frames.
- Old import/save UI removed from runtime.
- Screenshot QA requirement for art changes.
- Git rule requiring verified non-ignored changes to commit and push.

Needs update for new direction:

- Replace active values with health/mood/hunger/money.
- Add hover-only status UI.
- Add double-click chat box.
- Define local WeChat import and distillation format.
- Lock pixel proportions and generate matching UI kit through Meowa.

## 8. Planned Milestones

| Milestone | Product Outcome | Status |
| --- | --- | --- |
| M0 Product Lock | Original product lock; refreshed target is now personal use | Complete / superseded by PRD refresh |
| M1 Desktop Shell | Desktop pet window launches, moves, hides, exits | Complete |
| M2 Pet Runtime | State machine, interactions, save, cross-screen safety | Complete |
| M3 Character Packs | Manifest-driven character packs and fallback | Complete |
| M4 Photo Commission Pipeline | Owner photo to art-directed character pack workflow | Complete |
| M5 Character Animation MVP | Meowa-assisted animation frames and state playback | Complete pending owner acceptance |
| M6 Personal Care + Hover UI | Health/mood/hunger/money and hover-only status UI | Next |
| M7 WeChat Persona Chat Slice | Double-click chat plus local WeChat style profile | Planned |
| M8 Personal Build Polish | Settings, data hygiene, local backup/export, stability | Planned |

## 9. WeChat Import And Persona Distillation

### Input

Supported input is owner-provided exported WeChat chat records. Exact export format still needs confirmation during implementation.

### Local Processing Goals

- Normalize sender, timestamp, message type, and text.
- Filter unsupported media or represent them as placeholders.
- Extract writing style features from the target person.
- Build a compact persona profile used by the chat runtime.

### Distilled Style Profile Should Capture

| Dimension | Examples |
| --- | --- |
| Tone | gentle, teasing, concise, direct, playful |
| Phrase habits | common openings, endings, filler words |
| Reply length | short bursts, long paragraphs, one-line replies |
| Emoji/sticker habits | emoji frequency, expressive markers, repeated symbols |
| Punctuation rhythm | ellipses, exclamation, question marks, line breaks |
| Topic boundaries | what the persona should avoid or refuse |

### Privacy Requirements

- Raw chat exports are ignored and never committed.
- Persona profiles should be local by default.
- Any model call involving chat records must be local unless owner explicitly approves otherwise.
- The app should clearly distinguish style simulation from the real person.

## 10. Pixel UI Kit Requirements

Before implementation:

1. Art Director confirms character frame size, display scale, and UI grid.
2. Art Director writes Meowa prompts for a UI kit matching the pet scale.
3. Meowa outputs are previewed before implementation.
4. Selected UI assets are normalized and implemented.
5. Screenshot QA verifies hover and chat UI at runtime size.

UI kit assets:

- Hover status frame.
- Health, mood, hunger, money icons.
- Pixel bars or counters.
- Conversation box frame.
- Chat input area.
- Optional close/send buttons.
- Food/toy/bed icons or prop UI.

## 11. Non-Functional Requirements

| Area | Requirement |
| --- | --- |
| Stability | Pet can idle for long personal sessions without crash. |
| Performance | Idle mode stays low CPU/GPU. |
| Visibility | No persistent UI unless hovered, chatting, or explicitly opened. |
| Privacy | Raw WeChat logs, private photos, and API keys are never committed. |
| Offline | Core pet and local chat fallback work without network. |
| Art QA | Every UI/art/animation change has screenshot QA evidence. |
| Git | Non-ignored verified changes are committed and pushed. |

## 12. Open Questions

- What exact WeChat export format will be used first?
- Should raw chat logs remain only outside the repo, or should sanitized sample fixtures be created for tests?
- Should the first style simulation use rules/templates, a local LLM, or both?
- What final pet frame size and display scale should be locked before UI kit generation?
- Should money be earned over time, granted manually, or tied to care actions in the personal build?
