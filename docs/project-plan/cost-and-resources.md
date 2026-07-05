# Cost And Resources

## Known Paid Items

| Item | Expected Cost | Notes |
| --- | --- | --- |
| Steam Direct app fee | USD 100 per app | Required for Steam app submission; can be recouped after meeting Steam conditions |
| Aseprite | Low one-time cost | Recommended pixel art editor; free alternatives exist |
| Commercial art | Variable | Strongly recommended for default pet quality |
| Sound effects/music | Variable | Can start with licensed packs |
| Code signing certificate | Optional early, useful later | Helps Windows trust and installer reputation |
| QA devices | Variable | At minimum test multiple Windows display/DPI setups |
| Steam capsule art | Variable | Worth paying for if internal art bandwidth is limited |

## Free Or Open-Source Candidates

| Area | Candidate |
| --- | --- |
| Desktop shell | Electron, Tauri |
| 2D renderer | PixiJS, Phaser |
| Game engine fallback | Godot |
| Local inference | llama.cpp |
| Image generation workflow | ComfyUI |
| Pixel editing | LibreSprite, Krita |
| Data | JSON, SQLite |
| Build automation | GitHub Actions, local scripts |

## Resource Needs

Minimum team for MVP:

- 1 owner/technical lead.
- 1 programmer.
- 1 artist.
- 1 part-time QA/release support.

Minimum assets:

- 1 polished default pet.
- 12 required MVP actions if art bandwidth allows; 6 is the emergency cut.
- 2-3 scene props: bed, toy, food/snack.
- 1 UI icon set.
- 1 app icon.
- Steam capsule/key art drafts.
- 10-20 sound effects.

Minimum technical resources:

- Windows development machine.
- Mid/low-spec Windows test machine.
- Steamworks partner account.
- GPU machine if running ComfyUI locally.
- Local model benchmark set.

## Cost Control Strategy

Start with free/open-source tooling where possible. Spend money where it affects marketability:

1. Default character art.
2. Steam capsule art.
3. Sound polish.
4. Code signing and QA only when preparing public release.

Avoid early spending on:

- Large model infrastructure.
- Full animation generation automation.
- Multi-platform support.
- Complex backend services.

## Recommended Paid Priority

1. Default pet concept and final sprite animation.
2. Steam capsule/key art.
3. High-quality sound effects.
4. Aseprite license if the artist does not already own it.
5. Code signing certificate near public release.

Do not spend early on large AI infrastructure. The MVP should prove that the desktop pet is charming before scaling AI generation.
