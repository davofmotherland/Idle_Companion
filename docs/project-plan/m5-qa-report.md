# M5 QA Report - Character Animation MVP

## Result

Recommendation: Pass for owner verification

Blockers: None

Major issues: None open

Minor issues: Dedicated `annoyed` and `dragged` frames are deferred.

## Commands

- `npm.cmd run typecheck`: Pass
- `npm.cmd test`: Pass, 4 test files and 64 tests
- `npm.cmd run build`: Pass

## Automated Checks

| Check | Result | Notes |
| --- | --- | --- |
| Manifest animation schema | Pass | `manifest.json` lists frame arrays for idle, walk, sleep, happy, poke, annoyed, and dragged |
| Runtime frame count | Pass | idle 4, walk 4, sleep 2, happy 2 |
| Runtime frame size | Pass | All committed runtime frames are 48x64 PNGs |
| Visual signature | Pass | Static QA detected brown hat/hair, black jacket/sunglasses, white shirt/skin, and blue jeans in every runtime frame |
| Texture loading | Pass | Renderer now loads each frame through `Image()` before creating Pixi textures |
| State frame playback | Pass | Renderer selects frame sets by pet state and advances by state-specific FPS |
| Old import UI removed | Pass | `Import`, `Save`, image input, preview canvas, and customizer panel are absent from runtime HTML/CSS |
| Debug label obstruction | Pass | `#state-label` is hidden so it does not block the character |
| Fallback safety | Pass | Missing/non-template character still falls back to drawn seal instead of crashing |

## V2 Meowa job IDs

| State | Job ID |
| --- | --- |
| idle | `c7f196e1-5abe-4ca4-90df-e92e2e3d338d` |
| walk | `ab2e205c-bc4b-489a-8cf1-45dce17396ca` |
| sleep | `d948e35e-d50c-403f-8031-ee84ef081fd3` |
| happy/poke | `84149964-d804-4ebd-9ad6-d6fa1d2ea2e6` |

## Screenshot QA

Electron screenshot QA was run before handoff.

Screenshot path:

```text
C:\tmp\project-seal-qa\renderer-screenshot.png
```

Pixel detection result from the final screenshot:

```text
size: 304x255
dark pixels: 6187
brown pixels: 4288
blue pixels: 785
nonwhite pixels: 13267
```

Interpretation:

- Dark pixels confirm black sunglasses/jacket are visible.
- Brown pixels confirm hat/hair are visible.
- Blue pixels confirm jeans are visible.
- Nonwhite count confirms the screenshot is not blank.

## Owner Confirmation Required

| # | Check | Expected Result | Pass? |
| --- | --- | --- | --- |
| 1 | Launch local dev app | Small top-right selected character appears, not seal |  |
| 2 | Idle | Character shows subtle frame movement while idle |  |
| 3 | Walk | Walk state uses walk frames and does not rely only on whole-sprite sliding |  |
| 4 | Sleep | After inactivity, character switches to sleep/rest frame set |  |
| 5 | Poke/happy | Clicking character triggers happy/poke reaction frames |  |
| 6 | Outfit | White shirt and blue jeans remain readable at desktop size |  |
| 7 | No old UI | Import/save panel is gone |  |
| 8 | No debug obstruction | Bottom debug label does not cover the pet |  |
| 9 | Drag | Dragging still works across desktop and does not break animation after release |  |
| 10 | Restart | Relaunch keeps the animated character as default active character |  |

## Fixed During QA

| Issue | Fix | Verified |
| --- | --- | --- |
| Screenshot showed no character | Renderer now loads data URL frames through `Image()` before creating Pixi textures | Electron screenshot QA pass |
| Debug state label covered character | `#state-label` hidden in runtime CSS | Electron screenshot QA pass |

## Deferred Follow-Up

- Generate dedicated `annoyed` frames.
- Generate dedicated `dragged` frames if the drag feedback feels too simple.
- Turn local screenshot QA harness into a committed automated QA script.
- Add owner-facing animation QA checklist to the release candidate build process.
