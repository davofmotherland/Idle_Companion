# Project Rules

These rules are mandatory for Project Seal delivery work.

## Git Commit Rule

When an agent changes any non-ignored project file, the change must be committed to git and pushed to the tracked remote branch after the relevant verification passes.

Applies to:

- Runtime source code.
- Project documentation.
- Character packs and runtime art assets.
- Non-ignored generated Meowa outputs.
- QA reports and milestone acceptance documents.

Does not apply to:

- Files ignored by `.gitignore`.
- Raw private owner photos under ignored intake folders.
- API keys, local secrets, local caches, `node_modules`, build output, or temporary QA output.

Commit rules:

- Check `git status` before and after the work.
- Do not commit secrets or ignored private source photos.
- Include all non-ignored files that belong to the completed delivery.
- If unrelated user work is present, do not overwrite it; either leave it untouched or call it out before committing.
- Use a concise commit message that names the milestone or delivery.
- Push the commit to the tracked remote branch immediately after a successful commit.
- Stop before push only if secrets, private raw photos, unrelated user work, merge conflicts, authentication failure, or remote rejection is detected.
- After push, confirm `git status -sb` shows the local branch is aligned with its remote tracking branch.

## Dashboard Update Rule

The HTML dashboard is the primary project-management entry point.

When any milestone document, GDD, PRD, QA report, art asset, art metadata, or planning document changes, run:

```powershell
npm.cmd run dashboard
```

This regenerates:

- `docs/project-dashboard/index.html`
- `docs/project-dashboard/art-assets-status.json`

The dashboard must be committed and pushed together with the underlying project change so the HTML view stays current.
## Meowa Art Direction Rule

All Meowa art prompts must be created or approved by one unified Art Director role before generation.

The Art Director owns:

- The project art bible and visual consistency.
- Character trait extraction from owner-provided references.
- Positive prompts, negative prompts, and prompt variants.
- Outfit, silhouette, palette, and proportion consistency.
- Selection criteria for candidates before implementation.
- Recording prompt intent, Meowa job IDs, and remaining credit after generation.

Implementation agents must not casually rewrite Meowa prompts. They can request a prompt from the Art Director, run the approved prompt, process outputs, and implement the selected assets.

For every Meowa generation batch, record:

- Source reference path.
- Art Director brief or prompt summary.
- Template/model used.
- Job IDs.
- Output paths.
- Remaining Meowa credit.
- Owner selection or rejection notes.

## Art QA Rule

Any visual or animation change must run screenshot QA before handoff.

Required checks:

- Build or prepare the exact renderer output being handed off.
- Launch an Electron QA window or equivalent runtime preview.
- Capture a screenshot.
- Confirm the intended character is visible at runtime size.
- Confirm key visual traits are visible.
- Confirm no fallback character, old UI, or debug label is covering the pet.
- Show or attach the screenshot before asking for owner acceptance.
