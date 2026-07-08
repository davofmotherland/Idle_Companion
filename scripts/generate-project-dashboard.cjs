const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const planDir = path.join(root, 'docs', 'project-plan');
const dashboardDir = path.join(root, 'docs', 'project-dashboard');
const statusPath = path.join(dashboardDir, 'art-assets-status.json');
const outputPath = path.join(dashboardDir, 'index.html');

const STATUS = ['未制作', '占位资源', '正式资源'];

const docGroups = [
  {
    id: 'overview',
    label: '总览',
    files: ['product-inputs.md', 'mvp-roadmap.md', 'project-rules.md']
  },
  {
    id: 'gdd',
    label: 'GDD',
    files: ['project-seal-gdd.md']
  },
  {
    id: 'prd',
    label: 'PRD',
    files: ['project-seal-prd.md']
  },
  {
    id: 'milestones',
    label: 'Milestones',
    files: [
      'm0-product-lock.md',
      'm1-desktop-shell-acceptance.md',
      'm2-pet-runtime-acceptance.md',
      'm3-character-pack-acceptance.md',
      'm4-photo-to-pixel-acceptance.md',
      'm5-character-animation-acceptance.md',
      'mvp-milestones-and-agent-roles.md',
      'milestone-qa-checklists.md'
    ]
  },
  {
    id: 'qa',
    label: 'QA',
    files: ['qa-tester-process.md', 'm2-qa-report.md', 'm3-qa-report.md', 'm4-qa-report.md', 'm5-qa-report.md']
  },
  {
    id: 'tech',
    label: '技术/流程',
    files: ['technical-direction.md', 'team-and-agents.md', 'photo-commission-character-pipeline.md', 'art-and-ai-pipeline.md']
  }
];

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '') : '';
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inlineMarkdown(text) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

function markdownToHtml(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let inCode = false;
  let code = [];
  let inList = false;
  let i = 0;

  function closeList() {
    if (inList) {
      out.push('</ul>');
      inList = false;
    }
  }

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim().startsWith('```')) {
      closeList();
      if (!inCode) {
        inCode = true;
        code = [];
      } else {
        out.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`);
        inCode = false;
      }
      i += 1;
      continue;
    }
    if (inCode) {
      code.push(line);
      i += 1;
      continue;
    }

    if (/^\|.*\|$/.test(line.trim()) && i + 1 < lines.length && /^\|\s*-/.test(lines[i + 1].trim())) {
      closeList();
      const headers = line.trim().slice(1, -1).split('|').map((s) => s.trim());
      i += 2;
      const rows = [];
      while (i < lines.length && /^\|.*\|$/.test(lines[i].trim())) {
        rows.push(lines[i].trim().slice(1, -1).split('|').map((s) => s.trim()));
        i += 1;
      }
      out.push('<div class="table-wrap"><table><thead><tr>' + headers.map((h) => `<th>${inlineMarkdown(h)}</th>`).join('') + '</tr></thead><tbody>' + rows.map((row) => '<tr>' + row.map((cell) => `<td>${inlineMarkdown(cell)}</td>`).join('') + '</tr>').join('') + '</tbody></table></div>');
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      closeList();
      const level = Math.min(heading[1].length + 1, 5);
      out.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      i += 1;
      continue;
    }

    const bullet = line.match(/^\s*-\s+(.*)$/);
    if (bullet) {
      if (!inList) {
        out.push('<ul>');
        inList = true;
      }
      out.push(`<li>${inlineMarkdown(bullet[1])}</li>`);
      i += 1;
      continue;
    }

    if (!line.trim()) {
      closeList();
      i += 1;
      continue;
    }

    closeList();
    out.push(`<p>${inlineMarkdown(line.trim())}</p>`);
    i += 1;
  }
  closeList();
  if (inCode) {
    out.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`);
  }
  return out.join('\n');
}

function fileMtime(relativePath) {
  const full = path.join(root, relativePath);
  return fs.existsSync(full) ? fs.statSync(full).mtime.toISOString() : null;
}

