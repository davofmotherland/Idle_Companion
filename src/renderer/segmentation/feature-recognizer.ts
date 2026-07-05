import {
  RegionPalette,
  SegmentationMask,
  PersonBoundingBox,
  FeatureResult,
  FeaturePalette
} from './types';
import { isSkinPixel } from './region-sampler';

/** Quantize a channel value to 24-step increments */
const quantize = (value: number): number => Math.round(value / 24) * 24;

/** Clamp a value to [min, max] */
const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

/** Convert RGB to hex color string */
function hexFromRgb(r: number, g: number, b: number): string {
  return `#${[r, g, b]
    .map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0'))
    .join('')}`;
}

/** Darken a hex color by a percentage factor */
function darkenHex(hex: string, factor: number): string {
  // Parse hex to RGB
  const normalized = hex.replace('#', '');
  const r = Number.parseInt(normalized.substring(0, 2), 16);
  const g = Number.parseInt(normalized.substring(2, 4), 16);
  const b = Number.parseInt(normalized.substring(4, 6), 16);
  return hexFromRgb(
    Math.round(r * factor),
    Math.round(g * factor),
    Math.round(b * factor)
  );
}

/** RGB Euclidean distance */
function rgbDistance(a: { red: number; green: number; blue: number }, b: { red: number; green: number; blue: number }): number {
  return Math.sqrt((a.red - b.red) ** 2 + (a.green - b.green) ** 2 + (a.blue - b.blue) ** 2);
}

/**
 * Determine hair variant from the segmentation mask.
 * Analyzes the hair region (y: 0%-25% of bbox) for non-skin pixels.
 *
 * Logic:
 * - Compute horizontal width ratio and vertical height ratio of hair pixels
 * - Width ratio ≤ 50% → short
 * - Width ratio 50%-70% → bob
 * - Width ratio ≥ 70% → curly
 * - Height ratio ≤ 20% → short (override)
 * - Height ratio ≥ 35% → long
 */
