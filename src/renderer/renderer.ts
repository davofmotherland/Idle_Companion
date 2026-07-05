import { Application, Graphics, Sprite, Texture } from 'pixi.js';
import './styles.css';

type PetState = 'idle' | 'walk' | 'sleep' | 'dragged' | 'happy' | 'annoyed' | 'poke';

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
};

type DesktopPetApi = {
  version: string;
  getInitialState: () => Promise<{
    pet: PetSave;
    activeCharacterId: string;
    character: CharacterManifest;
    characters: CharacterManifest[];
    windowPosition?: { x: number; y: number };
  }>;
  startWindowDrag: () => Promise<void>;
  stopWindowDrag: () => Promise<void>;
  savePet: (pet: PetSave) => Promise<void>;
  setActiveCharacter: (characterId: string) => Promise<CharacterManifest>;
};

declare global {
  interface Window {
    desktopPet: DesktopPetApi;
  }
}

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));
const colorFromHex = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }
  const parsed = Number.parseInt(value.replace('#', ''), 16);
  return Number.isFinite(parsed) ? parsed : fallback;
};

function drawBar(graphics: Graphics, x: number, y: number, value: number, color: number): void {
  graphics.roundRect(x, y, 54, 6, 3).fill({ color: 0xd7e2ea, alpha: 0.85 });
  graphics.roundRect(x, y, clamp(value, 0, 100) * 0.54, 6, 3).fill({ color, alpha: 0.95 });
}

function drawStatusBars(graphics: Graphics, values: PetSave): void {
  drawBar(graphics, 75, 260, values.mood, 0xffb3c1);
  drawBar(graphics, 135, 260, values.energy, 0x8ecae6);
  drawBar(graphics, 195, 260, values.affection, 0xb8e986);
}

function drawFallbackSeal(graphics: Graphics, state: PetState, timeMs: number, values: PetSave, character: CharacterManifest): void {
  const pulse = Math.sin(timeMs / 420);
  const walk = state === 'walk' ? Math.sin(timeMs / 140) : 0;
  const x = 160 + (state === 'walk' ? walk * 12 : 0);
  const y = 156 + (state === 'idle' ? pulse * 2 : 0) + (state === 'happy' ? Math.sin(timeMs / 120) * 5 : 0);
  const headY = y - 48 + (state === 'poke' ? 7 : 0);
  const palette: Partial<NonNullable<CharacterManifest['palette']>> = character.palette ?? {};
  const bodyColor = state === 'annoyed' ? 0xffeef0 : colorFromHex(palette.body, 0xf4f8fb);
  const outlineColor = colorFromHex(palette.outline, 0xb8c7d2);
  const flipperColor = colorFromHex(palette.flipper, 0xe5eef5);
  const shadowColor = colorFromHex(palette.shadow, 0x355070);

  graphics.clear();
  graphics.ellipse(160, 230, 72, 14).fill({ color: shadowColor, alpha: 0.18 });
  graphics.ellipse(x - 64, y + 16 + walk * 3, 22, 12).fill({ color: flipperColor }).stroke({ color: outlineColor, width: 3 });
  graphics.ellipse(x + 64, y + 16 - walk * 3, 22, 12).fill({ color: flipperColor }).stroke({ color: outlineColor, width: 3 });
  graphics.ellipse(x, y, state === 'dragged' ? 76 : 82, state === 'dragged' ? 64 : 58).fill({ color: bodyColor }).stroke({ color: outlineColor, width: 4 });
  graphics.circle(x, headY, state === 'dragged' ? 50 : 54).fill({ color: bodyColor }).stroke({ color: outlineColor, width: 4 });
  graphics.ellipse(x, headY + 15, 24, 16).fill({ color: 0xeef4f8 });

  if (state === 'sleep') {
    graphics.roundRect(x - 25, headY - 8, 18, 4, 2).fill({ color: 0x1d2730 });
    graphics.roundRect(x + 7, headY - 8, 18, 4, 2).fill({ color: 0x1d2730 });
    graphics.roundRect(210, 72 + pulse * 3, 20, 14, 4).fill({ color: 0xffffff, alpha: 0.8 });
    graphics.roundRect(234, 52 + pulse * 2, 14, 10, 3).fill({ color: 0xffffff, alpha: 0.7 });
  } else {
    graphics.circle(x - 19, headY - 6, 5).fill({ color: 0x1d2730 });
    graphics.circle(x + 19, headY - 6, 5).fill({ color: 0x1d2730 });
    graphics.circle(x - 17, headY - 8, 1.5).fill({ color: 0xffffff });
    graphics.circle(x + 21, headY - 8, 1.5).fill({ color: 0xffffff });
  }

  graphics.circle(x, headY + 10, 4).fill({ color: 0x1d2730 });
  drawStatusBars(graphics, values);
}

