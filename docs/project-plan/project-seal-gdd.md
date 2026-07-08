# Project Seal GDD

## 1. High Concept

Project Seal is a personal-use Windows desktop pet. It is no longer planned as a Steam sale product. The design target is a private, modern pixel desktop companion inspired by QQ Pet: the pet lives directly on the desktop, reacts to simple interaction, has visible needs systems, and stays visually quiet unless the user interacts with it.

The default mascot direction remains a white baby seal, while the current implemented active character pack is `photo_001_travel_girl`.

## 2. Design Pillars

| Pillar | Design Meaning |
| --- | --- |
| Quiet desktop presence | By default only the pet is visible. UI appears only on hover, double-click, or explicit interaction. |
| QQ Pet-style care loop | Health, mood, hunger, and money form the core simulation values. |
| Personal and local | The project is for personal use; chat records, distilled style data, and generated assets stay local unless explicitly exported. |
| Pixel-coherent | Pet art, UI, icons, bubbles, and panels share one pixel scale and one Art Director style. |
| Safe control | The pet must remain draggable, closable, and non-invasive. |

## 3. Target Experience

The user sees only a small pixel pet on the desktop during normal use. When the mouse hovers over the pet, a compact QQ Pet-style status UI appears, showing health, mood, hunger, and money. When the user double-clicks the pet, a conversation box opens.

Later, the user can import WeChat chat records. The app locally distills the other person's speaking style and uses that style in the double-click conversation flow. The goal is tone simulation for personal companionship, not public chatbot publishing.

## 4. Core Loop

1. Pet idles on the desktop with no persistent UI around it.
2. User hovers over pet and sees health, mood, hunger, and money.
3. User drags, pokes, feeds, plays, rests, or opens chat.
4. Pet reacts with animation and short pixel UI feedback.
5. Values change: health, mood, hunger, money.
6. User can double-click to talk with the pet or style-simulated persona.
7. Pet returns to quiet desktop presence.

## 5. Core Systems

### 5.1 Needs Values

| Value | Meaning | Changes From | UI Rule |
| --- | --- | --- | --- |
| Health | Overall condition and long-term care state | Low hunger, poor rest, time, care actions | Hover status only |
| Mood | Emotional state and interaction quality | Poke, play, chat, neglect, props | Hover status only |
| Hunger | Need for food | Time decay, food item use | Hover status only |
| Money | Soft resource for food/props/cosmetics | Planned rewards or manual grant in personal build | Hover status only |

The previous mood/energy/affection/hunger model is replaced by the QQ Pet-like health/mood/hunger/money model for active planning.

### 5.2 Desktop Visibility Rules

- Default state: only the pet sprite is visible.
- Hover state: show compact pixel status UI anchored near the pet.
- Double-click state: open the conversation box.
- Interaction state: show only short feedback needed for the action.
- Debug labels, import panels, and permanent app UI must not cover the pet during normal use.

### 5.3 Conversation System

MVP direction:

- Double-click opens a compact chat box.
- Chat can start with fallback persona replies.
- WeChat chat import is planned as the personalization path.

WeChat import pipeline:

1. User provides exported WeChat chat records.
2. Import parser normalizes messages into local structured data.
3. Local distillation extracts tone, phrase patterns, rhythm, emoji habits, and common reply shapes.
4. A local persona profile is created.
5. Double-click conversation uses that profile to simulate speaking style.

Privacy boundary:

- Chat records are personal and local-only by default.
- Do not commit raw chat records to git.
- Do not send chat records to Meowa.
- Any LLM use must be local or explicitly approved by the owner.

## 6. Pet States

| State | Trigger | Purpose | MVP Art |
| --- | --- | --- | --- |
| Idle | Default | Quiet presence | Implemented |
| Walk | Timer or small movement | Autonomous life | Implemented |
| Sleep | Low activity or rest | Care loop support | Implemented |
| Dragged | User drag | Direct manipulation | Implemented with reuse/tilt |
| Happy/Poke | Click or positive interaction | Immediate feedback | Implemented |
| Hungry | Hunger low | QQ Pet-like needs feedback | Planned |
| Sick/Low health | Health low | Care warning | Planned |
| Chatting | Double-click conversation | Personal dialogue | Planned |
| Eating | Food action | Hunger recovery | Planned |
| Playing | Toy/action | Mood recovery | Planned |