function buildDocs() {
  return docGroups.map((group) => ({
    ...group,
    docs: group.files.map((file) => {
      const full = path.join(planDir, file);
      const markdown = read(full);
      return {
        file: `docs/project-plan/${file}`,
        exists: fs.existsSync(full),
        updatedAt: fileMtime(`docs/project-plan/${file}`),
        html: markdownToHtml(markdown || `# Missing\n\n${file} does not exist.`)
      };
    })
  }));
}

function collectFiles(dir, exts) {
  if (!fs.existsSync(dir)) return [];
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...collectFiles(full, exts));
    } else if (exts.includes(path.extname(entry.name).toLowerCase())) {
      result.push(full);
    }
  }
  return result;
}

function classifyAsset(relative) {
  if (relative.includes('/animations/')) return '角色动作帧';
  if (relative.includes('/assets/characters/') || relative.startsWith('assets/characters/')) return '角色资产';
  if (relative.includes('/assets/references/meowa/') || relative.startsWith('assets/references/meowa/')) return 'Meowa参考输出';
  if (relative.includes('/assets/references/')) return '参考资产';
  return '其他美术资产';
}

function defaultStatusFor(relative) {
  if (relative.startsWith('planned/')) return '未制作';
  return '占位资源';
}

function loadStatusMap() {
  if (!fs.existsSync(statusPath)) return {};
  try {
    const parsed = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
    return Object.fromEntries((parsed.assets || []).map((asset) => [asset.id, asset]));
  } catch {
    return {};
  }
}

function buildArtAssets() {
  const previous = loadStatusMap();
  const files = [
    ...collectFiles(path.join(root, 'assets', 'characters'), ['.png', '.json', '.gif', '.webp']),
    ...collectFiles(path.join(root, 'assets', 'references', 'meowa'), ['.png', '.json', '.gif', '.webp'])
  ];
  const assets = files.map((full) => {
    const relative = path.relative(root, full).replace(/\\/g, '/');
    const prior = previous[relative] || {};
    return {
      id: relative,
      name: path.basename(relative),
      category: prior.category || classifyAsset(relative),
      status: STATUS.includes(prior.status) ? prior.status : defaultStatusFor(relative),
      path: relative,
      updatedAt: fs.statSync(full).mtime.toISOString(),
      notes: prior.notes || ''
    };
  });

  const planned = [
    ['planned/ui/hover-status-frame.png', 'UI套件', 'Hover status frame'],
    ['planned/ui/health-icon-or-bar.png', 'UI套件', 'Health icon/bar'],
    ['planned/ui/mood-icon-or-bar.png', 'UI套件', 'Mood icon/bar'],
    ['planned/ui/hunger-icon-or-bar.png', 'UI套件', 'Hunger icon/bar'],
    ['planned/ui/money-icon-or-counter.png', 'UI套件', 'Money icon/counter'],
    ['planned/ui/chat-box-frame.png', 'UI套件', 'Double-click chat box frame'],
    ['planned/ui/chat-input.png', 'UI套件', 'Chat input area'],
    ['planned/props/food.png', '场景/道具', 'Food prop'],
    ['planned/props/toy.png', '场景/道具', 'Toy prop'],
    ['planned/props/bed.png', '场景/道具', 'Bed prop'],
    ['planned/states/hungry.png', '角色动作帧', 'Hungry state art'],
    ['planned/states/low-health.png', '角色动作帧', 'Low health/sick state art']
  ].map(([id, category, name]) => {
    const prior = previous[id] || {};
    return {
      id,
      name,
      category: prior.category || category,
      status: STATUS.includes(prior.status) ? prior.status : '未制作',
      path: id,
      updatedAt: null,
      notes: prior.notes || ''
    };
  });

  const all = [...assets, ...planned].sort((a, b) => a.category.localeCompare(b.category, 'zh-Hans-CN') || a.path.localeCompare(b.path));
  fs.writeFileSync(statusPath, JSON.stringify({
    version: 1,
    rule: 'All art is placeholder until owner confirms final shipping quality.',
    statuses: STATUS,
    generatedAt: new Date().toISOString(),
    assets: all
  }, null, 2), 'utf8');
  return all;
}

