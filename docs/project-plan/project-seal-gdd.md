# Project Seal GDD

## 1. High Concept

Project Seal is a Windows-first offline desktop pet for Steam. The product fantasy is a cute pixel companion living lightly on the user's desktop: visible, reactive, easy to move away, and pleasant enough to leave running during normal work.

The first commercial identity is a white baby seal, but the project now also supports art-directed photo-commission character packs. The current implemented MVP character pack is `photo_001_travel_girl`.

## 2. Design Pillars

| Pillar | Design Meaning |
| --- | --- |
| Cute at desktop size | Characters must read clearly when small, with strong silhouettes and low visual noise. |
| Non-invasive | The pet must never trap the user, block normal desktop work, or hide the exit path. |
| Offline-first | Core runtime, saves, and first Steam release must work without accounts or servers. |
| Shareable moments | The pet should create screenshot/clip-worthy reactions, outfits, and desktop scenes. |
| Lean USD 1 scope | The MVP prioritizes polish and stability over large content volume. |

## 3. Target Player Experience

The player launches Project Seal, sees a small pixel pet on the desktop, drags or pokes it, watches it idle or walk, and receives short reactions. Over time, scene props and simple mood changes make the pet feel alive. The player can also use owner-directed commissioned character packs made from reference photos, but the MVP does not promise live in-client photo generation.

## 4. Core Loop

1. Pet idles on the desktop.
2. Player drags, pokes, uses a prop, or sends a short message.
3. Pet changes animation state and optionally shows a short bubble.
4. Mood, energy, hunger, and affection update.
5. Pet returns to idle, walks, sleeps, or reacts again.
6. Player captures screenshots/clips or changes character/scene content.

## 5. Current MVP Scope

### In Scope

- Transparent always-on-top desktop pet window.
- Tray/menu safety controls: show, hide, exit, later lock/settings.
- Drag, poke, idle, walk, sleep, happy/poke, annoyed fallback, and dragged feedback.
- Manifest-driven character packs with missing-animation fallback.
- White baby seal as the first-party mascot direction.
- Photo-commission character production flow using Meowa and Art Director-approved prompts.
- Current animated character pack: brown beanie, black sunglasses/jacket, white shirt, blue jeans.
- Local save/settings.
- Basic scene props: bed, toy, food/snack.
- Offline-safe chat: local model bridge or deterministic fallback replies.
- Bilingual release foundation.
- Windows package path for Steam.

### Out of Scope for MVP

- Steam Workshop.
- Cloud save.
- Online accounts.
- Multiplayer or social feed.
- Full live local photo-to-pixel character generation.
- Exact likeness from photos.
- Voice recognition or voice synthesis.
- Multiple active pets.
- Mac/Linux.
- Complex quests, economy, achievements, or room editor.

## 6. Pet States

| State | Trigger | Gameplay Purpose | MVP Animation |
| --- | --- | --- | --- |
| Idle | Default fallback | Rest state and breathing/blink feel | 2-4 frames |
| Walk | Timer or scene target | Makes pet feel autonomous | 2-4 frames |
| Sleep | Low energy or inactivity | Long-session variety | 1-2 frames |
| Dragged | User drag | Direct manipulation feedback | Idle reuse + tilt acceptable |
| Happy | Positive poke/prop | Reward response | 1-2 frames |
| Poke | User click | Tactile reaction | Reuses happy in MVP |
| Annoyed | Repeated poke or bad timing | Cute boundary feedback | Reuses happy until dedicated art |
| Eating | Food prop | Need recovery and prop purpose | Planned M6 |
| Playing | Toy prop | Affection and energy interaction | Planned M6 |
| Talking | Chat message | Companion fantasy | Planned M6 |

Priority order: dragged, talking, eating/playing, happy/annoyed, sleep, walk, idle.

## 7. Character And Art Design

### Default Mascot

The default first-party mascot remains a white baby seal:

- Round body and head silhouette.
- Simple dark eyes.
- Short flippers.
- Soft off-white shading, never pure white only.
- Low-detail pixel style readable on light and dark desktops.

### Current Implemented Photo-Commission Character

