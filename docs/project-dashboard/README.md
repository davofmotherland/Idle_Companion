# Project Dashboard

Open `index.html` in a browser to manage Project Seal from one place.

The dashboard includes:

- Project overview.
- GDD.
- PRD.
- Milestones.
- QA reports.
- Technical/process documents.
- Art asset tracking.

Regenerate after project changes:

```powershell
cd "C:\Users\ASUS\Desktop\Project Seal"
npm.cmd run dashboard
```

Art asset status options:

- 未制作
- 占位资源
- 正式资源

Rule: every existing art asset remains `占位资源` until the owner confirms final shipping quality.

The status selectors in the HTML page are useful for local review. Browser-side edits are stored in localStorage. To persist them into the repository, export the JSON from the dashboard and ask Codex to sync it into `art-assets-status.json`.
