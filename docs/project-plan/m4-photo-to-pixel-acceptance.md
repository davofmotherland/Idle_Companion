# M4 Photo-To-Pixel Customization Acceptance

## Goal

M4 proves that Project Seal can import a local image, run it through a built-in pixel character template generator, save the generated character locally, and switch the desktop pet to that generated template character without relying on network services.

## What Is Included

- Local image import via the `Import` button.
- Supported formats: PNG, JPEG, WebP, BMP, GIF, AVIF, HEIC, and HEIF in the file picker.
- Built-in 48x64 Q-version pixel character template based on the approved blue-white headphone girl baseline.
- Local photo sampling for palette/accent extraction.
- Generated template character preview, not a direct photo sprite.
- Local save under Electron user data.
- Custom character manifest and preview PNG generation.
- Immediate switch to the saved custom character.

## How To Run

```powershell
cd "C:\Users\ASUS\Desktop\Project Seal"
npm.cmd run dev
```

## User Acceptance Checklist

| Check | Required Result |
| --- | --- |
| Import image | Click `Import`, choose a normal local photo, preview appears |
| Template generation | Preview is a unified Q-version pixel template character influenced by the photo |
| Save button | `Save` is disabled before import and enabled after preview |
| Save custom character | Clicking `Save` creates and selects a custom character |
| Character body replacement | The desktop pet body changes to the generated template character, not a recolored seal and not a raw photo crop |
| Character label | Bottom label changes to `Custom Character` for newly saved custom characters |
| Local persistence | Exit and relaunch; custom character remains selectable/active |
| Runtime behavior | Click/drag/sleep states still work after applying custom character |
| No network dependency | Import/save works without network |
| Bad image handling | Invalid or failed image import should not crash the app |
| Build health | `npm.cmd run typecheck` and `npm.cmd run build` pass |

## Saved Data Location

Custom characters are stored locally in Electron user data:

```text
%APPDATA%\Project Seal\custom-characters\
```

Each generated character includes:

- `manifest.json`
- `preview.png` generated from the built-in pixel template
- `art-metadata.json`

## Non-Blocking Issues For M4

- No manual crop UI yet; MVP uses center crop.
- The generated character is template-based and only lightly influenced by the photo until stronger segmentation/feature extraction is added.
- HEIC/HEIF can be selected, but actual decoding depends on Chromium/Windows codec support.
- No full multi-frame animation generation yet; MVP animates the single imported pixel image.
- No delete/rename UI yet.
- No final character selection UI yet.

## Fail Conditions

M4 fails if:

- Importing a normal image crashes the app.
- Save does not create a local custom character.
- Saved custom character cannot be selected.
- Saved custom character is only a recolored seal.
- Saved custom character is only a raw pixelated photo crop instead of the built-in template character.
- Custom character disappears after restart.
- Image processing requires network access.

## Bug Fix Log (2026-06-29)

| Bug | File | Fix | Verified |
|-----|------|-----|----------|
| getActiveCharacter() skips custom characters | src/main/main.ts:211 | Removed `!startsWith('custom_')` filter, now returns any stored character directly | typecheck pass |
| useApprovedBaselinePreview() loads stale preview | src/renderer/renderer.ts:226-255 | Simplified to 3-line unconditional template generation from sourceImage | typecheck pass |
