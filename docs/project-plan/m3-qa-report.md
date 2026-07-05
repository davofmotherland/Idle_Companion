# M3 QA Report

## Milestone

M3 Character Pack + Seal Art Pass

## Build/Test Commands Run

- `npm.cmd run typecheck`: Pass.
- `npm.cmd run build`: Pass.
- Manifest JSON/required fields check: Pass.
- Main/preload/renderer static checks: Pass.

## Summary

- Recommendation: Accept with tracked issues.
- Blockers: None.
- Major issues:
  - Initial QA found missing official art source/metadata under `assets/characters/default_pet`.
- Minor issues:
  - Visual switch/readability not directly observed by QA Tester.
- Owner confirmation required:
  - Visual `C` key switching.
  - White seal readability on light/dark backgrounds.
  - Pixel crispness at desktop scaling.

## Initial QA Finding

| Check | Result | Notes |
| --- | --- | --- |
| Manifest loading | Pass static | Main process scans `assets/characters/*/manifest.json` |
| Missing animation fallback | Pass static | Renderer uses procedural palette drawing; `test_gray_seal` intentionally references missing art |
| Character swap | Pass static | `runtime:set-active-character`, preload `setActiveCharacter`, renderer `C` key cycle present |
| Art source tracking | Major issue | Default character initially had only `manifest.json` |

## Fix Applied

Added:

- `assets/characters/default_pet/art-metadata.json`
- `assets/characters/default_pet/README.md`

These explicitly track the procedural placeholder source status and final art requirements.

## Retest Needed

- QA Tester retest for art source tracking.
- Owner visual confirmation for:
  - Press `C` to switch between `Seal` and `Gray Test Seal`.
  - Seal readability on light/dark backgrounds.
  - Pixel crispness at current desktop scaling.

## Retest Result

QA Tester retest completed.

Results:

- `assets/characters/default_pet/art-metadata.json`: Exists and JSON is valid.
- `assets/characters/default_pet/README.md`: Exists.
- `assets/characters/default_pet/manifest.json`: JSON is valid.
- `npm.cmd run typecheck`: Pass.
- `npm.cmd run build`: Pass.

Conclusion:

- Previous Major issue is resolved.
- No current blocker or major issue found by QA Tester.
- Final QA recommendation: Accept.