function determineHairVariant(
  mask: SegmentationMask,
  imageWidth: number,
  bbox: PersonBoundingBox
): 'short' | 'bob' | 'long' | 'curly' {
  const bboxTop = bbox.yMin;
  const bboxHeight = bbox.height;
  const hairYStart = bboxTop;
  const hairYEnd = bboxTop + Math.round(bboxHeight * 0.25);

  // Count non-skin person pixels in hair region
  // We approximate: all mask=1 pixels in hair region that are not skin-colored
  // Since we don't have imageData here, we use mask shape analysis instead

  let minX = bbox.xMax;
  let maxX = bbox.xMin;
  let minY = hairYEnd;
  let maxY = hairYStart;
  let hairPixelCount = 0;

  for (let y = hairYStart; y < hairYEnd; y++) {
    for (let x = bbox.xMin; x <= bbox.xMax; x++) {
      if (mask[y * imageWidth + x] === 1) {
        hairPixelCount += 1;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (hairPixelCount === 0) return 'short';

  // Width ratio: how wide the hair pixels span vs bbox width
  const hairWidth = maxX - minX + 1;
  const widthRatio = hairWidth / bbox.width;

  // Height ratio: how much of the hair region (y: 0%-25%) is filled with hair pixels.
  // hairRegionHeight is at most 25% of bboxHeight, so hairHeight/bboxHeight maxes out
  // at ~0.25 — the old threshold of 0.35 was unreachable. Instead we use
  // hairHeight / hairRegionHeight so the ratio ranges 0~1 and thresholds are meaningful.
  const hairRegionHeight = hairYEnd - hairYStart;
  const hairHeight = maxY - minY + 1;
  const heightRatio = hairRegionHeight > 0 ? hairHeight / hairRegionHeight : 0;

  // Height overrides first
  if (heightRatio <= 0.30) return 'short';
  if (heightRatio >= 0.70) return 'long';

  // Width-based classification (for heightRatio between 0.30–0.70)
  if (widthRatio <= 0.50) return 'short';
  if (widthRatio >= 0.70) return 'curly';
  return 'bob';
}

/**
 * Determine outfit variant from region palette.
 *
 * Logic:
 * - Color distance between upper and lower body primary colors
 * - Distance < 40 → simple_dress (same-color outfit = dress)
 * - Distance > 40 and lower body region is small → shorts_casual
 * - Distance > 40 and lower body region is large → approved_base (fallback)
 * - Unable to determine → approved_base
 */
function determineOutfitVariant(regionPalette: RegionPalette): FeatureResult['outfitVariant'] {
  const upperPrimary = regionPalette.upperBodyRegion.primary;
  const lowerPrimary = regionPalette.lowerBodyRegion.primary;

  const colorDist = rgbDistance(upperPrimary, lowerPrimary);

  if (colorDist < 40) {
    // Similar colors = dress/outfit
    return 'simple_dress';
  }

  // Different upper vs lower colors = separate top + bottom
  // Use saturation of lower region to decide shorts vs pants
  const lowerSat = Math.max(lowerPrimary.red, lowerPrimary.green, lowerPrimary.blue) -
    Math.min(lowerPrimary.red, lowerPrimary.green, lowerPrimary.blue);

  if (lowerSat < 30) {
    // Low saturation lower = likely dark pants
    return 'approved_base';
  }

  return 'shorts_casual';
}

/**
 * Detect accessories (headphones, hat) by checking head sides for
 * non-skin colored blocks outside the expected face ellipse.
 */
function detectAccessories(
  mask: SegmentationMask,
  imageData: ImageData,
  imageWidth: number,
  bbox: PersonBoundingBox
): boolean {
  const data = imageData.data;
  const bboxTop = bbox.yMin;
  const bboxHeight = bbox.height;
  const faceYStart = bboxTop + Math.round(bboxHeight * 0.25);
  const faceYEnd = bboxTop + Math.round(bboxHeight * 0.45);

  // Check left side of face (x < face center - face radius)
  const faceCenterX = (bbox.xMin + bbox.xMax) / 2;
  const faceRadiusX = bbox.width * 0.25;

  const leftXStart = Math.max(bbox.xMin, Math.floor(faceCenterX - faceRadiusX - bbox.width * 0.15));
  const leftXEnd = Math.floor(faceCenterX - faceRadiusX);
  const rightXStart = Math.ceil(faceCenterX + faceRadiusX);
  const rightXEnd = Math.min(bbox.xMax, Math.ceil(faceCenterX + faceRadiusX + bbox.width * 0.15));

  let nonSkinAccessoryPixels = 0;

  for (let y = faceYStart; y < faceYEnd; y++) {
    // Left side
    for (let x = leftXStart; x < leftXEnd; x++) {
      if (mask[y * imageWidth + x] !== 1) continue;
      const offset = (y * imageWidth + x) * 4;
      if (!isSkinPixel(data[offset], data[offset + 1], data[offset + 2])) {
        nonSkinAccessoryPixels += 1;
      }
    }
    // Right side
    for (let x = rightXStart; x < rightXEnd; x++) {
      if (mask[y * imageWidth + x] !== 1) continue;
      const offset = (y * imageWidth + x) * 4;
      if (!isSkinPixel(data[offset], data[offset + 1], data[offset + 2])) {
        nonSkinAccessoryPixels += 1;
      }
    }
  }

  // Threshold: if more than 10% of checked pixels are non-skin, assume accessories
  const totalCheckedPixels = (leftXEnd - leftXStart) * (faceYEnd - faceYStart) +
    (rightXEnd - rightXStart) * (faceYEnd - faceYStart);

  return totalCheckedPixels > 0 && nonSkinAccessoryPixels / totalCheckedPixels > 0.10;
}

/**
 * Recognize features from region palette and segmentation mask.
 * Determines hair variant, outfit variant, accessories, and key colors.
 */
export function recognizeFeatures(
  regionPalette: RegionPalette,
  mask: SegmentationMask,
  imageWidth: number,
  imageHeight: number,
  bbox: PersonBoundingBox
): FeatureResult {
  const hairVariant = determineHairVariant(mask, imageWidth, bbox);

  // Get a temp imageData reference — we need it for accessory detection
  // This function receives the mask but not imageData directly;
  // accessory detection needs imageData, so we skip it here and set default
  // (accessories will be detected separately in the processing pipeline)
  const hasAccessories = false; // Will be updated in renderer with imageData

  const outfitVariant = determineOutfitVariant(regionPalette);

  // Skin color: primary color of face region (should be skin-tone)
  // But verify it's actually skin-toned; if not, use YCbCr heuristic
  const facePrimary = regionPalette.faceRegion.primary;
  const skinColor = isSkinPixel(facePrimary.red, facePrimary.green, facePrimary.blue)
    ? facePrimary
    : { red: 255, green: 230, blue: 210 }; // fallback skin tone

  // Hair color: primary color of hair region, excluding skin pixels
  // Use secondary if primary looks like skin (hair region may contain face overlap)
  const hairPrimary = regionPalette.hairRegion.primary;
  const hairSecondary = regionPalette.hairRegion.secondary;
  const hairColor = isSkinPixel(hairPrimary.red, hairPrimary.green, hairPrimary.blue)
    ? hairSecondary
    : hairPrimary;

  // Outfit colors from body regions
  const outfitPrimaryColor = regionPalette.upperBodyRegion.primary;
  const outfitSecondaryColor = regionPalette.lowerBodyRegion.primary;

  return {
    hairVariant,
    outfitVariant,
    hasAccessories,
    skinColor,
    hairColor,
    outfitPrimaryColor,
    outfitSecondaryColor
  };
}

/**
 * Build a FeaturePalette from a FeatureResult for drawing the pixel character.
 */
export function buildFeaturePalette(features: FeatureResult): FeaturePalette {
  const skinHex = hexFromRgb(
    quantize(features.skinColor.red),
    quantize(features.skinColor.green),
    quantize(features.skinColor.blue)
  );
  const hairHex = hexFromRgb(
    quantize(features.hairColor.red),
    quantize(features.hairColor.green),
    quantize(features.hairColor.blue)
  );
  const outfitHex = hexFromRgb(
    quantize(features.outfitPrimaryColor.red),
    quantize(features.outfitPrimaryColor.green),
    quantize(features.outfitPrimaryColor.blue)
  );
  const accentHex = hexFromRgb(
    quantize(features.outfitSecondaryColor.red),
    quantize(features.outfitSecondaryColor.green),
    quantize(features.outfitSecondaryColor.blue)
  );

  // Outline: skin color darkened by 50%
  const outlineHex = darkenHex(skinHex, 0.50);

  // Shadow: outline darkened by 30% more
  const shadowHex = darkenHex(outlineHex, 0.70);

  // Shoes: use outfit secondary or fallback dark
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
 * Recognize features with full imageData for accessory detection.
 * This is the complete version used in the processing pipeline.
 */
export function recognizeFeaturesWithImageData(
  regionPalette: RegionPalette,
  mask: SegmentationMask,
  imageData: ImageData,
  imageWidth: number,
  imageHeight: number,
  bbox: PersonBoundingBox
): FeatureResult {
  const baseResult = recognizeFeatures(regionPalette, mask, imageWidth, imageHeight, bbox);
  const hasAccessories = detectAccessories(mask, imageData, imageWidth, bbox);
  return { ...baseResult, hasAccessories };
}
