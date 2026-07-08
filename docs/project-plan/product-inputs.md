# Product Inputs

## Current Decisions

| Item | Decision |
| --- | --- |
| Temporary project name | Project Seal |
| Current use target | Personal-use desktop pet, not public Steam sale |
| Default pet direction | White baby seal remains the mascot placeholder / first-party character direction |
| Current active character | `photo_001_travel_girl` |
| Language scope | Chinese-first personal use, bilingual-ready where UI text is centralized |
| Monetization | None for current scope |
| Distribution target | Local Windows build for personal use and iteration |
| Visual style | Cute Q-version pixel art with desktop-pet readable proportions |

## Product Position

Project Seal is now a personal-use, offline-first pixel desktop pet. The product should feel closer to a modern, private, lightweight QQ Pet-style companion than a commercial Steam SKU.

The core value is not store readiness. The core value is a cute pet that lives on the desktop, exposes QQ Pet-like needs only when hovered, reacts to interaction, and can later imitate the speaking style of an imported WeChat chat-history subject for private conversation.

## Immediate Implications

- Remove Steam sale, USD 1 pricing, store capsule, and public launch assumptions from active planning.
- Keep Windows/Electron/PixiJS as the active runtime stack.
- Preserve the existing art pipeline, but route all Meowa prompts through the unified Art Director.
- Confirm final pixel proportions before commissioning UI art.
- Design UI as a small pixel UI kit that matches the pet scale, not a normal app panel.
- Runtime should show only the pet by default; hover reveals health, mood, hunger, and money.
- Double-click should open a compact conversation box.
- WeChat chat imports are personal data and must remain local/private unless the owner explicitly exports them.
