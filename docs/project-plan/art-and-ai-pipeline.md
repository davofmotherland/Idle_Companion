# Art And AI Pipeline

## Art Direction

Target style:

- Cute Q-version proportions.
- Pixel art with readable silhouette at small size.
- Soft, friendly expressions.
- High shareability for screenshots and short clips.
- Low visual noise so the pet stays readable on busy desktops.

## Base Sprite Spec

Recommended first spec:

- Source canvas: 64x64 or 96x96 per frame.
- Runtime canvas: allow 128x128 logical frame if the character needs extra effects or shadow.
- Display scale: 2x to 4x depending on monitor DPI.
- Frame rate: 8-12 FPS for most actions.
- Direction: front and left/right for MVP.
- Export: PNG sprite sheets plus JSON metadata.
- Palette: 16-32 colors per character where possible.

## MVP Animation List

Must have:

- Idle.
- Blink.
- Walk.
- Run.
- Sit.
- Sleep.
- Happy/touched.
- Annoyed.
- Dragged.
- Fall.
- Land.
- Poke.

Should have:

- Eat/snack.
- Sit.
- Look around.
- Wave.

Defer:

- Complex outfit animation.
- Object-specific bespoke animations for every prop.
- Fully procedural body animation from imported photos.

## Character Pack Format

A character pack should include:

- `manifest.json`.
- Sprite sheets.
- Frame metadata.
- Portrait/avatar image.
- Color palette metadata.
- Optional voice/sound references.

Recommended file layout:

```text
characters/
  default_pet/
    manifest.json
    default_pet_sheet.png
    default_pet.aseprite
    preview.png
```

## Photo To Pixel Workflow

MVP workflow:

1. Import image.
2. Sample the face/subject area locally for palette and simple visual hints.
3. Apply the built-in Q-version pixel character template.
4. Fill template regions with controlled palette choices.
5. Generate a 48x64 template character preview.
6. Save the generated character as a local custom character pack.
7. Allow manual confirmation.

Advanced workflow:

1. Use ComfyUI for Q-version character generation.
2. Apply pixel-art LoRA or postprocess pixelization.
3. Generate sprite reference.
4. Human QA and cleanup.
5. Convert into character pack.

## MVP Photo Generation Boundary

The first version should market this as a pixel avatar or inspiration generator, not as exact identity replication.

Keep:

- Face/subject crop.
- Palette extraction.
- Hair/skin/clothing color hints.
- Template body selection.
- Idle preview generation.
- Manual crop adjustment.

Avoid in MVP:

- Using the raw imported photo as the final desktop pet body.
- Treating the default seal as the photo-generation target.
- Full-body reconstruction.
- Frame-by-frame generated animation.
- Celebrity or third-party IP prompts.
- Promising exact likeness.
- Requiring ComfyUI for ordinary users.

## Template Character Generator

M4 uses a deterministic built-in generator before any AI model is introduced.

The generator owns:

- The final 48x64 Q-version silhouette.
- Outline thickness and readable body proportions.
- Eye, cheek, limb, shadow, and idle-preview placement.
- Palette constraints and quantization.

The imported photo owns only:

- Palette/accent hints.
- Future crop/subject hints.
- Future optional identity hints after stronger local processing exists.

The default white seal is a first-party character pack and placeholder runtime mascot. It is not the target template for user photo generation.

## Meowa Prompt Ownership

Meowa is treated as an art production tool, not a free-form implementation shortcut. A unified Art Director owns the prompt language, negative prompts, style consistency, and batch acceptance criteria. Engineers may execute the approved prompts and convert the selected output into runtime assets, but they do not change the art direction independently.

Every Meowa batch must record remaining credit after generation.

## AI Integration

Use local AI for:

- Short pet replies.
- Personality-based reactions.
- Optional Q&A.
- Event flavor text.

Do not depend on AI for:

- Core state transitions.
- Save data correctness.
- Critical UI flows.
- Deterministic gameplay rules.

## Licensing Notes

Check licenses for:

- Model weights.
- LoRA files.
- Generated image commercial terms.
- Pixel fonts.
- Sound effects.
- UI icons.
- Any imported open-source desktop pet code.

Generated assets should still receive manual review before being included in a commercial Steam build.

## Steam Visual Assets

Prepare these before the Steam page goes live:

| Asset | Size |
| --- | --- |
| Header Capsule | 460x215 |
| Small Capsule | 231x87 |
| Main Capsule | 616x353 |
| Vertical Capsule | 374x448 |
| Page Background | 1438x810 |
| Library Capsule | 600x900 |
| Library Hero | 3840x1240 |
| Library Logo | Transparent PNG |
| Community Icon | 184x184 |
| Client Icon | ICO |

Screenshot order:

1. Pet active on a real desktop.
2. Replacement character selection.
3. Photo-to-pixel flow.
4. Local/offline chat.
5. Scene props and interactions.
6. Skins and customization.

