# M1 Desktop Shell Acceptance

## Goal

M1 proves that Project Seal can exist as a desktop pet shell on Windows. It does not need final art, AI, settings UI, photo import, or Steam packaging.

## What Is Included

- Electron desktop shell.
- Transparent frameless window.
- Always-on-top pet window.
- Draggable pet window.
- System tray menu.
- Show, hide, and exit controls.
- PixiJS renderer.
- Temporary white baby seal placeholder.

## How To Run

From the project folder:

```powershell
npm.cmd run dev
```

If the shell cannot find npm, use:

```powershell
& "C:\Users\ASUS\DeveloperTools\nodejs\npm.cmd" run dev
```

## User Acceptance Checklist

Pass M1 only if all required checks pass.

| Check | Required Result |
| --- | --- |
| Launch | Running the dev command opens Project Seal without a crash |
| Transparency | The app window has no normal rectangular background |
| Always-on-top | The seal stays above other normal windows |
| Drag | Dragging the seal area moves the pet window |
| Tray show/hide | The tray menu can hide and show Project Seal |
| Tray exit | The tray menu can fully exit the app |
| Close behavior | Closing the window hides it instead of losing control of the process |
| Placeholder art | The visible placeholder clearly suggests a white baby seal |
| Taskbar behavior | The app does not create a normal taskbar workflow requirement |

## Non-Blocking Issues For M1

These can be accepted and moved to later milestones:

- Placeholder art is not final.
- No click/poke reaction yet.
- No settings panel yet.
- No language toggle yet.
- No save/restore position yet.
- No click-through/lock mode yet.
- No Steam build yet.
- Earlier builds warned about `#` in the folder name. The project folder has since been renamed to `Project Seal`, so this warning should no longer appear.

## Fail Conditions

M1 fails if:

- The app cannot launch.
- The window shows an opaque rectangular background.
- The user cannot exit from tray/menu.
- The pet cannot be moved at all.
- The process stays running after using Exit.
- The prototype is too visually ambiguous to recognize as Project Seal's white seal direction.

## Troubleshooting

If the terminal says `Error: Electron uninstall`, the Electron npm package exists but its runtime binary is missing. Verify with:

```powershell
Test-Path node_modules/electron/dist/electron.exe
```

It should return `True`. This project has already been repaired once by extracting the cached Electron runtime into `node_modules/electron/dist` and writing `node_modules/electron/path.txt`.

If the dev command leaves Electron or Node processes running after a failed launch, close them from the tray first. If needed, stop only project-owned processes from Task Manager.

If the terminal says `Failed to load url /src/renderer/renderer.ts`, make sure all old Project Seal/Electron processes are closed and restart `npm.cmd run dev`. The renderer entry has been moved to `src/renderer/renderer.ts` and the HTML now loads `./renderer.ts`.

## Owner Review Notes

When reviewing M1, focus on desktop shell viability, not final visual polish. If the shell feels controllable and safe, move to M2 and build the pet runtime/state machine.
