import { FeaturePalette, FeatureResult } from './segmentation/types';

export type PixelTemplatePalette = {
  body: string;
  outline: string;
  accent: string;
  flipper: string;
  hair: string;
  outfit: string;
  shadow: string;
  cheek: string;
};

export type PixelTemplateVariant = {
  id: string;
  label: string;
};

/** Union palette type for paint functions that accept both old and new palette formats */
type PaletteUnion = PixelTemplatePalette | FeaturePalette;

type Rgb = {
  red: number;
  green: number;
  blue: number;
};

type TemplatePaint = {
  context: CanvasRenderingContext2D;
  palette: PaletteUnion;
};

export const pixelTemplateSpec = {
  canvasWidth: 48,
  canvasHeight: 64,
  bodyWidthRange: '26-38px',
  bodyHeightRange: '46-58px',
  displayScale: '2.5x-3x',
  paletteLimit: '8-16 visible colors'
};

export const pixelTemplateVariants: PixelTemplateVariant[] = [
  { id: 'approved_base', label: 'A' },
  { id: 'blue_shift', label: 'B' },
  { id: 'light_shift', label: 'C' },
  { id: 'warm_shift', label: 'D' },
  { id: 'dark_shift', label: 'E' }
];

const fallbackPalette: PixelTemplatePalette = {
  body: '#f8fbff',
  outline: '#455a68',
  accent: '#5b9ed6',
  flipper: '#5b9ed6',
  hair: '#6b4b3e',
  outfit: '#f8fbff',
  shadow: '#25313a',
  cheek: '#ff9fb3'
};

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));
const quantize = (value: number): number => Math.round(value / 24) * 24;
const hexFromRgb = (red: number, green: number, blue: number): string =>
  `#${[red, green, blue].map((value) => Math.round(clamp(value, 0, 255)).toString(16).padStart(2, '0')).join('')}`;

function averageImageColor(source: HTMLCanvasElement): Rgb {
  const context = source.getContext('2d');
  if (!context) {
    return { red: 210, green: 220, blue: 230 };
  }

  const data = context.getImageData(0, 0, source.width, source.height).data;
  let red = 0;
  let green = 0;
  let blue = 0;
  let count = 0;

  for (let index = 0; index < data.length; index += 4) {
    if (data[index + 3] < 32) {
      continue;
    }
    red += data[index];
    green += data[index + 1];
    blue += data[index + 2];
    count += 1;
  }

  if (count === 0) {
    return { red: 210, green: 220, blue: 230 };
  }

  return {
    red: red / count,
    green: green / count,
    blue: blue / count
  };
}

function paletteFromImage(image?: HTMLImageElement): PixelTemplatePalette {
  if (!image) {
    return fallbackPalette;
  }

  const source = document.createElement('canvas');
  source.width = 24;
  source.height = 24;
  const sourceContext = source.getContext('2d');

  if (sourceContext) {
    const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
    const sourceX = Math.max(0, Math.floor((image.naturalWidth - sourceSize) / 2));
    const sourceY = Math.max(0, Math.floor((image.naturalHeight - sourceSize) / 2));
    sourceContext.imageSmoothingEnabled = false;
    sourceContext.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, source.width, source.height);
  }

  const average = averageImageColor(source);
  const body = {
    red: quantize(average.red * 0.22 + 255 * 0.78),
    green: quantize(average.green * 0.22 + 255 * 0.78),
    blue: quantize(average.blue * 0.22 + 255 * 0.78)
  };
  const accent = {
    red: quantize(average.red * 0.45 + 60),
    green: quantize(average.green * 0.45 + 88),
    blue: quantize(average.blue * 0.45 + 128)
  };
  const hair = {
    red: quantize(average.red * 0.38 + 72),
    green: quantize(average.green * 0.28 + 48),
    blue: quantize(average.blue * 0.2 + 40)
  };
  const outline = {
    red: quantize(average.red * 0.26 + 24),
    green: quantize(average.green * 0.26 + 28),
    blue: quantize(average.blue * 0.26 + 32)
  };

  return {
    body: hexFromRgb(body.red, body.green, body.blue),
    outline: hexFromRgb(outline.red, outline.green, outline.blue),
    accent: hexFromRgb(accent.red, accent.green, accent.blue),
    flipper: hexFromRgb(accent.red, accent.green, accent.blue),
    hair: hexFromRgb(hair.red, hair.green, hair.blue),
    outfit: '#f8fbff',
    shadow: hexFromRgb(outline.red * 0.72, outline.green * 0.72, outline.blue * 0.72),
    cheek: '#ff9fb3'
  };
}

