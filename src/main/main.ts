import { app, BrowserWindow, ipcMain, Menu, screen, Tray, nativeImage } from 'electron';
import fs from 'node:fs';
import path from 'node:path';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isQuitting = false;
let dragTimer: NodeJS.Timeout | null = null;
let dragSafetyTimer: NodeJS.Timeout | null = null;
let dragOffset: { x: number; y: number } | null = null;

type PetSave = {
  mood: number;
  energy: number;
  affection: number;
  hunger: number;
  lastState: string;
  lastPlayedAt: string;
};

type CharacterManifest = {
  id: string;
  name: string;
  scale: number;
  theme: string;
  renderMode?: 'procedural_seal' | 'sprite_sheet' | 'template_pixel_avatar';
  fallbackToProcedural?: boolean;
  previewDataUrl?: string;
  animationDataUrls?: Record<string, string[]>;
  palette?: {
    body: string;
    outline: string;
    flipper: string;
    shadow: string;
    cheek: string;
    hair?: string;
    outfit?: string;
    accent?: string;
    shoes?: string;
  };
  animations: Record<string, string | string[]>;
  personality: {
    tone: string;
    catchphrases: string[];
  };
  assetBasePath: string;
  hairVariant?: 'short' | 'bob' | 'long' | 'curly';
  hasAccessories?: boolean;
};

type CustomCharacterInput = {
  name: string;
  previewPngDataUrl: string;
  palette: NonNullable<CharacterManifest['palette']>;
  templateVariant?: string;
  hairVariant?: 'short' | 'bob' | 'long' | 'curly';
  hasAccessories?: boolean;
};

type RuntimeStore = {
  windowPosition?: { x: number; y: number };
  activeCharacterId?: string;
  pet: PetSave;
};

const defaultPetSave: PetSave = {
  mood: 70,
  energy: 80,
  affection: 12,
  hunger: 30,
  lastState: 'idle',
  lastPlayedAt: new Date().toISOString()
};

const defaultCharacterId = 'photo_001_travel_girl';

function getStorePath(): string {
  return path.join(app.getPath('userData'), 'runtime-store.json');
}

function readStore(): RuntimeStore {
  try {
    const raw = fs.readFileSync(getStorePath(), 'utf8');
    const parsed = JSON.parse(raw) as Partial<RuntimeStore>;
    return {
      ...parsed,
      pet: { ...defaultPetSave, ...parsed.pet }
    };
  } catch {
    return { pet: defaultPetSave };
  }
}

function writeStore(nextStore: RuntimeStore): void {
  fs.mkdirSync(path.dirname(getStorePath()), { recursive: true });
  fs.writeFileSync(getStorePath(), JSON.stringify(nextStore, null, 2), 'utf8');
}

function getCharactersRoot(): string {
  const appRoot = app.isPackaged ? process.resourcesPath : path.join(app.getAppPath(), 'assets');
  return path.join(appRoot, 'characters');
}

function getUserCharactersRoot(): string {
  return path.join(app.getPath('userData'), 'custom-characters');
}

function readCharacterManifest(characterDir: string): CharacterManifest | null {
  const manifestPath = path.join(characterDir, 'manifest.json');
  try {
    const raw = fs.readFileSync(manifestPath, 'utf8').replace(/^\uFEFF/, '');
    const parsed = JSON.parse(raw) as Omit<CharacterManifest, 'assetBasePath'>;
    if (!parsed.id || !parsed.name || !parsed.animations) {
      return null;
    }
    if (parsed.theme.includes('custom_photo_pixel')) {
      return null;
    }
    const animationDataUrls = Object.entries(parsed.animations).reduce<Record<string, string[]>>(
      (accumulator, [state, animationValue]) => {
        const animationFiles = Array.isArray(animationValue) ? animationValue : [animationValue];
        const dataUrls = animationFiles
          .map((animationFile) => path.join(characterDir, animationFile))
          .filter((animationPath) => fs.existsSync(animationPath))
          .map((animationPath) => `data:image/png;base64,${fs.readFileSync(animationPath).toString('base64')}`);
        if (dataUrls.length > 0) {
          accumulator[state] = dataUrls;
        }
        return accumulator;
      },
      {}
    );
    const previewDataUrl = animationDataUrls.idle?.[0];
    const isTemplateAvatar = parsed.theme.includes('template_pixel_avatar') && Boolean(previewDataUrl);
    return {
      ...parsed,
      assetBasePath: characterDir,
      renderMode: parsed.renderMode ?? (isTemplateAvatar ? 'template_pixel_avatar' : 'procedural_seal'),
      previewDataUrl,
      animationDataUrls,
      fallbackToProcedural: parsed.fallbackToProcedural ?? true
    };
  } catch {
    return null;
  }
}

