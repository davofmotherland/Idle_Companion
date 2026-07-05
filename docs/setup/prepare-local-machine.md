# Prepare Local Machine

## Required Installs

Install these before development can run locally:

1. Node.js LTS.
2. Git for Windows.
3. A code editor such as VS Code or Cursor.

After installing, restart the terminal and verify:

```powershell
node --version
npm --version
git --version
```

## First Install After Tools Are Ready

From the project folder:

```powershell
npm install
npm run dev
```

## Optional Installs

- Aseprite for pixel art.
- LibreSprite or Krita as free alternatives.
- ComfyUI only when testing the advanced image generation pipeline.

## Accounts

- GitHub account and private repository.
- Steamworks Partner account when preparing store/release work.

## Current Environment Check

Initial check did not expose `node`, `npm`, `git`, or `winget` in the terminal environment.

Current installed portable tools:

- Node.js: `v24.16.0`
- npm: `11.13.0`
- Git for Windows: `2.54.0.windows.1`
- Node path: `C:\Users\ASUS\DeveloperTools\nodejs`
- Git path: `C:\Users\ASUS\DeveloperTools\PortableGit\cmd`

PowerShell may block `npm.ps1` because script execution is disabled. Use `npm.cmd` in this environment when running npm commands.

## Project Setup Status

Completed:

- Project dependencies installed with `npm install`.
- `package-lock.json` generated.
- TypeScript check passes with `npm run typecheck`.
- Local Git repository initialized on branch `main`.

Known notes:

- npm audit reports indirect dependency vulnerabilities from the Electron packaging toolchain. Do not run `npm audit fix --force` blindly because it can introduce breaking upgrades.
- If a shell still cannot find `node`, `npm.cmd`, or `git`, use a new terminal session or call the portable tool paths directly.
