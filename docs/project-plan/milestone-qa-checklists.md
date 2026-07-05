# Milestone QA Checklists

## How To Use This Document

Use this as the owner-side QA checklist before accepting each milestone. A milestone should not be accepted if any required check fails.

From M2 onward, each milestone follows this gate:

1. Implementation is marked ready.
2. QA Tester runs the relevant checklist.
3. QA Tester reports pass/fail status and reproduction steps.
4. Owner performs final acceptance.

QA Tester should mark hardware-dependent checks as "owner confirmation required" when the subagent cannot directly observe the user's machine, monitors, or input devices.

Severity guide:

- Blocker: must be fixed before accepting the milestone.
- Major: should be fixed unless explicitly deferred by owner.
- Minor: can be accepted and tracked for later.

## M0: Product Lock QA

Goal: Confirm the team is aligned before implementation.

| Check | How To Verify | Pass Criteria | Severity |
| --- | --- | --- | --- |
| Product name locked | Open `docs/project-plan/product-inputs.md` | Project name is `Project Seal` | Blocker |
| Default pet locked | Open product inputs and M0 product lock | Default pet is white baby seal | Blocker |
| Platform locked | Open M0 product lock | Windows-first and Steam offline are stated | Blocker |
| Price locked | Open product inputs | Target price is about USD 1 | Major |
| Language scope locked | Open product inputs | First release is bilingual | Major |
| MVP non-goals listed | Open `docs/project-plan/m0-product-lock.md` | Workshop, online accounts, cloud, complex AI, and non-Windows are excluded | Blocker |
| Toolchain works | Run `node --version`, `npm.cmd --version`, `git --version` | All commands return versions | Blocker |
| Project compiles | Run `npm.cmd run typecheck` | Typecheck passes | Blocker |
| Git exists | Run `git status --short` | Command works without repository error | Major |

Accept M0 when:

- All blocker checks pass.
- Any missing art/reference material is documented as non-blocking for M1.

## M1: Desktop Shell Prototype QA

Goal: Confirm Project Seal can exist safely as a desktop pet shell.

Run:

```powershell
cd "C:\Users\ASUS\Desktop\Project Seal"
npm.cmd run dev
```

| Check | How To Verify | Pass Criteria | Severity |
| --- | --- | --- | --- |
| Launch | Run dev command | App starts without terminal error | Blocker |
| Window appears | Look at desktop after launch | Seal placeholder is visible or can be shown from tray | Blocker |
| Transparency | Look behind the seal | No opaque rectangular app background | Blocker |
| Always-on-top | Put another normal window under/over it | Seal remains above normal windows | Major |
| Drag | Drag the seal area | Pet window moves | Blocker |
| Tray icon exists | Check system tray | Project Seal tray icon/menu is present | Major |
| Show/hide | Use tray menu | Hide removes pet; Show restores it | Blocker |
| Exit | Use tray menu Exit | App fully exits and terminal/dev process ends or can be stopped cleanly | Blocker |
| Close behavior | Click window close if visible through OS control path | App hides or exits safely; no lost process | Major |
| Placeholder readability | Inspect at normal desktop size | It reads as a white baby seal direction | Major |
| Build health | Run `npm.cmd run build` | Build passes | Major |

Acceptable in M1:

- No click reaction.
- No state machine.
- No final art.
- No settings panel.
- No saved position.
- No Steam package.

Reject M1 if:

- The app does not launch.
- The pet cannot be moved.
- The tray cannot exit the app.
- The window is opaque or visually blocks desktop use.

## M2: Pet Runtime QA

Goal: Confirm the seal behaves like a living desktop pet.

| Check | How To Verify | Pass Criteria | Severity |
| --- | --- | --- | --- |
| Idle state | Launch and wait | Seal idles without freezing | Blocker |
| Walk/move state | Wait for auto behavior or trigger move | Seal visibly changes position or animation state | Major |
| Sleep state | Trigger low energy or wait for inactivity | Seal enters sleep and can wake | Major |
| Dragged state | Drag seal | Drag state overrides other states cleanly | Blocker |
| Poke/click reaction | Click or poke seal | Seal visibly reacts | Blocker |
| Happy/annoyed reactions | Repeat positive and repeated click interactions | Reactions differ and feel readable | Major |
| State priority | Drag while another action is active | High-priority state wins and returns safely | Blocker |
| No stuck states | Interact repeatedly for 5 minutes | Seal never freezes in invalid animation/state | Blocker |
| Basic values | Inspect UI/debug display/save if available | Mood/energy/affection/hunger update as designed | Major |
| Position persistence | Move pet, restart app | Pet position is restored or documented if deferred | Major |
| Mixed-resolution multi-monitor | Drag pet between monitors with different resolutions/scaling, then restart on the secondary monitor | Pet remains visible, draggable, correctly transparent, and does not reopen off-screen | Major |
| Idle performance | Leave app running 15 minutes | No obvious CPU/GPU spike, no memory runaway | Major |

Acceptable in M2:

- Placeholder art can still be used.
- AI/chat can remain stubbed.
- Scene props can be absent.

Reject M2 if:

- State machine gets stuck.
- Drag/poke breaks the app.
- Pet behavior feels uncontrollable or disruptive.
- Cross-monitor movement makes the pet disappear, become unclickable, or reopen off-screen.

## M3: Character Pack + Seal Art Pass QA

Goal: Confirm the default seal and character packs are data-driven.