function rect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string): void {
  context.fillStyle = color;
  context.fillRect(x, y, width, height);
}

function ellipse(
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radiusX: number,
  radiusY: number,
  color: string
): void {
  context.fillStyle = color;
  for (let y = Math.floor(centerY - radiusY); y <= Math.ceil(centerY + radiusY); y += 1) {
    for (let x = Math.floor(centerX - radiusX); x <= Math.ceil(centerX + radiusX); x += 1) {
      const dx = (x - centerX) / radiusX;
      const dy = (y - centerY) / radiusY;
      if (dx * dx + dy * dy <= 1) {
        context.fillRect(x, y, 1, 1);
      }
    }
  }
}

function face(context: CanvasRenderingContext2D, palette: PaletteUnion, y = 16): void {
  // Eyes: 4×5 with highlight
  rect(context, 17, y, 4, 5, '#19232b');
  rect(context, 28, y, 4, 5, '#19232b');
  rect(context, 18, y, 2, 1, '#ffffff');
  rect(context, 29, y, 2, 1, '#ffffff');
  // Mouth: 4×2 smile arc
  rect(context, 22, y + 6, 4, 2, '#19232b');
  // Cheeks: 4×3
  rect(context, 13, y + 5, 4, 3, palette.cheek);
  rect(context, 32, y + 5, 4, 3, palette.cheek);
}

// ─── Hair functions ────────────────────────────────────────────────────

/** Bob haircut (default, shoulder-length with side panels) */
function hairBob(context: CanvasRenderingContext2D, palette: PaletteUnion): void {
  ellipse(context, 24, 15, 14, 12, palette.outline);
  ellipse(context, 24, 16, 12, 10, palette.hair);
  rect(context, 12, 17, 6, 14, palette.hair);
  rect(context, 30, 17, 6, 14, palette.hair);
  rect(context, 18, 8, 13, 6, palette.hair);
  // Shadow areas giving face more space
  rect(context, 21, 14, 3, 2, palette.shadow);
  rect(context, 26, 14, 3, 2, palette.shadow);
}

/** Short hair (tight to head outline, no side extensions) */
function hairShort(context: CanvasRenderingContext2D, palette: PaletteUnion): void {
  // Outer contour: tighter ellipse around head
  ellipse(context, 24, 15, 12, 9, palette.outline);
  // Inner fill
  ellipse(context, 24, 16, 10, 7, palette.hair);
  // Top thickness
  rect(context, 16, 7, 17, 3, palette.hair);
  // No side panels — short hair stays close to head
  // Shadow areas
  rect(context, 21, 14, 3, 2, palette.shadow);
  rect(context, 26, 14, 3, 2, palette.shadow);
}

/** Long hair (side panels extending to waist) */
function hairLong(context: CanvasRenderingContext2D, palette: PaletteUnion): void {
  // Outer contour: wider, taller ellipse
  ellipse(context, 24, 15, 14, 13, palette.outline);
  // Inner fill
  ellipse(context, 24, 16, 12, 11, palette.hair);
  // Top coverage
  rect(context, 17, 8, 15, 6, palette.hair);
  // Left side panel: extending from shoulder to waist
  rect(context, 10, 17, 5, 22, palette.hair);
  // Right side panel
  rect(context, 34, 17, 5, 22, palette.hair);
  // Outline for side panels
  rect(context, 9, 17, 1, 22, palette.outline);
  rect(context, 39, 17, 1, 22, palette.outline);
  // Shadow areas
  rect(context, 21, 14, 3, 2, palette.shadow);
  rect(context, 26, 14, 3, 2, palette.shadow);
}

/** Curly hair (wide, puffy with small curl clusters on sides) */
function hairCurly(context: CanvasRenderingContext2D, palette: PaletteUnion): void {
  // Outer contour: wide ellipse
  ellipse(context, 24, 14, 16, 12, palette.outline);
  // Inner fill
  ellipse(context, 24, 15, 14, 10, palette.hair);
  // Left curl cluster
  ellipse(context, 10, 20, 4, 5, palette.hair);
  // Right curl cluster
  ellipse(context, 38, 20, 4, 5, palette.hair);
  // Top volume bump
  rect(context, 14, 5, 21, 5, palette.hair);
  // Top outline for volume
  rect(context, 14, 4, 21, 1, palette.outline);
  // Shadow areas
  rect(context, 20, 14, 4, 2, palette.shadow);
  rect(context, 26, 14, 4, 2, palette.shadow);
}