function parseMilestoneStatus() {
  const roadmap = read(path.join(planDir, 'mvp-roadmap.md'));
  const rows = [];
  const lines = roadmap.split(/\r?\n/);
  let inCurrentStatus = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '## Current Milestone Status') {
      inCurrentStatus = true;
      continue;
    }
    if (inCurrentStatus && trimmed.startsWith('## ')) break;
    if (!inCurrentStatus) continue;
    if (/^\| M\d+/.test(trimmed)) {
      const cells = trimmed.slice(1, -1).split('|').map((s) => s.trim());
      if (cells.length >= 3) rows.push({ milestone: cells[0], status: cells[1], notes: cells[2] });
    }
  }
  return rows;
}

const data = {
  generatedAt: new Date().toISOString(),
  docs: buildDocs(),
  artAssets: buildArtAssets(),
  milestones: parseMilestoneStatus()
};

const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Project Seal Dashboard</title>
<style>
:root { color-scheme: light; --ink:#1d2430; --muted:#687385; --line:#d9e0ea; --bg:#f7f9fc; --panel:#ffffff; --accent:#2563eb; --ok:#12805c; --warn:#a15c00; --todo:#7c3aed; }
* { box-sizing: border-box; }
body { margin:0; font-family: "Segoe UI", "Microsoft YaHei", Arial, sans-serif; color:var(--ink); background:var(--bg); }
header { padding:18px 22px 12px; background:var(--panel); border-bottom:1px solid var(--line); position:sticky; top:0; z-index:5; }
h1 { font-size:22px; margin:0 0 6px; letter-spacing:0; }
.meta { color:var(--muted); font-size:13px; display:flex; gap:14px; flex-wrap:wrap; }
.tabs { display:flex; gap:6px; padding:10px 22px; background:var(--panel); border-bottom:1px solid var(--line); position:sticky; top:74px; z-index:4; overflow-x:auto; }
.tab { border:1px solid var(--line); background:#fff; color:var(--ink); padding:8px 12px; border-radius:6px; cursor:pointer; white-space:nowrap; font-size:14px; }
.tab.active { background:var(--accent); color:white; border-color:var(--accent); }
main { padding:18px 22px 40px; max-width:1320px; margin:0 auto; }
.view { display:none; }
.view.active { display:block; }
.card { background:var(--panel); border:1px solid var(--line); border-radius:8px; padding:16px; margin-bottom:14px; }
h2 { font-size:20px; margin:0 0 12px; }
h3 { font-size:17px; margin:18px 0 8px; }
h4 { font-size:15px; margin:14px 0 8px; }
p, li { line-height:1.55; }
code { background:#eef2f8; border:1px solid #dde5f1; border-radius:4px; padding:1px 4px; }
pre { overflow:auto; background:#0f172a; color:#e2e8f0; padding:12px; border-radius:6px; }
.table-wrap { overflow:auto; margin:10px 0 14px; }
table { width:100%; border-collapse:collapse; font-size:13px; }
th, td { border:1px solid var(--line); padding:8px 9px; text-align:left; vertical-align:top; }
th { background:#f0f4fa; }
.doc-head { display:flex; justify-content:space-between; gap:12px; align-items:center; border-bottom:1px solid var(--line); padding-bottom:10px; margin-bottom:12px; }
.doc-path { font-size:12px; color:var(--muted); }
.grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:12px; }
.metric { border:1px solid var(--line); border-radius:8px; padding:12px; background:#fff; }
.metric .num { font-size:28px; font-weight:700; }
.filterbar { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:12px; }
input, select, button { font:inherit; }
input, select { border:1px solid var(--line); border-radius:6px; padding:7px 8px; background:#fff; }
button { border:1px solid var(--line); border-radius:6px; padding:7px 10px; background:#fff; cursor:pointer; }
.status { font-weight:600; }
.status.todo { color:var(--todo); }
.status.placeholder { color:var(--warn); }
.status.final { color:var(--ok); }
.asset-path { color:var(--muted); font-size:12px; word-break:break-all; }
.note { color:var(--muted); font-size:13px; }
</style>
</head>
<body>
<header>
  <h1>Project Seal 项目管理面板</h1>
  <div class="meta"><span>生成时间: ${escapeHtml(data.generatedAt)}</span><span>管理入口: docs/project-dashboard/index.html</span><span>美术规则: 未确认最终上线品质前均为占位资源</span></div>
</header>
<nav class="tabs" id="tabs"></nav>
<main id="views"></main>
<script id="dashboard-data" type="application/json">${escapeHtml(JSON.stringify(data))}</script>
<script>
const DATA = JSON.parse(document.getElementById('dashboard-data').textContent);
const STATUSES = ['未制作', '占位资源', '正式资源'];
const statusClass = (s) => s === '正式资源' ? 'final' : s === '占位资源' ? 'placeholder' : 'todo';
const storageKey = 'project-seal-art-status-overrides';
let overrides = JSON.parse(localStorage.getItem(storageKey) || '{}');
function saveOverrides() { localStorage.setItem(storageKey, JSON.stringify(overrides)); }
function currentStatus(asset) { return overrides[asset.id]?.status || asset.status; }
function currentNotes(asset) { return overrides[asset.id]?.notes ?? asset.notes ?? ''; }
function setActive(id) {
  document.querySelectorAll('.tab').forEach((el) => el.classList.toggle('active', el.dataset.id === id));
  document.querySelectorAll('.view').forEach((el) => el.classList.toggle('active', el.id === 'view-' + id));
}
function renderTabs(tabs) {
  const tabEl = document.getElementById('tabs');
  tabEl.innerHTML = tabs.map((tab) => '<button class="tab" data-id="' + tab.id + '">' + tab.label + '</button>').join('');
  tabEl.querySelectorAll('.tab').forEach((btn) => btn.addEventListener('click', () => setActive(btn.dataset.id)));
}
function renderDocs(group) {
  return '<section class="view" id="view-' + group.id + '">' + group.docs.map((doc) => '<article class="card"><div class="doc-head"><strong>' + doc.file + '</strong><span class="doc-path">更新: ' + (doc.updatedAt || 'missing') + '</span></div>' + doc.html + '</article>').join('') + '</section>';
}
function renderOverview() {
  const counts = DATA.artAssets.reduce((acc, asset) => { const s = currentStatus(asset); acc[s] = (acc[s] || 0) + 1; return acc; }, {});
  const milestoneRows = DATA.milestones.map((m) => '<tr><td>' + m.milestone + '</td><td>' + m.status + '</td><td>' + m.notes + '</td></tr>').join('');
  return '<section class="view" id="view-dashboard"><div class="grid"><div class="metric"><div class="num">' + DATA.milestones.length + '</div><div>Milestones</div></div><div class="metric"><div class="num">' + DATA.artAssets.length + '</div><div>Art assets tracked</div></div><div class="metric"><div class="num">' + (counts['占位资源'] || 0) + '</div><div>占位资源</div></div><div class="metric"><div class="num">' + (counts['未制作'] || 0) + '</div><div>未制作</div></div></div><article class="card"><h2>当前里程碑状态</h2><div class="table-wrap"><table><thead><tr><th>Milestone</th><th>Status</th><th>Notes</th></tr></thead><tbody>' + milestoneRows + '</tbody></table></div></article><article class="card"><h2>管理规则</h2><ul><li>后续以本 HTML 面板为核心入口追踪项目。</li><li>页面由 <code>npm run dashboard</code> 从 docs 和 assets 自动生成。</li><li>美术状态下拉会保存在当前浏览器 localStorage；需要入库时导出 JSON 后交给我同步。</li><li>所有未确认最终上线品质的已存在美术资产默认是 <strong>占位资源</strong>。</li></ul></article></section>';
}
function renderAssets() {
  const categories = [...new Set(DATA.artAssets.map((a) => a.category))].sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'));
  const options = ['全部', ...categories].map((c) => '<option value="' + c + '">' + c + '</option>').join('');
  return '<section class="view" id="view-art-assets"><article class="card"><h2>美术资产台账</h2><p class="note">状态选项固定为：未制作、占位资源、正式资源。你未确认最终上线品质前，当前所有已存在美术资产都按占位资源管理。</p><div class="filterbar"><input id="asset-search" placeholder="搜索资产/路径"><select id="asset-category">' + options + '</select><select id="asset-status"><option>全部状态</option>' + STATUSES.map((s) => '<option>' + s + '</option>').join('') + '</select><button id="export-status">导出状态 JSON</button><button id="reset-status">重置本地选择</button></div><div class="table-wrap"><table><thead><tr><th>分类</th><th>资产</th><th>状态</th><th>路径</th><th>备注</th><th>更新时间</th></tr></thead><tbody id="asset-rows"></tbody></table></div></article></section>';
}
function bindAssets() {
  const rows = document.getElementById('asset-rows');
  if (!rows) return;
  const search = document.getElementById('asset-search');
  const category = document.getElementById('asset-category');
  const status = document.getElementById('asset-status');
  function draw() {
    const q = search.value.trim().toLowerCase();
    const cat = category.value;
    const st = status.value;
    const filtered = DATA.artAssets.filter((asset) => {
      const s = currentStatus(asset);
      return (!q || asset.name.toLowerCase().includes(q) || asset.path.toLowerCase().includes(q)) && (cat === '全部' || asset.category === cat) && (st === '全部状态' || s === st);
    });
    rows.innerHTML = filtered.map((asset) => {
      const s = currentStatus(asset);
      const select = '<select data-id="' + asset.id + '" class="asset-status"><option ' + (s === '未制作' ? 'selected' : '') + '>未制作</option><option ' + (s === '占位资源' ? 'selected' : '') + '>占位资源</option><option ' + (s === '正式资源' ? 'selected' : '') + '>正式资源</option></select>';
      return '<tr><td>' + asset.category + '</td><td><strong>' + asset.name + '</strong></td><td><span class="status ' + statusClass(s) + '">' + select + '</span></td><td><div class="asset-path">' + asset.path + '</div></td><td><input data-note-id="' + asset.id + '" value="' + (currentNotes(asset) || '').replace(/"/g, '&quot;') + '" placeholder="备注"></td><td>' + (asset.updatedAt || '未制作') + '</td></tr>';
    }).join('');
    rows.querySelectorAll('.asset-status').forEach((el) => el.addEventListener('change', () => {
      overrides[el.dataset.id] = { ...(overrides[el.dataset.id] || {}), status: el.value };
      saveOverrides();
      draw();
    }));
    rows.querySelectorAll('[data-note-id]').forEach((el) => el.addEventListener('change', () => {
      overrides[el.dataset.noteId] = { ...(overrides[el.dataset.noteId] || {}), notes: el.value };
      saveOverrides();
    }));
  }
  [search, category, status].forEach((el) => el.addEventListener('input', draw));
  document.getElementById('export-status').addEventListener('click', () => {
    const merged = DATA.artAssets.map((asset) => ({ ...asset, status: currentStatus(asset), notes: currentNotes(asset) }));
    const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), assets: merged }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'art-assets-status.export.json';
    a.click();
    URL.revokeObjectURL(url);
  });
  document.getElementById('reset-status').addEventListener('click', () => { overrides = {}; saveOverrides(); draw(); });
  draw();
}
function init() {
  const tabs = [{ id: 'dashboard', label: 'Dashboard' }, ...DATA.docs.map((g) => ({ id: g.id, label: g.label })), { id: 'art-assets', label: '美术资产' }];
  renderTabs(tabs);
  document.getElementById('views').innerHTML = renderOverview() + DATA.docs.map(renderDocs).join('') + renderAssets();
  bindAssets();
  setActive('dashboard');
}
init();
</script>
</body>
</html>
`;

fs.writeFileSync(outputPath, html, 'utf8');
console.log(`Dashboard generated: ${path.relative(root, outputPath)}`);
console.log(`Art status generated: ${path.relative(root, statusPath)}`);
console.log(`Tracked art assets: ${data.artAssets.length}`);