function listCharacterPacks(): CharacterManifest[] {
  const roots = [getCharactersRoot(), getUserCharactersRoot()];
  return roots.flatMap((root) => {
    try {
      return fs
        .readdirSync(root, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => readCharacterManifest(path.join(root, entry.name)))
        .filter((manifest): manifest is CharacterManifest => Boolean(manifest));
    } catch {
      return [];
    }
  });
}

function sanitizeId(input: string): string {
  const clean = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 32);
  return clean || 'custom_seal';
}

function saveCustomCharacter(input: CustomCharacterInput): CharacterManifest {
  const timestamp = Date.now();
  const characterId = `custom_${sanitizeId(input.name)}_${timestamp}`;
  const characterDir = path.join(getUserCharactersRoot(), characterId);
  fs.mkdirSync(characterDir, { recursive: true });

  const base64 = input.previewPngDataUrl.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync(path.join(characterDir, 'preview.png'), Buffer.from(base64, 'base64'));

  const manifest: Omit<CharacterManifest, 'assetBasePath'> = {
    id: characterId,
    name: input.name.trim() || 'Custom Character',
    scale: 3,
    theme: 'template_pixel_avatar_v1',
    renderMode: 'template_pixel_avatar',
    fallbackToProcedural: false,
    palette: input.palette,
    hairVariant: input.hairVariant ?? 'bob',
    hasAccessories: input.hasAccessories ?? false,
    animations: {
      idle: 'preview.png'
    },
    personality: {
      tone: 'cute_bilingual',
      catchphrases: ['custom arf!', 'hello!']
    }
  };

  fs.writeFileSync(path.join(characterDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
  fs.writeFileSync(
    path.join(characterDir, 'art-metadata.json'),
    JSON.stringify(
      {
        characterId,
        status: 'photo_to_pixel_mvp',
        sourceType: 'user_import_local_processing',
        generator: 'template_pixel_avatar_v1',
        templateVariant: input.templateVariant ?? 'approved_base',
        hairVariant: input.hairVariant ?? 'bob',
        hasAccessories: input.hasAccessories ?? false,
        commercialUse: 'user_content',
        generatedAt: new Date().toISOString(),
        notes: [
          'Generated locally by M4 photo-to-pixel template flow.',
          'The imported photo is sampled locally and transformed into the built-in pixel avatar template.',
          'Preview PNG is stored locally in Electron userData.'
        ]
      },
      null,
      2
    ),
    'utf8'
  );

  const latestStore = readStore();
  writeStore({ ...latestStore, activeCharacterId: characterId });
  return { ...manifest, assetBasePath: characterDir, previewDataUrl: input.previewPngDataUrl };
}

function getActiveCharacter(): CharacterManifest {
  const packs = listCharacterPacks();
  const store = readStore();
  const storedCharacter = packs.find((pack) => pack.id === store.activeCharacterId);
  const storedIsOldPlaceholder =
    storedCharacter?.id === 'template_blue_headphone_girl' ||
    storedCharacter?.id === 'default_seal' ||
    storedCharacter?.id.startsWith('custom_');
  if (storedCharacter && !storedIsOldPlaceholder) {
    return storedCharacter;
  }

  return (
    packs.find((pack) => pack.id === defaultCharacterId) ??
    packs.find((pack) => pack.id === 'default_seal') ??
    packs[0] ?? {
      id: defaultCharacterId,
      name: 'Blue Headphone Girl',
      scale: 3,
      theme: 'template_pixel_avatar_approved_baseline',
      renderMode: 'template_pixel_avatar',
      fallbackToProcedural: false,
      animations: {},
      personality: { tone: 'cute_bilingual', catchphrases: ['arf!'] },
      assetBasePath: ''
    }
  );
}

function getSafeWindowPosition(x: number, y: number): { x: number; y: number } {
  const displays = screen.getAllDisplays();
  const visibleMargin = 48;
  const windowBounds = mainWindow?.getBounds() ?? { width: 320, height: 320 };
  const minX = Math.min(...displays.map((display) => display.workArea.x));
  const minY = Math.min(...displays.map((display) => display.workArea.y));
  const maxX = Math.max(...displays.map((display) => display.workArea.x + display.workArea.width));
  const maxY = Math.max(...displays.map((display) => display.workArea.y + display.workArea.height));

  return {
    x: Math.round(Math.max(minX - windowBounds.width + visibleMargin, Math.min(x, maxX - visibleMargin))),
    y: Math.round(Math.max(minY, Math.min(y, maxY - visibleMargin)))
  };
}

function stopWindowDrag(): void {
  if (dragTimer) {
    clearInterval(dragTimer);
    dragTimer = null;
  }
  if (dragSafetyTimer) {
    clearTimeout(dragSafetyTimer);
    dragSafetyTimer = null;
  }
  dragOffset = null;
}

function startWindowDrag(): void {
  if (!mainWindow) {
    return;
  }

  stopWindowDrag();

  const cursor = screen.getCursorScreenPoint();
  const [windowX, windowY] = mainWindow.getPosition();
  dragOffset = {
    x: cursor.x - windowX,
    y: cursor.y - windowY
  };

  dragTimer = setInterval(() => {
    if (!mainWindow || !dragOffset) {
      stopWindowDrag();
      return;
    }

    const nextCursor = screen.getCursorScreenPoint();
    const safePosition = getSafeWindowPosition(nextCursor.x - dragOffset.x, nextCursor.y - dragOffset.y);
    mainWindow.setPosition(safePosition.x, safePosition.y, false);
  }, 16);
  dragSafetyTimer = setTimeout(stopWindowDrag, 20_000);
}

function createWindow(): void {
  const store = readStore();
  mainWindow = new BrowserWindow({
    width: 320,
    height: 320,
    x: store.windowPosition?.x,
    y: store.windowPosition?.y,
    minWidth: 220,
    minHeight: 220,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    hasShadow: false,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js')
    }
  });

  mainWindow.setAlwaysOnTop(true, 'screen-saver');
  mainWindow.on('moved', () => {
    if (!mainWindow) {
      return;
    }
    const [x, y] = mainWindow.getPosition();
    const latestStore = readStore();
    writeStore({ ...latestStore, windowPosition: { x, y } });
  });
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });
  mainWindow.on('closed', () => {
    stopWindowDrag();
    mainWindow = null;
  });

  if (process.env.ELECTRON_RENDERER_URL) {
    void mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    void mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
}