/**
 * Select the appropriate hair drawing function based on variant.
 */
function selectHairFunction(variant: 'short' | 'bob' | 'long' | 'curly'): (context: CanvasRenderingContext2D, palette: PaletteUnion) => void {
  switch (variant) {
    case 'short': return hairShort;
    case 'bob': return hairBob;
    case 'long': return hairLong;
    case 'curly': return hairCurly;
    default: return hairBob;
  }
}

// ─── Body parts ────────────────────────────────────────────────────────

function headphones(context: CanvasRenderingContext2D, palette: PaletteUnion): void {
  rect(context, 14, 6, 20, 3, '#f7fbff');
  rect(context, 11, 14, 5, 11, palette.outline);
  rect(context, 32, 14, 5, 11, palette.outline);
  rect(context, 12, 15, 3, 8, '#f7fbff');
  rect(context, 33, 15, 3, 8, '#f7fbff');
  rect(context, 12, 22, 3, 2, palette.accent);
  rect(context, 33, 22, 3, 2, palette.accent);
}

/** Head with dynamic skin color (palette.body instead of hardcoded #ffe6d2) */
function head(context: CanvasRenderingContext2D, palette: PaletteUnion): void {
  ellipse(context, 24, 19, 12, 11, palette.outline);
  ellipse(context, 24, 19, 10, 9, palette.body);  // Dynamic skin color
  face(context, palette, 17);
}

/** Arms with dynamic skin color */
function arms(context: CanvasRenderingContext2D, palette: PaletteUnion): void {
  // Shoulder transition
  rect(context, 13, 33, 3, 2, palette.outline);
  rect(context, 33, 33, 3, 2, palette.outline);
  // Arm outlines
  rect(context, 12, 35, 4, 12, palette.outline);
  rect(context, 33, 35, 4, 12, palette.outline);
  // Arm skin (dynamic)
  rect(context, 13, 36, 2, 10, palette.body);
  rect(context, 34, 36, 2, 10, palette.body);
  // Hands (dynamic)
  rect(context, 12, 46, 4, 3, palette.body);
  rect(context, 33, 46, 4, 3, palette.body);
}

/** Shoes with independent color from palette */
function shoes(context: CanvasRenderingContext2D, palette: PaletteUnion): void {
  const shoesColor = ('shoes' in palette) ? (palette as FeaturePalette).shoes : '#1f2428';
  const soleColor = '#12161a';
  // Upper shoe
  rect(context, 16, 56, 7, 4, shoesColor);
  rect(context, 26, 56, 7, 4, shoesColor);
  // Sole
  rect(context, 15, 60, 8, 3, soleColor);
  rect(context, 25, 60, 8, 3, soleColor);
}

// ─── Paint variant functions (with dynamic hair + accessories) ──────────

function paintApprovedBase(
  { context, palette }: TemplatePaint,
  hairFn: (ctx: CanvasRenderingContext2D, pal: PaletteUnion) => void,
  hasAccessories: boolean
): void {
  ellipse(context, 24, 61, 13, 2, palette.shadow);
  hairFn(context, palette);
  if (hasAccessories) headphones(context, palette);
  head(context, palette);
  arms(context, palette);
  rect(context, 17, 31, 15, 3, palette.outfit);
  rect(context, 16, 34, 17, 17, palette.outline);
  rect(context, 18, 34, 13, 17, palette.accent);
  rect(context, 20, 35, 2, 15, '#dff4ff');
  rect(context, 26, 35, 2, 15, '#dff4ff');
  rect(context, 18, 49, 13, 1, palette.accent);
  rect(context, 18, 51, 13, 8, palette.outfit);
  shoes(context, palette);
}

function paintSimpleDress(
  { context, palette }: TemplatePaint,
  hairFn: (ctx: CanvasRenderingContext2D, pal: PaletteUnion) => void,
  hasAccessories: boolean
): void {
  ellipse(context, 24, 61, 13, 2, palette.shadow);
  hairFn(context, palette);
  if (hasAccessories) headphones(context, palette);
  head(context, palette);
  arms(context, palette);
  rect(context, 17, 31, 15, 3, palette.outfit);
  rect(context, 16, 34, 17, 8, palette.accent);
  rect(context, 14, 42, 21, 17, palette.outfit);
  rect(context, 14, 42, 21, 2, palette.outline);
  shoes(context, palette);
}

