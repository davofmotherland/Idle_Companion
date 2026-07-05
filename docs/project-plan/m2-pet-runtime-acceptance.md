# M2 Pet Runtime Acceptance

## Goal

M2 proves that Project Seal has a basic pet runtime, not only a desktop shell. The seal should idle, move, sleep, react to pokes, react to dragging, update simple values, and remember its position/basic state after restart.

## What Is Included

- Finite state machine.
- States: `idle`, `walk`, `sleep`, `dragged`, `poke`, `happy`, `annoyed`.
- Pointer-based drag handling.
- Main-process cursor-follow dragging for mixed-resolution multi-monitor setups.
- Click/poke recognition.
- Repeated-poke annoyed reaction.
- Mood, energy, affection, and hunger values.
- Debug state label and mini value bars.
- Runtime save file in Electron user data.
- Window position persistence.

## How To Run

From the project folder:

```powershell
cd "C:\Users\ASUS\Desktop\Project Seal"
npm.cmd run dev
```

If npm is not found:

```powershell
& "C:\Users\ASUS\DeveloperTools\nodejs\npm.cmd" run dev
```

## User Acceptance Checklist

| Check | Required Result |
| --- | --- |
| Launch | Project Seal launches without terminal errors |
| Idle | The seal has a visible idle breathing motion |
| Walk | Waiting a few seconds causes a visible walk/sway state |
| Sleep | Leaving it alone long enough causes sleep with closed eyes / sleep bubbles |
| Wake | Clicking a sleeping seal wakes it into a reaction state |
| Dragged | Dragging the seal changes the state label to `DRAGGED` and moves the window |
| Poke | A click without dragging changes state to `POKE` |
| Happy | Releasing after a drag or gentle interaction can show `HAPPY` |
| Annoyed | Repeated rapid pokes show `ANNOYED` |
| Values | The bottom label shows `M`, `E`, `A`, `H` values and they change with interactions |
| No stuck state | After interactions, the seal returns to idle/walk/sleep naturally |
| Position save | Move the seal, exit, relaunch; it should reopen near the moved position |
| Mixed-resolution multi-monitor | Drag the seal between two monitors with different resolutions/scaling | The seal remains visible, draggable, correctly transparent, and does not jump off-screen |
| Build health | `npm.cmd run typecheck` and `npm.cmd run build` pass |

## Expected Timing

- Poke reaction: immediate.
- Annoyed reaction: after several rapid clicks.
- Walk/idle changes: within a few seconds.
- Sleep: after roughly 12 seconds of no interaction or low energy.

## Cross-Monitor Fix Notes

Dragging is now handled by the Electron main process using `screen.getCursorScreenPoint()` and all-display work areas. This avoids relying on renderer `screenX/screenY`, which can become inconsistent across monitors with different resolution or scaling.

Re-test mixed-resolution monitors by dragging the seal:

1. From primary monitor to secondary monitor.
2. From secondary monitor back to primary monitor.
3. Across the top and side edges between displays.
4. Near taskbar edges.
5. Exit and relaunch after placing it on the secondary monitor.

## Non-Blocking Issues For M2

These can be accepted and moved to later milestones:

- Placeholder art is still not final.
- State label/debug values are visible; they can be hidden or redesigned later.
- The walk state is an in-window sway, not full autonomous screen walking yet.
- Position persistence is basic and may not handle every multi-monitor edge case.
- No final settings UI.
- No scene props.
- No AI/chat.

## Fail Conditions

M2 fails if:

- The app cannot launch.
- Dragging no longer moves the pet.
- Clicking no longer produces any visible reaction.
- Repeated interaction can permanently freeze the pet state.
- Exit from tray/menu stops working.
- Restart loses the moved window position every time.
- Moving between different-resolution monitors makes the seal disappear, become unclickable, or reopen off-screen.

## Owner Review Notes

Focus on whether the seal now feels alive enough to justify moving to M3 character-pack and art work. Visual polish is still secondary, but the runtime must be controllable, recover from repeated interactions, and never feel unsafe on the desktop.
