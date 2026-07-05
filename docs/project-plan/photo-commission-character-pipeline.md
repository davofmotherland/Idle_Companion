# Photo Commission Character Pipeline

## Product Direction Change

Project Seal no longer promises real-time local photo-to-pixel customization for MVP.

New direction:

- The owner provides a photo.
- Art generation creates several pixel character style candidates.
- The owner selects or approves one direction.
- The selected result is packaged as a normal character pack.
- The app loads that character pack like any other skin/character.

This is a production workflow, not an end-user live editor.

## Why This Replaces The Old M4

The previous template generator produced low-quality procedural placeholders. It is removed from the product promise for now.

The new MVP promise is:

- Higher quality art-directed pixel characters.
- Repeatable production steps.
- Easier QA and iteration.
- No need to solve live identity extraction, segmentation, or editable outfit generation in the client.

## Standard Intake

For each user photo, create:

```text
assets/references/photo-inputs/photo-XXX.png
assets/references/meowa/photoXXX/photoXXX_candidates/sprite_pack_preview.png
assets/characters/photo_XXX_<short_name>/idle-source.png
assets/characters/photo_XXX_<short_name>/idle.png
assets/characters/photo_XXX_<short_name>/manifest.json
assets/characters/photo_XXX_<short_name>/art-metadata.json
```

## Unified Art Director Gate

Before any Meowa job is run, the Art Director must generate or approve the prompt. The implementation agent records the approved brief, job IDs, output paths, owner selection, and remaining Meowa credit. No ad hoc prompt rewrites are allowed during implementation unless they go back through the Art Director.

## Art Director Brief Template

Extract 5-8 recognizable visual traits from the photo:

- Hair color and silhouette.
- Hat/headwear.
- Glasses or face accessory.
- Outerwear.
- Inner clothing color.
- Shoes or lower outfit.
- Pose or attitude.
- Any strong scene/personality cue.

Generate a candidate sheet first:

- 2-6 original chibi pixel sprites, depending on Meowa template count.
- Same person, different pixel style interpretations.
- Full body.
- Plain background.
- No text or labels.
- Strong readable silhouette.
- Keep recognizable traits, but avoid realism.

Then generate the selected/strongest idle sprite:

- Single full-body sprite.
- Transparent final PNG.
- 48x64 runtime-normalized asset for the current renderer.
- Keep idle pose simple enough for later animation.

## Prompt Pattern

```text
Create a polished full-body pixel-art desktop pet idle sprite based on the reference photo.
Single character only, centered, no text, no labels, no watermark.
Preserve these recognizable traits: <traits>.
Style: premium Japanese/Korean chibi pixel game sprite, crisp dark outline, clean pixel blocks, limited palette, hand-directed sprite art, designed for desktop pet use.
Avoid realistic illustration, 3D render, blurry anti-pixel edges, excessive details, text, watermark.
```

## Meowa Integration Status

- API key: received from owner, not committed to repo.
- Skill: installed at `.agents/skills/game-assets`.
- Pixel character endpoint: `pixel-gen-run`, currently using template `large_3_4` for reference-photo chibi desktop pet candidates.
- Credit query: `credits-balance`.
- Current first implemented job: `photo_001_travel_girl`, Meowa job `f4c69c22-a86b-4ad6-862c-14c661c4173e`.

Standard command shape:

```bash
python .agents/skills/game-assets/meowart_api.py pixel-gen-run \
  --template-name large_3_4 \
  --requirement "<short art director brief>" \
  --reference-file assets/references/photo-inputs/photo-XXX-preview.png \
  --output-dir assets/references/meowa/photoXXX \
  --job-name photoXXX_candidates
```

After generation, keep the original Meowa sprite as `idle-source.png`, normalize the selected sprite to `48x64` as `idle.png`, and record the Meowa job id in `art-metadata.json`.