function paintShortsCasual(
  { context, palette }: TemplatePaint,
  hairFn: (ctx: CanvasRenderingContext2D, pal: PaletteUnion) => void,
  hasAccessories: boolean
): void {
  ellipse(context, 24, 61, 13, 2, palette.shadow);
  hairFn(context, palette);
  if (hasAccessories) headphones(context, palette);
  head(context, palette);
  arms(context, palette);
  rect(context, 16, 32, 17, 14, palette.outfit);
  rect(context, 18, 34, 13, 10, palette.accent);
  rect(context, 17, 47, 7, 8, palette.outfit);
  rect(context, 26, 47, 7, 8, palette.outfit);
  shoes(context, palette);
}

function paintHoodieCasual(
  { context, palette }: TemplatePaint,
  hairFn: (ctx: CanvasRenderingContext2D, pal: PaletteUnion) => void,
  hasAccessories: boolean
): void {
  ellipse(context, 24, 61, 13, 2, palette.shadow);
  hairFn(context, palette);
  head(context, palette);
  rect(context, 14, 31, 20, 22, palette.outline);
  rect(context, 16, 33, 16, 18, palette.accent);
  rect(context, 21, 34, 2, 14, palette.outfit);
  rect(context, 26, 34, 2, 14, palette.outfit);
  rect(context, 11, 36, 5, 12, palette.outline);
  rect(context, 33, 36, 5, 12, palette.outline);
  rect(context, 17, 53, 6, 5, '#2d343a');
  rect(context, 27, 53, 6, 5, '#2d343a');
  shoes(context, palette);
}

function paintSoftUniform(
  { context, palette }: TemplatePaint,
  hairFn: (ctx: CanvasRenderingContext2D, pal: PaletteUnion) => void,
  hasAccessories: boolean
): void {
  ellipse(context, 24, 61, 13, 2, palette.shadow);
  hairFn(context, palette);
  if (hasAccessories) headphones(context, palette);
  head(context, palette);
  arms(context, palette);
  rect(context, 16, 32, 17, 14, palette.outfit);
  rect(context, 21, 34, 7, 4, palette.accent);
  rect(context, 15, 46, 19, 11, palette.accent);
  rect(context, 16, 46, 17, 2, palette.outline);
  shoes(context, palette);
}

// ─── Placeholder character ─────────────────────────────────────────────

/** Paint a minimal placeholder character (no hair detail, simple body) */
function paintPlaceholder({ context, palette }: TemplatePaint): void {
  // Head: simple circle
  ellipse(context, 24, 19, 10, 9, palette.outline);
  ellipse(context, 24, 19, 8, 7, palette.body);
  // Eyes: 2 small dots
  rect(context, 19, 17, 3, 3, '#19232b');
  rect(context, 27, 17, 3, 3, '#19232b');
  // Smile: 4 pixels wide
  rect(context, 22, 22, 4, 1, '#19232b');
  // Body: simple rectangle
  rect(context, 18, 28, 12, 18, palette.outline);
  rect(context, 20, 30, 8, 14, palette.outfit);
  // Arms: minimal
  rect(context, 14, 32, 4, 10, palette.outline);
  rect(context, 31, 32, 4, 10, palette.outline);
  rect(context, 15, 33, 2, 8, palette.body);
  rect(context, 32, 33, 2, 8, palette.body);
  // Shoes
  rect(context, 19, 48, 5, 3, '#1f2428');
  rect(context, 26, 48, 5, 3, '#1f2428');
  // Shadow
  ellipse(context, 24, 52, 8, 2, palette.shadow);
}

// ─── Variant dispatch ──────────────────────────────────────────────────

type PaintWithHair = (
  paint: TemplatePaint,
  hairFn: (ctx: CanvasRenderingContext2D, pal: PaletteUnion) => void,
  hasAccessories: boolean
) => void;

function paintVariant(
  variantId: string,
  paint: TemplatePaint,
  hairVariant: 'short' | 'bob' | 'long' | 'curly' = 'bob',
  hasAccessories: boolean = true
): void {
  const hairFn = selectHairFunction(hairVariant);

  // Special case: placeholder
  if (variantId === 'placeholder') {
    paintPlaceholder(paint);
    return;
  }

  const painters: Record<string, PaintWithHair> = {
    approved_base: paintApprovedBase,
    blue_shift: paintApprovedBase,
    light_shift: paintSimpleDress,
    warm_shift: paintShortsCasual,
    dark_shift: paintHoodieCasual,
    simple_dress: paintSimpleDress,
    shorts_casual: paintShortsCasual,
    hoodie_casual: paintHoodieCasual,
    soft_uniform: paintSoftUniform
  };

  const painterFn = painters[variantId] ?? paintApprovedBase;
  painterFn(paint, hairFn, hasAccessories);
}

