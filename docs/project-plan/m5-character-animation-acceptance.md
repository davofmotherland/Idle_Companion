# M5 Character Animation MVP Acceptance

## Goal

M5 proves that the current photo-commission character is no longer a single static sprite. The desktop pet must use a small set of state-based animation frames generated through the approved Meowa pipeline, and the result must be verified by an actual Electron screenshot before owner acceptance.

## Product Scope

M5 is not a full animation production pass. It is the minimum animation layer required for the MVP character to feel alive at desktop size.

Included states:

- `idle`: 4 frames for breathing/blink-level motion.
- `walk`: 4 frames for small footstep/body sway motion.
- `sleep`: 2 frames for sleepy/resting motion.
- `happy`: 2 frames for positive reaction.
- `poke`: reuses the `happy` reaction frames for MVP.
- `annoyed`: reuses the `happy` reaction frames for MVP until a separate annoyed expression is commissioned.
- `dragged`: reuses idle frames with light whole-sprite tilt as interaction feedback.

## Current Character Direction

The accepted MVP character is the small top-right candidate from `photo-001-style-candidates-v1.png`, not the taller top-left candidate and not the rejected all-black pants Meowa candidate.

Required visual identity:

- Brown knit beanie.
- Black sunglasses.
- Long brown hair.
- Black leather jacket.
- White inner shirt.
- Blue jeans.
- Small chibi pixel proportions.

Do not change the selected candidate, outfit palette, or proportions without owner approval.

## Implemented Assets

Character pack:

```text
assets/characters/photo_001_travel_girl/
```

Runtime frames:

```text
assets/characters/photo_001_travel_girl/animations/idle-0.png
assets/characters/photo_001_travel_girl/animations/idle-1.png
assets/characters/photo_001_travel_girl/animations/idle-2.png
assets/characters/photo_001_travel_girl/animations/idle-3.png
assets/characters/photo_001_travel_girl/animations/walk-0.png
assets/characters/photo_001_travel_girl/animations/walk-1.png
assets/characters/photo_001_travel_girl/animations/walk-2.png
assets/characters/photo_001_travel_girl/animations/walk-3.png
assets/characters/photo_001_travel_girl/animations/sleep-0.png
assets/characters/photo_001_travel_girl/animations/sleep-1.png
assets/characters/photo_001_travel_girl/animations/happy-0.png
assets/characters/photo_001_travel_girl/animations/happy-1.png
```

Preview sheet:

```text
assets/characters/photo_001_travel_girl/animation-preview.png
```

## Meowa Jobs

V2 art director pass is the implemented runtime asset set. V1 jobs are retained as earlier reference only.

| Purpose | Job ID |
| --- | --- |
| Pixel cleanup | `pixelate-24ba85fcfc014135b085ea4db4ed49f5` |
| Idle animation | `dbb0b282-aa1c-47a7-a5a3-8634b3dd6ff7` |
| Walk animation | `67570b77-cd6e-4854-b501-0474fe284acd` |
| Sleep animation | `3d59e8e0-7e7a-46d2-a173-5784a19cd65c` |
| Happy/poke animation | `3888b7e2-380e-4ce3-8249-9cc8ceae5fe2` |

| V2 Purpose | Job ID |
| --- | --- |
| V2 idle animation | `c7f196e1-5abe-4ca4-90df-e92e2e3d338d` |
| V2 walk animation | `ab2e205c-bc4b-489a-8cf1-45dce17396ca` |
| V2 sleep animation | `d948e35e-d50c-403f-8031-ee84ef081fd3` |
| V2 happy/poke animation | `84149964-d804-4ebd-9ad6-d6fa1d2ea2e6` |

## How To Run

```powershell
cd "C:\Users\ASUS\Desktop\Project Seal"
npm.cmd run dev
```

## User Acceptance Checklist

| Check | Required Result |
| --- | --- |
| Launch | App starts without terminal error |
| Character visible | Small brown-beanie sunglasses character is visible on desktop |
| Correct candidate | Character matches the top-right small candidate direction, not the top-left tall candidate |
| Outfit lock | Black leather jacket, white shirt, and blue jeans remain visible |
| No debug obstruction | No import/save UI or debug label blocks the character |
| Idle animation | Character subtly changes frames while idle |
| Walk animation | Character uses walk frames during walk state, not only whole-sprite movement |
| Sleep animation | Character switches to sleep/rest frames after inactivity or low-energy state |
| Poke/happy animation | Clicking the pet triggers the happy/poke reaction frames |
| Drag feedback | Dragging remains responsive; light whole-sprite tilt is acceptable only as drag feedback |
| Pixel quality | Runtime art remains crisp and readable at desktop size |
| Screenshot QA | Electron screenshot QA shows the character on screen before handoff |
| Build health | `npm.cmd run typecheck`, `npm.cmd test`, and `npm.cmd run build` pass |

## Non-Blocking Issues For M5

- `annoyed` reuses happy/poke frames until a dedicated annoyed expression is generated.
- `dragged` reuses idle frames with renderer tilt instead of dedicated dragged art.
- Motion quality is MVP-level; a later art pass can improve frame-to-frame polish.
- QA screenshot script is currently a local harness under `C:\tmp\project-seal-qa`, not a committed automated test.

## Fail Conditions

M5 fails if:

- The app launches but no character is visible.
- The character falls back to the seal unexpectedly.
- The character uses the rejected all-black outfit candidate.
- The character uses the wrong top-left candidate after owner selected the top-right one.
- The pet only moves/rotates the whole sprite for idle, walk, sleep, and happy/poke states.
- The debug label or old import/save UI blocks the character.
- Screenshot QA is skipped before handoff.
