# Technical Direction

## Recommendation

Use a desktop app stack rather than a traditional game engine for the first commercial MVP.

Recommended stack:

- Client shell: Electron first, Tauri later if footprint becomes a major issue.
- Renderer: PixiJS or Phaser.
- UI layer: React or Svelte.
- App language: TypeScript.
- Runtime state: lightweight event bus or Zustand-style store.
- Data: JSON content definitions plus local SQLite or simple file-backed saves.
- Local AI: llama.cpp-compatible local service or child process.
- Image pipeline: local preprocessing plus optional ComfyUI workflow for high-quality generated variants.

## Why Not Unity First

Unity is strong for game scenes, animation tooling, and cross-platform games, but desktop pet products need unusually good control over desktop window behavior:

- Transparent always-on-top windows.
- Optional click-through.
- Dragging a frameless character.
- Tray menu and background runtime behavior.
- Native settings and startup behavior.

These are easier to productize in Electron/Tauri/native desktop code than in a conventional game engine.

Unity remains a good fallback if the project later becomes scene-heavy, physics-heavy, or animation-tooling-heavy.

## Architecture

```text
desktop-shell
  main-process
    window-manager
    tray-menu
    settings
    steam-adapter
    ai-service-controller
  renderer
    pet-runtime
    scene-runtime
    interaction-layer
    ui-panels
  shared
    content-schema
    save-schema
    event-bus
    asset-loader
```

## Core Runtime Modules

| Module | Responsibility |
| --- | --- |
| Window Manager | Transparent window, always-on-top, click-through toggle, monitor bounds |
| Pet Runtime | State machine, animation playback, needs/mood values, scheduled behaviors |
| Scene Runtime | Small desktop scene objects, object interactions, unlocks |
| Asset Loader | Default assets, imported character packs, generated pixel assets |
| AI Service Controller | Starts/stops local model process and handles chat requests |
| Save System | Settings, pet profile, unlocked items, imported assets |
| Steam Adapter | Steam launch detection, achievements later, build channel later |

## Window Modes

The desktop pet needs explicit interaction modes because click-through and drag interactions conflict by nature.

| Mode | Behavior |
| --- | --- |
| Normal | Pet receives pointer events; desktop under transparent areas remains usable where supported |
| Drag | Pointer is captured; pet follows cursor; state switches to `Dragged` |
| Lock | Pet ignores interaction and stays out of the user's way |
| Edit Scene | Click-through is disabled; scene props can be moved or configured |

The MVP should expose these through the tray menu and settings panel.

## MVP Technical Risks

| Risk | Mitigation |
| --- | --- |
| Transparent window behavior differs across OS versions | Windows-first MVP, isolate platform code |
| Local model package becomes too large | Ship AI as optional local pack or small default model |
| Generated pixel avatars look inconsistent | Start with constrained bust/avatar conversion before full-body animation |
| Desktop pet consumes too much CPU/GPU | Fixed low FPS idle mode, animation throttling, sleep mode |
| Steam review rejects unstable desktop behavior | Keep default behavior non-invasive; clear exit/tray controls |

## Technical MVP Cut

Must have:

- Windows desktop pet window.
- Transparent background.
- Always-on-top toggle.
- Drag pet around.
- Pet state machine.
- Sprite animation playback.
- Small scene object interaction.
- Local save/settings.
- Imported image to pixel avatar preview.
- Basic local AI chat or clearly optional AI module.
- Steam-ready offline build.

Defer:

- Multiplayer/social features.
- Full body auto-animation from photo.
- Workshop.
- Achievement system.
- Complex room editor.
- Multi-model AI marketplace.

## MVP Technical Task List

1. Build transparent, frameless, always-on-top Windows window.
2. Add tray menu with show/hide, lock, settings, exit.
3. Implement click-through toggle, drag mode, and position persistence.
4. Add PixiJS renderer with integer scaling and low-FPS idle mode.
5. Implement finite state machine for `Idle`, `Walk`, `Sleep`, `Dragged`, `Happy`, `Annoyed`, `Eating`, `Playing`, and `Talking`.
6. Define character pack loader with animation fallback.
7. Add scene prop runtime with 2-3 interactable objects.
8. Add local AI process controller with timeout, cancel, and fallback replies.
9. Package Windows x64 build with all core assets local.
10. Run multi-monitor, DPI, offline launch, and two-hour idle smoke tests.