// ─── Exported generation functions ──────────────────────────────────────

/**
 * NEW: Generate a pixel character from photo analysis results.
 * Uses FeatureResult to select hair variant, outfit variant, and dynamic colors.
 */
export function generateFromPhoto(
  image: HTMLImageElement,
  targetCanvas: HTMLCanvasElement,
  featureResult: FeatureResult
): FeaturePalette {
  const palette = buildFeaturePaletteFromResult(featureResult);
  const context = targetCanvas.getContext('2d');
  if (!context) return palette;

  targetCanvas.width = pixelTemplateSpec.canvasWidth;
  targetCanvas.height = pixelTemplateSpec.canvasHeight;
  context.imageSmoothingEnabled = false;
  context.clearRect(0, 0, targetCanvas.width, targetCanvas.height);

  paintVariant(featureResult.outfitVariant, { context, palette }, featureResult.hairVariant, featureResult.hasAccessories);
  return palette;
}

/**
 * Build FeaturePalette from FeatureResult (local version for this module).
 * This mirrors buildFeaturePalette from feature-recognizer.ts but is available
 * here for self-contained use.
 */
function buildFeaturePaletteFromResult(features: FeatureResult): FeaturePalette {
  const quantize = (v: number): number => Math.round(v / 24) * 24;
  const clamp = (v: number, min: number, max: number): number => Math.max(min, Math.min(max, v));
  const hex = (r: number, g: number, b: number): string =>
    `#${[r, g, b].map(v => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('')}`;

  const skinHex = hex(quantize(features.skinColor.red), quantize(features.skinColor.green), quantize(features.skinColor.blue));
  const hairHex = hex(quantize(features.hairColor.red), quantize(features.hairColor.green), quantize(features.hairColor.blue));
  const outfitHex = hex(quantize(features.outfitPrimaryColor.red), quantize(features.outfitPrimaryColor.green), quantize(features.outfitPrimaryColor.blue));
  const accentHex = hex(quantize(features.outfitSecondaryColor.red), quantize(features.outfitSecondaryColor.green), quantize(features.outfitSecondaryColor.blue));

  // Darken helpers
  const parseHex = (h: string): [number, number, number] => {
    const n = h.replace('#', '');
    return [Number.parseInt(n.substring(0, 2), 16), Number.parseInt(n.substring(2, 4), 16), Number.parseInt(n.substring(4, 6), 16)];
  };
  const darken = (h: string, factor: number): string => {
    const [r, g, b] = parseHex(h);
    return hex(Math.round(r * factor), Math.round(g * factor), Math.round(b * factor));
  };

  const outlineHex = darken(skinHex, 0.50);
  const shadowHex = darken(outlineHex, 0.70);
  const shoesHex = accentHex !== outfitHex ? accentHex : '#1f2428';

  return {
    hair: hairHex,
    body: skinHex,
    outline: outlineHex,
    accent: accentHex,
    outfit: outfitHex,
    flipper: accentHex,
    shadow: shadowHex,
    cheek: '#ff9fb3',
    shoes: shoesHex
  };
}

/**
 * OLD FLOW: Generate template pixel character with average-color palette.
 * Retained as fallback when both MediaPipe and Canvas segmentation fail.
 */
export function generateTemplatePixelCharacter(
  image: HTMLImageElement | null,
  targetCanvas: HTMLCanvasElement,
  variantId = pixelTemplateVariants[0].id
): PixelTemplatePalette {
  const palette = paletteFromImage(image ?? undefined);
  const context = targetCanvas.getContext('2d');
  if (!context) {
    return palette;
  }

  targetCanvas.width = pixelTemplateSpec.canvasWidth;
  targetCanvas.height = pixelTemplateSpec.canvasHeight;
  context.imageSmoothingEnabled = false;
  context.clearRect(0, 0, targetCanvas.width, targetCanvas.height);

  // For old flow, always use bob hair + accessories for approved_base
  paintVariant(variantId, { context, palette }, 'bob', true);
  return palette;
}
