# M0 Product Lock

## Status

M0 is the product lock milestone for Project Seal. It defines what the MVP is, what it is not, and what every subagent must respect before implementation begins.

Current status: ready for M1 after owner review.

## Locked Product Inputs

| Item | Decision |
| --- | --- |
| Project name | Project Seal |
| Default pet | White baby seal |
| Platform | Windows first |
| Release channel | Steam, offline buy-to-own version |
| First language scope | Bilingual |
| Target price | About USD 1 |
| Visual style | Cute Q-version pixel art |
| Core tech | Electron + PixiJS + TypeScript |
| AI stance | Local/offline first; never blocks core pet runtime |

## MVP Promise

Project Seal is a small, cute, offline desktop companion. The first version should make a white baby seal live on the user's desktop, react to simple interactions, support basic customization, and provide lightweight local chat or fallback character replies.

The MVP is not a full AI companion, full game, social platform, or asset marketplace.

## Target User Experience

The user should be able to:

1. Launch Project Seal.
2. See a readable white baby seal on the desktop.
3. Drag, poke, hide, show, and exit the pet safely.
4. Watch the seal idle, walk, sleep, and react.
5. Use a few small props such as bed, toy, and food.
6. Import an image and generate a usable pixel avatar/skin preview.
7. Use simple local chat or fallback seal replies.
8. Run the app offline without account or server dependency.

## Must-Have MVP Features

| Feature | Reason |
| --- | --- |
| Transparent always-on-top desktop pet window | Core desktop pet identity |
| Tray menu with show/hide/exit | Safety and user control |
| Drag/poke basic interaction | Immediate tactile feedback |
| Seal state machine | Makes the pet feel alive |
| Default white baby seal character | Main marketable identity |
| Character pack manifest | Enables replacement and later content |
| Basic photo-to-pixel avatar/skin flow | Main customization hook |
| Local save/settings | Required for daily use |
| Offline-safe chat or fallback replies | Supports companion fantasy without server cost |
| Windows package path | Required for Steam candidate |

## Explicit Non-Goals For MVP

- Steam Workshop.
- Cloud save.
- Online account.
- Multiplayer or social feed.
- Full AI image generation for every animation frame.
- Exact likeness generation from photos.
- Voice recognition.
- Voice synthesis.
- Multiple pets active at once.
- Mac/Linux support.
- Complex economy, quests, or achievements.

## Version Placement Rules For New Ideas

Use these buckets for future notes from the idea subagent:

| Bucket | Criteria |
| --- | --- |
| MVP | Needed to prove white seal desktop pet, customization, offline stability, or Steam viability |
| EA | Improves retention or shareability but can wait until after the first playable MVP |
| 1.0 | Requires stable systems, more content, or broader QA |
| DLC/Update | Mostly skins, props, actions, seasonal content, or cosmetic expansion |
| Later/Reject | Too expensive, too risky, not aligned with a USD 1 desktop pet, or dependent on online services |

## Default Seal Art Constraints

The white baby seal must:

- Read clearly at desktop size.
- Have a round silhouette.
- Use simple dark eyes and short flippers.
- Avoid pure white-only shading so it remains visible on bright desktops.
- Stay cute and low-friction, not noisy or overly detailed.
- Work at integer pixel scale.

Emergency art fallback:

- Use a simple seal-shaped pixel placeholder for M1/M2.
- Do not delay core window/runtime work waiting for final art.
- Do not reduce default seal quality for the Steam candidate; cut extra animations first.

## Bilingual Scope

MVP bilingual support should include:

- Core settings labels.
- Tray/menu labels if feasible.
- Short pet replies and fallback text.
- Store-facing feature wording later.

Implementation rule:

- Once UI text grows beyond prototypes, text must move into a central string table.
- Avoid hardcoding scattered bilingual strings throughout runtime code.

## AI Scope

AI is allowed only if it is fallback-safe.

MVP AI can include:

- Short seal-flavored replies.
- Local prompt/persona configuration.
- Timeout and cancel handling.
- Fallback canned replies when no model is present.

MVP AI must not:

- Block launch.
- Block pet animation.
- Require internet.
- Become the main gameplay system.
- Store sensitive imported images externally.

## Photo-To-Pixel Scope

The MVP should market this as pixel avatar/skin generation, not exact identity replication.

Must have:

- Import image.
- Crop or adjust source.
- Pixelize preview.
- Palette limit.
- Save result locally.

Can defer:

- High-quality AI redraw.
- Full-body recognition.
- Automated multi-frame generated animation.
- Celebrity/IP generation workflows.

## M0 Readiness Checklist

| Check | Status |
| --- | --- |
| Product name selected | Done |
| Default pet direction selected | Done |
| First language scope selected | Done |
| Target price selected | Done |
| Toolchain installed | Done |
| Project dependencies installed | Done |
| Typecheck passing | Done |
| Git repository initialized | Done |
| MVP milestone matrix written | Done |
| Reference images collected | Not required for M0; needed before final art pass |

## M1 Entry Criteria

M1 can begin when:

- Owner accepts this M0 product lock.
- Development continues from the desktop `Project #2` folder.
- Placeholder art is acceptable for the first shell prototype.

M1 does not require final seal art, Steam account, ComfyUI, or local model downloads.