function createTray(): void {
  const trayIconSvg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <rect width="32" height="32" rx="8" fill="#6aa9d8"/>
      <ellipse cx="16" cy="18" rx="11" ry="8" fill="#f7fbff"/>
      <circle cx="16" cy="13" r="7" fill="#ffffff"/>
      <circle cx="13" cy="12" r="1.4" fill="#1d2730"/>
      <circle cx="19" cy="12" r="1.4" fill="#1d2730"/>
      <circle cx="16" cy="15" r="1.2" fill="#1d2730"/>
    </svg>
  `);
  const icon = nativeImage.createFromDataURL(`data:image/svg+xml,${trayIconSvg}`);
  tray = new Tray(icon);
  tray.setToolTip('Project Seal');
  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: 'Show Project Seal', click: () => mainWindow?.show() },
      { label: 'Hide Project Seal', click: () => mainWindow?.hide() },
      { type: 'separator' },
      {
        label: 'Exit',
        click: () => {
          isQuitting = true;
          app.quit();
        }
      }
    ])
  );
}

function registerIpc(): void {
  ipcMain.handle('runtime:get-initial-state', () => {
    const store = readStore();
    const position = mainWindow?.getPosition();
    const activeCharacter = getActiveCharacter();
    return {
      pet: store.pet,
      activeCharacterId: activeCharacter.id,
      character: activeCharacter,
      characters: listCharacterPacks(),
      windowPosition: position ? { x: position[0], y: position[1] } : store.windowPosition
    };
  });

  ipcMain.handle('runtime:start-window-drag', () => {
    startWindowDrag();
  });

  ipcMain.handle('runtime:stop-window-drag', () => {
    stopWindowDrag();
  });

  ipcMain.handle('runtime:save-pet', (_event, pet: PetSave) => {
    const latestStore = readStore();
    writeStore({ ...latestStore, pet: { ...pet, lastPlayedAt: new Date().toISOString() } });
  });

  ipcMain.handle('runtime:set-active-character', (_event, characterId: string) => {
    const packs = listCharacterPacks();
    const nextCharacter = packs.find((pack) => pack.id === characterId);
    if (!nextCharacter) {
      return getActiveCharacter();
    }

    const latestStore = readStore();
    writeStore({ ...latestStore, activeCharacterId: characterId });
    return nextCharacter;
  });

  ipcMain.handle('runtime:save-custom-character', (_event, input: CustomCharacterInput) => {
    return saveCustomCharacter(input);
  });
}

void app.whenReady().then(() => {
  app.setName('Project Seal');
  registerIpc();
  createWindow();
  createTray();
});

app.on('window-all-closed', () => {});

