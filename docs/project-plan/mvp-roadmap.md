# MVP Roadmap

## Product Goal

Build Project Seal, a Windows-first offline Steam desktop pet centered on a cute white baby seal. The first release should be bilingual, priced around USD 1, and prove the core emotional loop before expanding into deeper AI or advanced customization.

## Core Loop

1. Pet idles on the desktop.
2. Player interacts with pet or scene objects.
3. Pet reacts with animation, expression, sound, and short text.
4. Mood, energy, hunger, and affection change.
5. New small behaviors or scene props unlock over time.
6. Player can customize appearance and share screenshots or clips.

## Six-Week MVP Plan

| Week | Goal | Deliverables |
| --- | --- | --- |
| 1 | Desktop foundation | Transparent window prototype, draggable seal, tray exit/settings, renderer proof, first recording |
| 2 | Pet runtime | State machine, animation player, idle/walk/sleep/poke/drag reactions, mood/energy/affection values |
| 3 | Character packs | Character directory format, animation fallback, default seal, 1-2 replacement skins |
| 4 | Photo-to-pixel MVP | Import image, crop, pixelize, palette limit, template body, preview, save as custom character |
| 5 | AI + scene slice | Local model bridge, persona prompt, basic chat bubble, no-network fallback, bed/toy/food props |
| 6 | Steam candidate | Settings, packaged Windows build, smoke test checklist, store asset draft, performance pass |

## Acceptance Criteria

The MVP is acceptable when:

- The pet can run for two hours without crashing.
- The app can be closed clearly from tray/menu.
- The pet does not block normal desktop use by default.
- Idle CPU/GPU usage is low enough for everyday background use.
- The default pet clearly reads as a white baby seal at desktop size.
- At least six animation states are implemented.
- Imported images can become a usable pixel avatar preview.
- The local AI feature works offline or is cleanly disabled when no model is installed.
- A Windows build can be launched from a Steam-like install folder without developer tooling.

## First Release Feature Set

Keep:

- Default white baby seal pixel pet.
- Basic appearance replacement.
- Small desktop scene.
- Local chat or fallback character replies.
- Settings and save.
- Steam offline build.

Cut if timeline slips:

- Full generated animation sheets.
- Multi-character collection.
- Steam Workshop.
- Complex item economy.
- Achievements.
- Mac/Linux.

## State Machine

Use a finite state machine for the first version. Do not start with a behavior tree unless the interaction system becomes too complex.

| State | Trigger | Notes |
| --- | --- | --- |
| Idle | Default fallback | Can randomly branch into walk, blink, sit, or sleep |
| Walk | Idle timer or scene target | Low priority, interruptible |
| Sleep | Low energy or long inactivity | Click can wake the pet |
| Dragged | User drags pet | Highest priority |
| Happy | Positive interaction | Short duration reaction |
| Annoyed | Repeated poke or bad timing | Keep cute, not hostile |
| Eating | Food prop used | Changes mood/energy/hunger |
| Playing | Toy prop used | Changes mood/affection/energy |
| Talking | User asks question | Locks animation until reply or timeout |

Priority order:

1. Dragged.
2. Talking.
3. Eating or Playing.
4. Happy or Annoyed.
5. Sleep.
6. Walk.
7. Idle.

## Data Schemas

Character pack:

```json
{
  "id": "default_seal",
  "name": "Seal",
  "scale": 3,
  "theme": "white_baby_seal",
  "animations": {
    "idle": "default_seal_idle.png",
    "walk": "default_seal_walk.png",
    "sleep": "default_seal_sleep.png",
    "happy": "default_seal_happy.png",
    "dragged": "default_seal_dragged.png"
  },
  "personality": {
    "tone": "cute_bilingual",
    "catchphrases": ["arf!", "hello!"]
  }
}
```

Pet save:

```json
{
  "activeCharacterId": "default_seal",
  "mood": 70,
  "energy": 80,
  "affection": 12,
  "hunger": 30,
  "lastPlayedAt": "2026-06-17T10:00:00+08:00",
  "unlockedCharacters": ["default_seal"],
  "customCharacters": []
}
```
