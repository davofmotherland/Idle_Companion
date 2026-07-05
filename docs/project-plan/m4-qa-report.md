# M4 QA Report - Photo-To-Pixel Customization

## Result

Recommendation: Owner verification pending

Blockers: None

Major issues: None

Minor issues: None

## Commands

- `npm.cmd run typecheck`: Pass
- `npm.cmd run build`: Pass

## Automated Checks

| Check | Result | Notes |
| --- | --- | --- |
| M4 docs exist | Pass | `m4-photo-to-pixel-acceptance.md` and `m4-local-privacy-note.md` exist |
| Main IPC save entry | Pass | `runtime:save-custom-character` exists |
| User data custom character root | Pass | Custom characters are saved under Electron `userData/custom-characters` |
| Custom manifest, preview, metadata write | Pass | Writes `manifest.json`, `preview.png`, and `art-metadata.json` |
| Character pack listing | Pass | Scans built-in character packs and user custom packs |
| Preload API | Pass | Exposes `saveCustomCharacter` |
| Renderer UI | Pass | Import, Save, preview canvas exist; preview uses template generation (Bug 2 fixed) |
| Local image read | Pass | Uses local `FileReader.readAsDataURL` |
| Template preview | Pass | Now always generates template from sourceImage via generateTemplatePixelCharacter; no stale preview loading (Bug 2 fixed) |
| Custom character restore | Pass | getActiveCharacter() no longer skips custom_ prefixed IDs (Bug 1 fixed) |
| Palette extraction | Pass | Samples the local photo for palette/accent hints |
| Save flow call | Pass | Calls `window.desktopPet.saveCustomCharacter(...)` |
| Local privacy | Pass | Static check found no upload/network path in the import flow |

## Owner Confirmation Required (M4 Re-verification)

请在本地运行 `npm.cmd run dev` 后逐项确认：

| # | 验收项 | 期望结果 | 通过？ |
|---|--------|----------|--------|
| 1 | 启动界面 | 画面有像素模板小人（鲍勃发型+耳机），底部有 Import 按钮，Save 按钮灰色不可点 | ☐ |
| 2 | 像素小人标准 | 预览框内是 Q 版人物模板（有头发、耳机、身体轮廓），**不是海豹，也不是照片直接像素化** | ☐ |
| 3 | 导入正常图片 | 点 Import → 选照片 → 预览框出现**受照片调色板影响的模板小人**（颜色变了，形状仍是模板人物） | ☐ |
| 4 | Save 按钮激活 | 导入图片后 Save 按钮变为可点击 | ☐ |
| 5 | 保存角色 | 点 Save → 底部 label 变为 `Custom Character` → 主画面切换为保存的角色 | ☐ |
| 6 | 重启持久化 | 关闭并重新运行 → 自定义角色仍然是激活状态（Bug 1 修复验证） | ☐ |
| 7 | 交互状态 | 点击(poke)、拖动、睡眠状态动画仍正常 | ☐ |
| 8 | 离线验证 | 断网时 Import + Save 流程正常，无网络报错 | ☐ |
| 9 | 异常图片 | 上传非图片文件 → 不崩溃，小人变为 annoyed | ☐ |
| 10 | 构建验证 | `npm.cmd run typecheck` 和 `npm.cmd run build` 成功 | ☐ |

## Notes

Bug 1 (getActiveCharacter custom character skip) and Bug 2 (useApprovedBaselinePreview stale preview loading) both fixed. Owner must re-verify the two original rejection reasons: (1) template character standard and (2) photo-to-palette copy effect on the template character.
