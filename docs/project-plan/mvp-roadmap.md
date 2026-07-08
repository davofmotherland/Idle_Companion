# MVP Roadmap

## Product Goal

Build Project Seal as a personal-use Windows desktop pet. The active direction is no longer Steam sale. The product should behave like a modern pixel QQ Pet: quiet by default, status visible on hover, core care values, and optional personal conversation through a double-click chat box.

## Core Loop

1. Pet idles on the desktop with no persistent UI.
2. Mouse hover shows health, mood, hunger, and money.
3. User drags, pokes, feeds, plays, rests, or opens chat.
4. Pet reacts with animation, expression, and compact pixel UI feedback.
5. Health, mood, hunger, and money change.
6. Double-click opens conversation with fallback/persona replies.
7. Pet returns to quiet desktop presence.

## Updated MVP Plan

| Milestone | Goal | Deliverables |
| --- | --- | --- |
| M0 | Product lock | Original lock complete; current target refreshed to personal use |
| M1 | Desktop foundation | Transparent window, draggable pet, tray exit/settings, renderer proof |
| M2 | Pet runtime | State machine, animation player, drag/poke, cross-monitor behavior, save |
| M3 | Character packs | Manifest-driven character directory format and fallback behavior |
| M4 | Photo commission pipeline | Owner-provided photo to art-directed Meowa character pack workflow |
| M5 | Character animation MVP | Meowa cleanup, idle/walk/sleep/happy frames, state playback, screenshot QA |
| M6 | Personal care + hover UI | Health/mood/hunger/money, hover-only status UI, local value persistence |
| M7 | WeChat persona chat slice | Double-click chat box, WeChat import plan/parser, local style profile prototype |
| M8 | Personal build polish | Settings, data hygiene, local backup/export, long-session stability |

## Acceptance Criteria

The personal-use MVP is acceptable when:

- The pet can run for two hours without crashing.
- The app can be closed clearly from tray/menu.
- The pet does not block normal desktop use by default.
- Only the pet is visible during normal idle state.
- Hover shows health, mood, hunger, and money clearly.
- Double-click opens a compact conversation box.
- Idle CPU/GPU usage is low enough for everyday background use.
- At least four visible character animation state groups are implemented: idle, walk, sleep, and happy/poke.
- Owner-provided photos can become usable commissioned pixel character packs.
- WeChat chat records are processed locally or represented through safe local fixtures only.
- No raw chat logs, private photos, or API keys are committed.

## First Personal Build Feature Set

Keep:

- Pixel desktop pet.
- Current animated character pack.
- Default white seal direction as mascot/fallback.
- Health, mood, hunger, money values.
- Hover-only status UI.
- Double-click chat shell.
- Local save/settings.
- Local/fallback persona replies.
- Art-directed Meowa UI kit after pixel scale lock.

Cut if timeline slips:

- Dedicated annoyed/dragged art.
- Full WeChat style distillation.
- Complex earning economy.
- Multiple pets.
- Voice features.
- Public release packaging.

## State Machine

Use a finite state machine for the first version.

| State | Trigger | Notes |
| --- | --- | --- |
| Idle | Default fallback | Can randomly branch into walk, blink, sit, or sleep |
| Walk | Idle timer or scene target | Low priority, interruptible |
| Sleep | Low activity or rest action | Click can wake the pet |
| Dragged | User drags pet | Highest priority |
| Happy | Positive interaction | Short duration reaction |
| Annoyed | Repeated poke or bad timing | Keep cute, not hostile |
| Hungry | Hunger low | Show hover warning / request food |
| LowHealth | Health low | Planned warning state |
| Eating | Food prop used | Changes health/mood/hunger/money |
| Playing | Toy prop used | Changes mood/hunger/money |
| Chatting | User double-clicks pet | Opens conversation box and pauses other low-priority behavior |

Priority order:

1. Dragged.
2. Chatting.
3. Eating or Playing.
4. LowHealth or Hungry.
5. Happy or Annoyed.
6. Sleep.
7. Walk.
8. Idle.

## Data Schemas

Pet save:

```json
{
  "activeCharacterId": "photo_001_travel_girl",
  "health": 80,
  "mood": 70,
  "hunger": 40,
  "money": 100,
  "position": { "x": 1200, "y": 700 },
  "lastPlayedAt": "2026-07-08T10:00:00+08:00",
  "activePersonaProfileId": null
}
```

Persona style profile:

```json
{
  "id": "wechat_persona_001",
  "sourceType": "wechat_export",
  "displayName": "Local Persona",
  "styleSummary": {
    "tone": ["concise", "warm"],
    "replyLength": "short",
    "emojiHabit": "light",
    "punctuation": "casual"
  },
  "safety": {
    "rawChatCommitted": false,
    "localOnly": true
  }
}
```

## Current Milestone Status

| Milestone | Status | Notes |
| --- | --- | --- |
| M0 Product Lock | Complete / superseded | Original Steam/USD assumptions replaced by personal-use direction |
| M1 Desktop Shell | Complete | Transparent draggable Electron shell established |
| M2 Pet Runtime | Complete | State machine, drag/poke, cross-screen safety, and runtime save behavior established |
| M3 Character Packs | Complete | Manifest-driven character packs and fallback behavior established |
| M4 Photo Commission Pipeline | Complete | Owner-directed commissioned character packs established |
| M5 Character Animation MVP | Complete pending owner acceptance | Meowa-assisted animation frames and screenshot QA |
| M6 Personal Care + Hover UI | Not started | Next recommended milestone |
| M7 WeChat Persona Chat Slice | Not started | Follows M6 |
| M8 Personal Build Polish | Not started | Local stability and data hygiene |
