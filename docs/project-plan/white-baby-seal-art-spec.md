# White Baby Seal Art Spec

## Direction

Project Seal's default character is a cute white baby seal. It should feel soft, round, calm, and easy to keep on a desktop for long sessions.

## Shape Language

- Round head.
- Oval body.
- Short side flippers.
- Low, soft body posture.
- Small dark eyes.
- Small muzzle/nose.
- No sharp or aggressive shapes.

## Palette

| Use | Suggested Color |
| --- | --- |
| Body | `#f8fcff` |
| Secondary shade | `#e5eef5` |
| Outline | `#b8c7d2` |
| Shadow | `#355070` with low alpha |
| Eyes/nose | `#1d2730` |
| Happy cheek | `#ff9fb3` |

## Canvas And Scale

- Source canvas: 96x96 preferred.
- Emergency placeholder canvas: 64x64 acceptable.
- Runtime scale: integer scaling only.
- Keep the seal readable inside a 320x320 transparent desktop window.

## MVP Animation Priority

Required first:

1. Idle.
2. Poke.
3. Dragged.
4. Happy.
5. Annoyed.
6. Sleep.
7. Walk.

Optional after runtime is stable:

- Blink.
- Sit.
- Eat.
- Play.
- Wake.

## Export Rules

- Transparent PNG.
- Aseprite source preferred.
- Keep source files with exported sheets.
- Match manifest animation names.
- Missing optional animations must not crash the app.