function animationKeyForState(state: PetState, textures: Partial<Record<PetState, Texture[]>>): PetState {
  if (textures[state]?.length) {
    return state;
  }
  if ((state === 'poke' || state === 'annoyed') && textures.happy?.length) {
    return 'happy';
  }
  if (state === 'dragged' && textures.idle?.length) {
    return 'idle';
  }
  return textures.idle?.length ? 'idle' : state;
}

function fpsForState(state: PetState): number {
  if (state === 'idle') return 2.4;
  if (state === 'walk') return 5.5;
  if (state === 'sleep') return 1.2;
  if (state === 'happy' || state === 'poke' || state === 'annoyed') return 5;
  return 3;
}

async function start(): Promise<void> {
  const canvas = document.querySelector<HTMLCanvasElement>('#pet-canvas');
  const label = document.querySelector<HTMLDivElement>('#state-label');
  if (!canvas || !label) {
    throw new Error('Missing pet runtime elements');
  }

  const stateLabel = label;
  const initialState = await window.desktopPet.getInitialState();
  let pet: PetSave = initialState.pet;
  let activeCharacter = initialState.character;
  let characters = initialState.characters.length > 0 ? initialState.characters : [activeCharacter];
  let state: PetState = (['idle', 'walk', 'sleep', 'dragged', 'happy', 'annoyed', 'poke'].includes(pet.lastState)
    ? pet.lastState
    : 'idle') as PetState;
  let stateUntil = performance.now() + 2400;
  let lastInteractionAt = performance.now();
  let lastSavedAt = 0;
  let clickTimes: number[] = [];
  let activeSpriteId: string | null = null;
  let loadingSpriteId: string | null = null;
  let petTextures: Partial<Record<PetState, Texture[]>> = {};

  const app = new Application();
  await app.init({
    canvas,
    width: 320,
    height: 320,
    backgroundAlpha: 0,
    antialias: false
  });

  const petLayer = new Graphics();
  const petSprite = new Sprite(Texture.EMPTY);
  petSprite.anchor.set(0.5);
  petSprite.visible = false;
  petSprite.roundPixels = true;
  app.stage.addChild(petLayer);
  app.stage.addChild(petSprite);

  function saveSoon(force = false): void {
    const now = performance.now();
    if (!force && now - lastSavedAt < 800) {
      return;
    }
    lastSavedAt = now;
    void window.desktopPet.savePet({ ...pet, lastState: state, lastPlayedAt: new Date().toISOString() });
  }

  function updateLabel(): void {
    stateLabel.textContent = `${activeCharacter.name}  ${state.toUpperCase()}  M:${pet.mood} E:${pet.energy} A:${pet.affection} H:${pet.hunger}`;
  }

  function setState(nextState: PetState, durationMs: number): void {
    state = nextState;
    stateUntil = performance.now() + durationMs;
    pet = {
      ...pet,
      mood: clamp(pet.mood, 0, 100),
      energy: clamp(pet.energy, 0, 100),
      affection: clamp(pet.affection, 0, 100),
      hunger: clamp(pet.hunger, 0, 100),
      lastState: nextState
    };
    updateLabel();
    saveSoon();
  }

  function refreshCharacters(nextCharacter: CharacterManifest): void {
    activeCharacter = nextCharacter;
    const exists = characters.some((character) => character.id === nextCharacter.id);
    characters = exists
      ? characters.map((character) => (character.id === nextCharacter.id ? nextCharacter : character))
      : [...characters, nextCharacter];
    activeSpriteId = null;
    petTextures = {};
    setState('happy', 1400);
  }

  function loadTextureFromDataUrl(dataUrl: string): Promise<Texture> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => {
        const texture = Texture.from(image);
        texture.source.scaleMode = 'nearest';
        resolve(texture);
      });
      image.addEventListener('error', () => reject(new Error('Failed to load character animation frame')));
      image.src = dataUrl;
    });
  }

  async function loadAnimationTextures(character: CharacterManifest): Promise<Partial<Record<PetState, Texture[]>>> {
    const animationDataUrls = character.animationDataUrls ?? (character.previewDataUrl ? { idle: [character.previewDataUrl] } : {});
    const loadedTextures: Partial<Record<PetState, Texture[]>> = {};
    await Promise.all(
      Object.entries(animationDataUrls).map(async ([stateName, dataUrls]) => {
        const textures = await Promise.all(dataUrls.map((dataUrl) => loadTextureFromDataUrl(dataUrl)));
        if (textures.length > 0) {
          loadedTextures[stateName as PetState] = textures;
        }
      })
    );
    return loadedTextures;
  }

  function syncPetSprite(): void {
    if (activeCharacter.renderMode !== 'template_pixel_avatar') {
      petSprite.visible = false;
      activeSpriteId = null;
      loadingSpriteId = null;
      return;
    }

    if (activeSpriteId === activeCharacter.id || loadingSpriteId === activeCharacter.id) {
      return;
    }

    const characterToLoad = activeCharacter;
    loadingSpriteId = characterToLoad.id;
    petSprite.visible = false;
    petTextures = {};
    void loadAnimationTextures(characterToLoad)
      .then((loadedTextures) => {
        if (activeCharacter.id !== characterToLoad.id || loadingSpriteId !== characterToLoad.id) {
          return;
        }
        petTextures = loadedTextures;
        activeSpriteId = characterToLoad.id;
        loadingSpriteId = null;
        petSprite.visible = Object.keys(petTextures).length > 0;
      })
      .catch(() => {
        if (loadingSpriteId === characterToLoad.id) {
          activeSpriteId = null;
          loadingSpriteId = null;
          petSprite.visible = false;
        }
      });
  }

  function drawPixelPet(timeMs: number): void {
    const animationKey = animationKeyForState(state, petTextures);
    const frames = petTextures[animationKey];
    if (!frames?.length) {
      petSprite.visible = false;
      return;
    }

    const frameIndex = Math.floor((timeMs / 1000) * fpsForState(animationKey)) % frames.length;
    petSprite.texture = frames[frameIndex];

    petLayer.clear();
    petLayer.ellipse(160, 232, 62, 12).fill({ color: 0x355070, alpha: 0.16 });
    drawStatusBars(petLayer, pet);

    petSprite.x = 160;
    petSprite.y = 144;
    petSprite.scale.set(state === 'dragged' ? 2.65 : 2.5);
    petSprite.angle = state === 'dragged' ? Math.sin(timeMs / 90) * 3 : 0;
    petSprite.alpha = state === 'sleep' ? 0.92 : 1;

    if (state === 'sleep') {
      const pulse = Math.sin(timeMs / 420);
      petLayer.roundRect(210, 72 + pulse * 3, 20, 14, 4).fill({ color: 0xffffff, alpha: 0.8 });
      petLayer.roundRect(234, 52 + pulse * 2, 14, 10, 3).fill({ color: 0xffffff, alpha: 0.7 });
    }
  }

  function poke(): void {
    const now = performance.now();
    clickTimes = [...clickTimes.filter((time) => now - time < 2400), now];
    lastInteractionAt = now;

    if (state === 'sleep') {
      pet = { ...pet, energy: clamp(pet.energy + 3, 0, 100) };
      setState('happy', 1600);
      return;
    }

    if (clickTimes.length >= 4) {
      pet = { ...pet, mood: clamp(pet.mood - 5, 0, 100), hunger: clamp(pet.hunger + 2, 0, 100) };
      setState('annoyed', 1800);
    } else {
      pet = { ...pet, mood: clamp(pet.mood + 2, 0, 100), affection: clamp(pet.affection + 1, 0, 100) };
      setState('poke', 600);
    }
  }

  let dragStart: { pointerId: number; screenX: number; screenY: number; didMove: boolean } | null = null;

  canvas.addEventListener('pointerdown', (event) => {
    canvas.setPointerCapture(event.pointerId);
    dragStart = { pointerId: event.pointerId, screenX: event.screenX, screenY: event.screenY, didMove: false };
    void window.desktopPet.startWindowDrag();
    setState('dragged', 60_000);
  });

  canvas.addEventListener('pointermove', (event) => {
    if (!dragStart || event.pointerId !== dragStart.pointerId) {
      return;
    }
    const distance = Math.hypot(event.screenX - dragStart.screenX, event.screenY - dragStart.screenY);
    if (distance >= 4) {
      dragStart.didMove = true;
    }
  });

  canvas.addEventListener('pointerup', (event) => {
    if (!dragStart || event.pointerId !== dragStart.pointerId) {
      return;
    }
    const wasDrag = dragStart.didMove;
    dragStart = null;
    void window.desktopPet.stopWindowDrag();
    canvas.releasePointerCapture(event.pointerId);
    lastInteractionAt = performance.now();

    if (wasDrag) {
      pet = { ...pet, energy: clamp(pet.energy - 1, 0, 100), affection: clamp(pet.affection + 1, 0, 100) };
      setState('happy', 1200);
      saveSoon(true);
    } else {
      poke();
    }
  });

  canvas.addEventListener('pointercancel', () => {
    dragStart = null;
    void window.desktopPet.stopWindowDrag();
    setState('idle', 1200);
  });

  window.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() !== 'c' || characters.length < 2) {
      return;
    }
    const currentIndex = characters.findIndex((character) => character.id === activeCharacter.id);
    const nextCharacter = characters[(currentIndex + 1) % characters.length];
    void window.desktopPet.setActiveCharacter(nextCharacter.id).then((updatedCharacter) => {
      refreshCharacters(updatedCharacter);
    });
  });

  app.ticker.add(() => {
    const now = performance.now();

    if (state !== 'dragged' && now > stateUntil) {
      if (['poke', 'happy', 'annoyed'].includes(state)) {
        setState('idle', 1800);
      } else if (state === 'walk') {
        pet = { ...pet, energy: clamp(pet.energy - 1, 0, 100), hunger: clamp(pet.hunger + 1, 0, 100) };
        setState('idle', 2200);
      } else if (state === 'sleep') {
        pet = { ...pet, energy: clamp(pet.energy + 4, 0, 100) };
        setState('idle', 2600);
      } else if (now - lastInteractionAt > 12_000 || pet.energy < 25) {
        setState('sleep', 5200);
      } else {
        setState(Math.random() > 0.5 ? 'walk' : 'idle', Math.random() > 0.5 ? 2800 : 2200);
      }
    }

    syncPetSprite();
    if (petSprite.visible) {
      drawPixelPet(now);
    } else {
      drawFallbackSeal(petLayer, state, now, pet, activeCharacter);
    }
  });

  setState(state, 2000);
}

void start();
