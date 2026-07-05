# M3 Character Pack + Seal Art Pass Acceptance

## Goal

M3 proves that Project Seal can load character packs from manifests, use fallback rendering when art files are missing, and keep the default white baby seal direction ready for final art production.

## What Is Included

- Character manifest discovery under `assets/characters/*/manifest.json`.
- Active character persistence.
- Default white baby seal manifest.
- Intentionally incomplete `test_gray_seal` pack for fallback QA.
- Temporary keyboard character switch: press `C` while the app is focused.
- Procedural seal fallback driven by manifest palette.
- White baby seal art specification.

## Character Pack Format

Required files:

```text
assets/characters/<character_id>/
  manifest.json
  art-metadata.json
```

Recommended files later:

```text
assets/characters/<character_id>/
  manifest.json
  preview.png
  <character_id>.aseprite
  <character_id>_sheet.png
```

Required manifest fields:

```json
{
  "id": "default_seal",
  "name": "Seal",
  "scale": 3,
  "theme": "white_baby_seal",
  "renderMode": "procedural_seal",
  "fallbackToProcedural": true,
  "palette": {
    "body": "#f8fcff",
    "outline": "#b8c7d2",
    "flipper": "#e5eef5",
    "shadow": "#355070",
    "cheek": "#ff9fb3"
  },
  "animations": {
    "idle": "default_seal_sheet.png"
  },
  "personality": {
    "tone": "cute_bilingual",
    "catchphrases": ["arf!"]
  }
}
```

## White Baby Seal Art Spec

First production art should follow:

- Source canvas: 96x96 preferred, 64x64 acceptable for simple states.
- Runtime footprint: readable inside the current 320x320 desktop window.
- Silhouette: round head, oval body, short flippers, soft low-profile body.
- Face: simple dark eyes, small nose/muzzle, readable expression at small size.
- Palette: off-white body, blue-gray outline, pale flippers, subtle shadow.
- Avoid pure white-only shading so the seal remains visible on bright desktops.
- Keep animation counts lean before final art quality is stable.

M3 emergency cut:

- Final sprite sheets may be absent.
- Procedural seal fallback may continue into M4 if the character pack contract is stable.
- Do not cut manifest loading or fallback behavior.

## How To Run

```powershell
cd "C:\Users\ASUS\Desktop\Project Seal"
npm.cmd run dev
```

## User Acceptance Checklist

| Check | Required Result |
| --- | --- |
| Default manifest load | App launches using the default seal manifest |
| Character label | Bottom label shows the active character name |
| Character switch | Pressing `C` switches between `Seal` and `Gray Test Seal` |
| Palette change | Switching to `Gray Test Seal` visibly changes seal coloring |
| Missing animation fallback | `Gray Test Seal` does not crash even though its animation file is missing |
| Persistence | Switch character, exit, relaunch; active character should remain selected |
| Runtime behavior | M2 states still work after switching characters |
| Build health | `npm.cmd run typecheck` and `npm.cmd run build` pass |

## Non-Blocking Issues For M3

- Final sprite sheet art is not yet present.
- Character selection UI is a keyboard shortcut, not final UI.
- Replacement pack is a QA test pack, not player-facing content.
- Manifest schema is still lightweight and can evolve before Workshop/DLC support.

## Fail Conditions

M3 fails if:

- App crashes when a character pack has missing animation files.
- Default seal no longer loads.
- Character switching requires code changes.
- M2 click/drag/state behavior breaks.
- The default seal direction becomes visually ambiguous.