Priority order: dragged, chatting, eating/playing, sick/low health, hungry, happy/poke, sleep, walk, idle.

## 7. Art Direction

### 7.1 Character Art

The active runtime character is `photo_001_travel_girl`:

- Brown knit beanie.
- Black sunglasses.
- Long brown hair.
- Black leather jacket.
- White inner shirt.
- Blue jeans.
- Small chibi pixel proportions.

Current runtime frames:

- `idle`: 4 frames.
- `walk`: 4 frames.
- `sleep`: 2 frames.
- `happy/poke`: 2 frames.

### 7.2 Pixel Proportion Lock

Before adding new UI or commissioning more Meowa UI assets, the Art Director must lock the overall pixel proportion system:

| Item | Decision Needed |
| --- | --- |
| Runtime character frame | Confirm final logical frame size and display scale. |
| Status UI pixel grid | Confirm unit size, border thickness, icon size, and font size. |
| Chat box grid | Confirm panel width, line height, avatar/icon slot, and bubble padding. |
| Prop scale | Confirm bed/toy/food size relative to pet height. |

No UI kit should be implemented until the pet-to-UI scale is confirmed.

### 7.3 Meowa UI Kit Rule

After pixel proportions are locked, the unified Art Director generates prompts for a Meowa-assisted pixel UI kit that matches the pet scale.

The UI kit should include:

- Hover status frame.
- Health icon/bar.
- Mood icon/bar.
- Hunger icon/bar.
- Money icon/counter.
- Double-click chat box.
- Small action buttons if needed.
- Bed, food, toy UI/prop icons.

All Meowa prompts must come from the unified Art Director. Engineers may run approved prompts and implement outputs, but must not rewrite art direction ad hoc. Every UI/art change requires screenshot QA.

## 8. Scene And Care Design

The scene remains lightweight. It should support care actions rather than a full room editor.

| Object | Function | Value Effect |
| --- | --- | --- |
| Food | Feed pet | Hunger recovers, mood may improve, money decreases |
| Toy | Play | Mood improves, hunger may decay faster |
| Bed | Rest/sleep | Health improves, mood stabilizes |

Money is a soft personal-use resource. It can start as a debug/manual value before any earning loop is designed.

## 9. Versioned Idea Backlog

| Bucket | Include | Current Candidate Ideas |
| --- | --- | --- |
| MVP | Required for the personal QQ Pet-style loop | Hover stats, health/mood/hunger/money, double-click chat shell, current animated character, local save |
| Next | Directly supports the new direction after MVP | WeChat import parser, local style distillation, pixel UI kit, hungry/sick states, food/toy/bed actions |
| 1.0 Personal | Stable daily-use polish | Settings, low-resource mode, robust local data management, chat profile management, backup/export |
| Content Update | Cosmetic or interaction expansion | More outfits, props, seasonal UI skins, more reactions, extra commissioned characters |
| Later/Reject | Too broad or not aligned with personal local use | Steam store launch, cloud accounts, online social feed, public chatbot sharing, Workshop, voice features unless explicitly revived |

## 10. Current Status

| Milestone | Status |
| --- | --- |
| M0 Product Lock | Complete, but active product target refreshed to personal use |
| M1 Desktop Shell | Complete |
| M2 Pet Runtime | Complete |
| M3 Character Packs | Complete |
| M4 Photo Commission Pipeline | Complete |
| M5 Character Animation MVP | Complete pending owner acceptance |
| M6 Personal Care + Hover UI | Not started |
| M7 WeChat Persona Chat Slice | Not started |
| M8 Personal Build Polish | Not started |

## 11. Acceptance Standards

The personal-use MVP is acceptable when:

- The pet runs quietly with only the sprite visible by default.
- Hover shows health, mood, hunger, and money without blocking normal desktop use.
- Double-click opens a usable conversation box.
- Drag, poke, idle, walk, sleep, and happy/poke remain stable.
- The active character is visible in screenshot QA and never silently falls back to the wrong character.
- Local saves persist pet position and core values.
- No raw chat records, private photos, or API keys are committed.
