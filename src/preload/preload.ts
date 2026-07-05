import { contextBridge, ipcRenderer } from 'electron';

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

contextBridge.exposeInMainWorld('desktopPet', {
  version: '0.1.0',
  getInitialState: () => ipcRenderer.invoke('runtime:get-initial-state') as Promise<{
    pet: PetSave;
    activeCharacterId: string;
    character: CharacterManifest;
    characters: CharacterManifest[];
    windowPosition?: { x: number; y: number };
  }>,
  startWindowDrag: () => ipcRenderer.invoke('runtime:start-window-drag') as Promise<void>,
  stopWindowDrag: () => ipcRenderer.invoke('runtime:stop-window-drag') as Promise<void>,
  savePet: (pet: PetSave) => ipcRenderer.invoke('runtime:save-pet', pet) as Promise<void>,
  setActiveCharacter: (characterId: string) =>
    ipcRenderer.invoke('runtime:set-active-character', characterId) as Promise<CharacterManifest>,
  saveCustomCharacter: (input: CustomCharacterInput) =>
    ipcRenderer.invoke('runtime:save-custom-character', input) as Promise<CharacterManifest>
});
