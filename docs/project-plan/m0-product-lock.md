# M0 Product Lock

## Status

M0 originally locked a Steam-oriented MVP. That target has now been superseded by the personal-use PRD/GDD refresh dated 2026-07-08.

Current active target: personal-use Windows desktop pet inspired by QQ Pet.

## Refreshed Product Inputs

| Item | Decision |
| --- | --- |
| Project name | Project Seal |
| Current use target | Personal use, not Steam sale |
| Default pet | White baby seal mascot/fallback direction |
| Active character | `photo_001_travel_girl` |
| Platform | Windows first |
| Distribution | Local personal build |
| Monetization | None for current scope |
| Visual style | Cute Q-version pixel art |
| Core tech | Electron + PixiJS + TypeScript |
| AI stance | Local/private first; never blocks core pet runtime |
| Core values | Health, mood, hunger, money |

## MVP Promise

Project Seal is a small, cute, offline desktop companion. The active version should make a pixel pet live quietly on the user's desktop, show QQ Pet-style status only on hover, react to simple interactions, and open a conversation box on double-click.

The MVP is not a public commercial release, full AI companion, social platform, cloud service, or asset marketplace.

## Target User Experience

The user should be able to:

1. Launch Project Seal.
2. See only the desktop pet during normal idle use.
3. Hover over the pet to see health, mood, hunger, and money.
4. Drag, poke, hide, show, and exit the pet safely.
5. Watch the pet idle, walk, sleep, and react.
6. Use simple food/toy/bed actions later.
7. Double-click to open a conversation box.
8. Import WeChat chat records later for local style distillation.
9. Run the app offline without account or server dependency.

## Must-Have MVP Features

| Feature | Reason |
| --- | --- |
| Transparent always-on-top desktop pet window | Core desktop pet identity |
| Tray menu with show/hide/exit | Safety and user control |
| Drag/poke basic interaction | Immediate tactile feedback |
| Pet state machine | Makes the pet feel alive |
| Character pack manifest | Enables replacement and future skins |
| Health/mood/hunger/money | QQ Pet-style care loop |
| Hover-only status UI | Keeps the desktop clean |
| Double-click chat shell | Entry point for personal conversation |
| Local save/settings | Required for daily personal use |
| Local/private data handling | Required for WeChat record import |

## Explicit Non-Goals For Current Scope

- Steam sale or store launch.
- Steam Workshop.
- Cloud save.
- Online account.
- Multiplayer or social feed.
- Public persona/chatbot sharing.
- Exact identity simulation claims.
- Voice recognition.
- Voice synthesis.
- Multiple pets active at once.
- Mac/Linux support.
- Complex economy, quests, or achievements.

## Version Placement Rules For New Ideas

Use these buckets for future notes from the idea subagent:

| Bucket | Criteria |
| --- | --- |
| MVP | Needed to prove quiet desktop pet, hover status, care values, double-click chat shell, local save |
| Next | Directly supports personal-use direction after MVP, such as WeChat import and UI kit |
| 1.0 Personal | Requires stable systems or broader QA for daily personal use |
| Content Update | Mostly skins, props, reactions, seasonal content, or cosmetic expansion |
| Later/Reject | Too expensive, too risky, online-dependent, or aimed at public commercial release |

## Bilingual Scope

The app remains bilingual-ready, but current personal use is Chinese-first. Once UI text grows beyond prototypes, text must move into a central string table.

## AI And WeChat Scope

AI is allowed only if it is local/private and fallback-safe.

Can include:

- Short pet replies.
- Local prompt/persona configuration.
- Local WeChat chat record parsing.
- Style distillation from a target person's chat history.
- Timeout and cancel handling.
- Fallback canned replies when no model/profile is present.

Must not:

- Block launch.
- Block pet animation.
- Require internet by default.
- Commit raw chat logs.
- Send chat records to external services without explicit owner approval.

## Art Scope

Before new UI implementation, the Art Director must lock the pet/UI pixel proportion system. Meowa UI kit prompts must come from the unified Art Director and must match the locked scale.

M0 does not require final seal art, final UI kit, WeChat parser, or local model downloads.
