# Pixel Character Template Spec

## Resolution Range

MVP source asset:

- Preferred canvas: 48x64 px.
- Acceptable canvas range: 40x56 to 48x64 px.
- Visible character body width: 26-38 px.
- Visible character body height: 46-58 px.
- Runtime display scale: 2.5x to 3x in the 320x320 pet window.
- Palette target: 8-16 visible colors.
- Outline: 1-2 px, dark but not pure black unless needed for eyes.

This range is small enough to remain crisp as desktop pixel art and large enough for a readable face, hair silhouette, outfit, and accessory identity.

## Reference Style Summary

The reference set points to a Q-version pixel avatar style:

- 2.5-3 head body ratio, with the head as the main identity area.
- Strong outer silhouette from hair, hood, headphones, animal-ear accessories, cloak, or hoodie.
- Eyes carry personality: purple, green, red, or cyan accents remain readable at small scale.
- Clothes should use one dominant theme, one support color, and one bright accent.
- Avoid realistic anatomy and noisy clothing detail; small desktop scale needs clean blocks.

For Project Seal, the best baseline direction is closer to the short, strong-silhouette references rather than the thin full-body fashion sprite. The thin body can become a later skin family, not the core generator baseline.

## Selected Baseline

Selected baseline: the blue-white headphone girl direction from the candidate sheet.

Implementation rules:

- Keep headphones, bob hair, simple face, blue-white outfit, and black shoes as the default read.
- Simplify clothing into large editable blocks: top, lower outfit, shoes, headphone accent.
- Avoid small plaid/checker patterns in the generator; they are too noisy for photo-driven customization.
- User photos should influence hair/accent/body palette, not rebuild complex outfit details.
- The baseline should remain readable when displayed around 120-160 px tall on desktop.

Art director candidate sheet:

```text
assets/references/photo-to-pixel-tests/art-director-blue-white-headphone-candidates-v1.png
```

Approved baseline extraction draft:

```text
assets/references/photo-to-pixel-tests/base-blue-white-headphone-girl-v1.png
```

Shared core elements extracted from the six candidates:

- Warm brown bob hair with soft bangs.
- White-and-blue over-ear headphones with a simple readable headband.
- Friendly chibi face with small smile and readable dark eyes.
- Blue-white simplified outfit made of large editable regions.
- Blue accent used on collar, trim, jacket, or lower outfit.
- Black shoes and compact full-body idle pose.
- Front-facing, mostly symmetrical body for future animation reuse.

Art quality bar:

- Must look like hand-directed pixel sprite art, not procedural geometry.
- Face and silhouette quality are more important than implementation simplicity.
- Programmatic generator work starts only after an art baseline is approved.
- The implementation should reproduce approved sprite structure, not invent art direction from code.

## Baseline Candidate Directions

| ID | Label | Direction |
| --- | --- | --- |
| `approved_base` | A | Selected baseline: approved blue-white headphone girl |
| `blue_shift` | B | Same baseline with stronger blue accent mapping |
| `light_shift` | C | Same baseline with lighter outfit mapping |
| `warm_shift` | D | Same baseline with warmer photo-derived mapping |
| `dark_shift` | E | Same baseline with darker hoodie-like mapping |

Generated preview sheet:

```text
assets/references/photo-to-pixel-tests/pixel-character-candidates-v1.png
```

## M4 Rule

The imported photo is not the final sprite. It only feeds palette/accent hints into the selected template. The saved result must become a generated `template_pixel_avatar` character pack with a real `preview.png` asset.

Reject outputs that are:

- A recolored seal.
- A raw pixelated photo crop.
- Too noisy to read at 3x display scale.
