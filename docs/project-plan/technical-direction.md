# Technical Direction

## Recommendation

Use a desktop app stack for the personal-use MVP.

Recommended stack:

- Client shell: Electron first, Tauri later if footprint becomes a major issue.
- Renderer: PixiJS.
- UI layer: lightweight DOM overlay or renderer-integrated pixel UI, depending on final scale.
- App language: TypeScript.
- Runtime state: lightweight event bus or Zustand-style store.
- Data: JSON content definitions plus file-backed local saves.
- Local AI/persona: local model adapter or deterministic fallback profile runtime.
- Art pipeline: Meowa-assisted assets through unified Art Director prompts.

## Why Not Unity First

Unity is strong for game scenes and animation tooling, but this project needs precise desktop behavior:

- Transparent always-on-top windows.
- Optional click-through.
- Dragging a frameless character.
- Tray menu and background runtime behavior.
- Native settings and startup behavior.
- Small hover UI around a desktop sprite.

These remain easier to productize in Electron/Tauri/native desktop code than in a conventional game engine.

## Architecture

```text
desktop-shell
  main-process
    window-manager
    tray-menu
    settings
    local-data-manager
    ai-service-controller
  renderer
    pet-runtime
    hover-status-ui
    chat-box-ui
    scene-runtime
    interaction-layer
  shared
    content-schema
    save-schema
    persona-schema
    event-bus
    asset-loader
    privacy-guards
```

## Core Runtime Modules

| Module | Responsibility |
| --- | --- |
| Window Manager | Transparent window, always-on-top, click-through toggle, monitor bounds |
| Pet Runtime | State machine, animation playback, health/mood/hunger/money values |
| Hover Status UI | Displays core values only while mouse is over the pet |
| Chat Box UI | Opens on double-click and hosts local/fallback conversation |
| Scene Runtime | Food, toy, bed, and other small care interactions |
| Asset Loader | Default assets, character packs, Meowa UI kit assets |
| Persona Manager | Stores local style profiles and connects them to chat runtime |
| WeChat Importer | Parses owner-provided WeChat exports into local structured records |
| AI Service Controller | Starts/stops local model process and handles chat requests when enabled |
| Save System | Settings, pet profile, active character, core values, persona selection |
| Privacy Guard | Keeps raw private photos, chat logs, and API keys out of git and external calls |

## Window And UI Modes

| Mode | Behavior |
| --- | --- |
| Normal | Only pet sprite is visible; pointer events go to pet as needed |
| Hover | Compact pixel status UI appears near pet |
| Drag | Pointer is captured; pet follows cursor; state switches to `Dragged` |
| Chat | Double-click opens compact conversation box; low-priority pet states pause |
| Lock | Pet ignores interaction and stays out of the user's way |
| Edit Scene | Click-through is disabled; props can be moved or configured |

## Data Model Changes

Active pet values:

```json
{
  "health": 80,
  "mood": 70,
  "hunger": 40,
  "money": 100
}
```

Persona profile:

```json
{
  "id": "wechat_persona_001",
  "sourceType": "wechat_export",
  "localOnly": true,
  "styleSummary": {
    "tone": [],
    "phraseHabits": [],
    "replyLength": "short",
    "emojiHabit": "light"
  }
}
```

## Technical Risks

| Risk | Mitigation |
| --- | --- |
| Transparent window behavior differs across monitors/DPI | Windows-first QA and bounds correction |
| Hover UI mis-scales against pet art | Lock pixel proportions before Meowa UI kit generation |
| Chat records contain private data | Keep raw imports ignored/local; add privacy guard checks |
| Local model package becomes too large | Start with fallback/rules persona, add local model later |
| Style imitation feels wrong or unsafe | Store owner-approved persona profiles and avoid exact identity claims |
| Desktop pet consumes too much CPU/GPU | Fixed low FPS idle mode, animation throttling, sleep mode |

## Technical MVP Cut

Must have next:

- Health/mood/hunger/money values.
- Hover-only status UI.
- Double-click chat box shell.
- Local save of values and UI state.
- Pixel proportion lock document.
- Art Director Meowa UI kit prompt brief.

Defer:

- Public packaging/store flow.
- Full WeChat import UI.
- Local LLM integration if fallback persona replies are enough for first slice.
- Voice features.
- Multi-pet runtime.
- Complex economy.

## Updated Technical Task List

1. Lock pet frame size, display scale, UI grid, and panel dimensions.
2. Define value schema for health, mood, hunger, and money.
3. Replace old value model in runtime/state save.
4. Implement hover detection and status UI visibility.
5. Implement double-click chat box shell.
6. Add local persona profile schema.
7. Design WeChat import parser interface and ignored raw-data location.
8. Add food/toy/bed value effects.
9. Generate Meowa pixel UI kit after Art Director prompt approval.
10. Run screenshot QA for hover UI and chat UI.
11. Run multi-monitor, DPI, idle, and privacy-file checks.