| Check | How To Verify | Pass Criteria | Severity |
| --- | --- | --- | --- |
| Manifest loading | Launch with default character manifest | Default seal loads from manifest | Blocker |
| Missing animation fallback | Temporarily remove or rename optional animation in test pack | App falls back without crash | Blocker |
| Character swap | Add/select a second test pack | Character can change without code edits | Major |
| Seal readability | View on light and dark backgrounds | White seal remains visible and cute | Blocker |
| Pixel scaling | Inspect at common desktop scaling | Pixel art remains crisp, not blurry | Major |
| Animation naming | Compare art files to manifest | Names match documented schema | Major |
| Art source tracking | Check asset folder | Source/metadata exists for official art | Major |
| Bilingual personality metadata | Inspect manifest | Character has fields for bilingual tone/replies | Minor |

Acceptable in M3:

- Replacement skins can be rough.
- Not all 12 animation actions need final polish if core actions work.

Reject M3 if:

- A bad/missing asset crashes the app.
- The default seal does not read as a white baby seal.
- Adding a character requires code changes.

## M4: Photo-To-Pixel Customization QA

Goal: Confirm the customization hook works locally and safely.

Prepare:

- 3-5 test images in `assets/references/photo-to-pixel-tests/`.

| Check | How To Verify | Pass Criteria | Severity |
| --- | --- | --- | --- |
| Import image | Use supported image formats | Image loads without crash | Blocker |
| Template generation | Import image and preview result | Output uses the built-in Q-version pixel character template | Blocker |
| Photo influence | Compare several different photos | Output palette/accent changes based on input, without becoming a raw photo crop | Major |
| Palette limit | Inspect output | Colors are controlled and not noisy | Major |
| Save custom result | Save generated character | Result appears in selectable custom list | Blocker |
| Select custom result | Apply saved result | Pet uses the generated template character | Blocker |
| Bad image handling | Try tiny/huge/invalid image | App gives graceful error, no crash | Blocker |
| Local privacy | Disconnect network or inspect flow | Image processing does not require upload | Blocker |
| Repeat generation | Generate several times | No stale preview or overwritten wrong file | Major |

Acceptable in M4:

- Output does not exactly resemble the input person/pet.
- Full animation generation can be absent.
- Manual crop UI can be absent if center sampling is documented.

Reject M4 if:

- Imported images can crash the app.
- Saved custom assets disappear after restart.
- The result is only a recolored seal.
- The result is only a raw pixelated photo crop instead of the built-in character template.
- The feature implies exact likeness but cannot deliver it.

## M5: AI + Scene Interaction QA

Goal: Confirm simple props and offline-safe chat support the seal fantasy.

| Check | How To Verify | Pass Criteria | Severity |
| --- | --- | --- | --- |
| Bed prop | Click/use bed | Seal reacts with rest/sleep behavior | Major |
| Toy prop | Click/use toy | Seal reacts with play behavior | Major |
| Food prop | Click/use food | Seal reacts with eat/happy behavior | Major |
| Prop effects | Inspect values/UI/debug if available | Mood/energy/affection/hunger change correctly | Major |
| Chat entry | Send simple message | Seal replies or fallback appears | Blocker |
| Offline behavior | Disable network and use chat | App still works or clean fallback appears | Blocker |
| Model missing behavior | Remove/disable model if applicable | App does not crash; fallback replies work | Blocker |
| Timeout/cancel | Trigger slow response if possible | UI recovers and pet returns to normal state | Major |
| Talking state | Chat while pet is moving/sleeping | Talking state enters/exits cleanly | Major |
| Tone | Review replies | Replies feel cute, short, and bilingual-ready | Minor |

Acceptable in M5:

- AI can be mock/fallback-only if local model is not ready.
- Props can use placeholder art.

Reject M5 if:

- Chat failure breaks the pet runtime.
- Offline use is blocked.
- Props feel disconnected or do not trigger visible reactions.

## M6: Steam Candidate QA

Goal: Confirm the MVP can be packaged and reviewed as a Steam candidate.

| Check | How To Verify | Pass Criteria | Severity |
| --- | --- | --- | --- |
| Clean package | Run Windows package script | Build artifact is created | Blocker |
| Fresh install/launch | Launch packaged app outside dev environment | App starts without dev tools | Blocker |
| Offline launch | Disconnect network and launch | App works offline | Blocker |
| Exit path | Use tray/menu Exit | App exits fully | Blocker |
| Settings | Change key settings and restart | Settings persist | Blocker |
| Save data | Move/interact/customize, restart | Save data persists | Blocker |
| Two-hour idle | Leave app running | No crash, runaway CPU/memory, or stuck state | Blocker |
| Low-spec smoke | Test on a lower-spec Windows machine if available | App remains usable | Major |
| Multi-monitor smoke | Test on different-resolution monitors if available | App remains visible and controllable across screens | Major |
| Store screenshots | Capture required scenes | Screenshots show real app, not only mockups | Major |
| Trailer capture | Record 30-45 seconds | Core loop and customization are visible | Major |
| Privacy wording | Review store/EULA text | Local image processing and offline behavior are clear | Major |
| Known issues | Open release notes/checklist | Known issues and cuts are documented | Major |

Acceptable in M6:

- Steam achievements can be absent.
- Cloud save can be absent.
- Workshop can be absent.

Reject M6 if:

- Packaged app cannot launch cleanly.
- Offline experience is broken.
- Exit/save/settings are unreliable.
- Store material overpromises features not in the build.

## Final MVP Acceptance

Accept the MVP only when:

- All M6 blocker checks pass.
- Any major failures are either fixed or explicitly deferred by owner.
- The app can be safely used as a desktop companion for a normal session.
- The default white baby seal is strong enough to carry the store page.