`photo_001_travel_girl` is the current implemented replacement character pack:

- Brown knit beanie.
- Black sunglasses.
- Long brown hair.
- Black leather jacket.
- White inner shirt.
- Blue jeans.
- Small chibi pixel proportions.

M5 implemented runtime frames:

- `idle`: 4 frames.
- `walk`: 4 frames.
- `sleep`: 2 frames.
- `happy/poke`: 2 frames.

### Art Direction Rule

All Meowa prompts must be generated or approved by a unified Art Director. Engineers may execute approved prompts and process outputs, but must not casually rewrite art direction.

Every visual change requires screenshot QA before owner acceptance.

## 8. Scene Design

MVP scene props should be small desktop objects, not a full room editor.

| Prop | Function | Pet Response |
| --- | --- | --- |
| Bed | Rest/sleep entry | Sleep or energy recovery |
| Toy | Play interaction | Happy/play reaction, affection gain |
| Food/snack | Feeding | Eating/happy reaction, hunger recovery |

Future props should be cosmetic-first and easy to screenshot. Complex placement, physics, or economy belongs after the Steam candidate.

## 9. AI And Dialogue Design

AI supports the pet fantasy but must never become a runtime dependency.

MVP behavior:

- Local model bridge or fallback-only adapter.
- Short bilingual-ready replies.
- Timeout and cancel handling.
- No launch blocking when a model is missing.
- Talking state exits safely.

Tone:

- Cute, concise, low-pressure.
- Avoid long assistant-like answers.
- Pet speaks as a desktop companion, not a general productivity bot.

## 10. Progression And Retention

MVP retention should come from daily lightweight presence, not deep systems.

MVP-level retention:

- Mood/energy/hunger/affection values.
- Small state variation over time.
- Prop reactions.
- Character/skin swapping.
- Screenshot-worthy idle and poke moments.

Post-MVP retention ideas:

- Cosmetic unlocks.
- Seasonal props.
- More reaction animations.
- Additional commissioned character packs.
- Simple daily greetings.
- Optional achievements after Steam candidate stability.

## 11. Versioned Idea Backlog

The idea-note subagent should place new ideas into these buckets.

| Bucket | Include | Current Candidate Ideas |
| --- | --- | --- |
| MVP | Needed for stable white seal desktop pet, commissioned character pack, offline chat/scene, Steam viability | Tray exit, drag/poke, state animation, manifest packs, Meowa pipeline, screenshot QA, local fallback chat, bed/toy/food |
| EA | Improves retention or shareability after first playable MVP | More props, more reactions, screenshot mode, simple daily greetings, extra commissioned characters |
| 1.0 | Requires stable systems or more QA | Settings polish, broader bilingual string table, packaged installer hardening, low-spec performance pass, Steam store assets |
| DLC/Update | Cosmetic/content expansions | Seasonal skins, prop packs, extra animations, themed desktop scenes, optional character packs |
| Later/Reject | Too expensive, risky, or misaligned with USD 1 offline scope | Cloud accounts, multiplayer/social feed, Workshop at MVP, exact likeness generation, voice features, multi-pet runtime, complex economy |

If a future note conflicts with offline-first, low-price, or non-invasive desktop behavior, it should start in Later/Reject until the owner explicitly upgrades its priority.

## 12. Current Status

| Milestone | Status |
| --- | --- |
| M0 Product Lock | Complete |
| M1 Desktop Shell | Complete |
| M2 Pet Runtime | Complete |
| M3 Character Packs | Complete |
| M4 Photo Commission Pipeline | Complete |
| M5 Character Animation MVP | Complete pending owner acceptance |
| M6 AI + Scene Slice | Not started |
| M7 Steam Candidate | Not started |

## 13. Acceptance Standards

The MVP is game-design acceptable when:

- The pet can run for two hours without crash or runaway CPU/GPU.
- The user can always exit from tray/menu.
- Drag, poke, idle, walk, sleep, and happy/poke are visible and do not get stuck.
- The active character is visible in screenshot QA and never silently falls back to the wrong character.
- The app works offline or clearly falls back when local AI is unavailable.
- The Steam candidate can launch from a clean Windows package.
