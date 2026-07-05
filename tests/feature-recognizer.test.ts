/**
 * Tests for feature-recognizer.ts
 * Focus on pure logic functions: determineHairVariant, determineOutfitVariant,
 * recognizeFeatures, buildFeaturePalette, recognizeFeaturesWithImageData
 *
 * Note: recognizeFeaturesWithImageData requires ImageData (browser API).
 * We test the pure logic parts and mock where needed.
 */

import { describe, it, expect } from 'vitest';
import {
  recognizeFeatures,
  buildFeaturePalette,
  recognizeFeaturesWithImageData
} from '../src/renderer/segmentation/feature-recognizer';
import type {
  SegmentationMask,
  PersonBoundingBox,
  RegionPalette,
  RegionColors,
  FeatureResult,
  FeaturePalette
} from '../src/renderer/segmentation/types';

// ─── Helper: create a mask with person pixels ──────────────────────────

function createMaskWithRegion(
  imageWidth: number,
  imageHeight: number,
  fillFn: (x: number, y: number) => boolean
): SegmentationMask {
  const mask = new Uint8Array(imageWidth * imageHeight);
  for (let y = 0; y < imageHeight; y++) {
    for (let x = 0; x < imageWidth; x++) {
      if (fillFn(x, y)) {
        mask[y * imageWidth + x] = 1;
      }
    }
  }
  return mask;
}

// ─── Helper: create RegionPalette ──────────────────────────────────────

function makeRegionColors(r: number, g: number, b: number): RegionColors {
  return {
    primary: { red: r, green: g, blue: b },
    secondary: { red: r, green: g, blue: b }
  };
}

function makeRegionPalette(
  hair: RegionColors = makeRegionColors(107, 75, 62),
  face: RegionColors = makeRegionColors(255, 230, 210),
  upper: RegionColors = makeRegionColors(80, 120, 200),
  lower: RegionColors = makeRegionColors(40, 40, 40),
  feet: RegionColors = makeRegionColors(30, 30, 30)
): RegionPalette {
  return {
    hairRegion: hair,
    faceRegion: face,
    upperBodyRegion: upper,
    lowerBodyRegion: lower,
    feetRegion: feet
  };
}

// ─── determineHairVariant (tested through recognizeFeatures) ───────────

describe('determineHairVariant (via recognizeFeatures)', () => {
  it('returns "short" for a narrow mask (widthRatio ≤ 50%)', () => {
    // Create a 48x64 image with a narrow person column in the hair region
    // Hair region: y from 0 to 25% of bbox height
    // With the fixed logic: heightRatio = hairHeight / hairRegionHeight (0~1 range)
    const width = 48;
    const height = 64;
    const bbox: PersonBoundingBox = { xMin: 10, yMin: 0, xMax: 37, yMax: 50, width: 28, height: 51 };
    // Hair region height = round(51*0.25) = 13, so hair region spans y=0..12
    // Only 3 hair pixels in a single row → heightRatio = 1/13 ≈ 8% ≤ 0.30 → short override
    const mask = createMaskWithRegion(width, height, (x, y) => {
      if (y === 0 && x >= 14 && x <= 16) {
        return true;
      }
      return false;
    });

    const palette = makeRegionPalette();
    const result = recognizeFeatures(palette, mask, width, height, bbox);
    expect(result.hairVariant).toBe('short');
  });

  it('returns "short" when heightRatio ≤ 30%', () => {
    // Hair region spans very little vertical space → short override
    // With the fixed logic: heightRatio = hairHeight / hairRegionHeight
    const width = 48;
    const height = 64;
    const bbox: PersonBoundingBox = { xMin: 10, yMin: 0, xMax: 37, yMax: 50, width: 28, height: 51 };
    // Hair region height = round(51*0.25) = 13
    // Hair pixels only at y=0 (1 row), heightRatio = 1/13 ≈ 8% ≤ 0.30 → short
    const mask = createMaskWithRegion(width, height, (x, y) => {
      if (y === bbox.yMin && x >= bbox.xMin && x <= bbox.xMax) {
        return true;
      }
      return false;
    });

    const palette = makeRegionPalette();
    const result = recognizeFeatures(palette, mask, width, height, bbox);
    expect(result.hairVariant).toBe('short');
  });

  it('returns "curly" for a wide mask (widthRatio ≥ 70%)', () => {
    // Hair pixels span most of the bbox width → curly
    // With the fixed logic: heightRatio = hairHeight / hairRegionHeight
    const width = 48;
    const height = 64;
    const bbox: PersonBoundingBox = { xMin: 5, yMin: 0, xMax: 42, yMax: 50, width: 38, height: 51 };
    // Hair region height = round(51*0.25) = 13, spans y=0..12
    // Hair pixels: y=0..6 (7 rows out of 13 → heightRatio = 7/13 ≈ 54%, between 0.30-0.70)
    // Width spans full bbox: widthRatio = 38/38 = 100% ≥ 70% → curly
    const mask = createMaskWithRegion(width, height, (x, y) => {
      if (y >= 0 && y <= 6 && x >= bbox.xMin && x <= bbox.xMax) {
        return true;
      }
      return false;
    });

    const palette = makeRegionPalette();
    const result = recognizeFeatures(palette, mask, width, height, bbox);
    // heightRatio ≈ 54% (0.30-0.70 range, no override)
    // WidthRatio: 100% ≥ 70% → curly
    expect(result.hairVariant).toBe('curly');
  });

  it('FIXED: "long" variant is now reachable when hairRegionHeight is mostly filled', () => {
    // BUG WAS FIXED: determineHairVariant previously used heightRatio = hairHeight/bboxHeight,
    // which capped at ~25% (since hair region is only 25% of bbox), making the
    // "heightRatio >= 0.35" check unreachable.
    //
    // Fix: Changed heightRatio to hairHeight/hairRegionHeight (range 0~1).
    // Now "heightRatio >= 0.70" → 'long' is reachable when hair fills most of the hair region.
    //
    // This test verifies that a mask where hair pixels fill the entire hair region
    // correctly returns 'long'.
    const width = 48;
    const height = 64;
    const bbox: PersonBoundingBox = { xMin: 10, yMin: 0, xMax: 37, yMax: 50, width: 28, height: 51 };
    // Hair region: y=0 to y=round(51*0.25)=12, so hairRegionHeight = 13
    // Fill the entire hair region with mask pixels → heightRatio = 13/13 = 100% ≥ 0.70 → long
    const mask = createMaskWithRegion(width, height, (x, y) => {
      if (y >= bbox.yMin && y < bbox.yMin + Math.round(bbox.height * 0.25) && x >= bbox.xMin && x <= bbox.xMax) {
        return true;
      }
      return false;
    });

    const palette = makeRegionPalette();
    const result = recognizeFeatures(palette, mask, width, height, bbox);
    // With fix: heightRatio = 13/13 = 1.0 ≥ 0.70 → 'long' is now correctly returned
    expect(result.hairVariant).toBe('long');
  });

  it('returns "short" when no hair pixels exist (hairPixelCount=0)', () => {
    const width = 48;
    const height = 64;
    const bbox: PersonBoundingBox = { xMin: 10, yMin: 0, xMax: 37, yMax: 50, width: 28, height: 51 };
    // No person pixels in hair region
    const mask = createMaskWithRegion(width, height, () => false);

    const palette = makeRegionPalette();
    const result = recognizeFeatures(palette, mask, width, height, bbox);
    expect(result.hairVariant).toBe('short');
  });
});

// ─── determineOutfitVariant (tested through recognizeFeatures) ─────────

describe('determineOutfitVariant (via recognizeFeatures)', () => {
  it('returns "simple_dress" when upper and lower body colors are similar (distance < 40)', () => {
    // Upper and lower body have nearly identical colors → dress
    const palette = makeRegionPalette(
      makeRegionColors(107, 75, 62),  // hair
      makeRegionColors(255, 230, 210),  // face
      makeRegionColors(80, 120, 200),  // upper
      makeRegionColors(85, 125, 205),  // lower (close to upper)
      makeRegionColors(30, 30, 30)   // feet
    );
    const width = 48;
    const height = 64;
    const bbox: PersonBoundingBox = { xMin: 10, yMin: 0, xMax: 37, yMax: 50, width: 28, height: 51 };
    // Need some mask pixels to avoid null bbox
    const mask = createMaskWithRegion(width, height, (x, y) => {
      return y >= 0 && y <= 15 && x >= bbox.xMin && x <= bbox.xMax;
    });

    const result = recognizeFeatures(palette, mask, width, height, bbox);
    expect(result.outfitVariant).toBe('simple_dress');
  });

  it('returns "shorts_casual" when upper and lower differ and lower has saturation ≥ 30', () => {
    // Upper: blue, Lower: green (different + saturated)
    const palette = makeRegionPalette(
      makeRegionColors(107, 75, 62),  // hair
      makeRegionColors(255, 230, 210),  // face
      makeRegionColors(80, 120, 200),  // upper body (blue)
      makeRegionColors(50, 180, 100),  // lower body (green, high sat)
      makeRegionColors(30, 30, 30)   // feet
    );
    const width = 48;
    const height = 64;
    const bbox: PersonBoundingBox = { xMin: 10, yMin: 0, xMax: 37, yMax: 50, width: 28, height: 51 };
    const mask = createMaskWithRegion(width, height, (x, y) => {
      return y >= 0 && y <= 15 && x >= bbox.xMin && x <= bbox.xMax;
    });

    const result = recognizeFeatures(palette, mask, width, height, bbox);
    expect(result.outfitVariant).toBe('shorts_casual');
  });

  it('returns "approved_base" when upper and lower differ and lower has low saturation (< 30)', () => {
    // Upper: blue, Lower: dark gray (different + low saturation)
    const palette = makeRegionPalette(
      makeRegionColors(107, 75, 62),  // hair
      makeRegionColors(255, 230, 210),  // face
      makeRegionColors(80, 120, 200),  // upper body (blue)
      makeRegionColors(50, 52, 55),  // lower body (dark, low sat: max-min=55-50=5 < 30)
      makeRegionColors(30, 30, 30)   // feet
    );
    const width = 48;
    const height = 64;
    const bbox: PersonBoundingBox = { xMin: 10, yMin: 0, xMax: 37, yMax: 50, width: 28, height: 51 };
    const mask = createMaskWithRegion(width, height, (x, y) => {
      return y >= 0 && y <= 15 && x >= bbox.xMin && x <= bbox.xMax;
    });

    const result = recognizeFeatures(palette, mask, width, height, bbox);
    expect(result.outfitVariant).toBe('approved_base');
  });
});

// ─── recognizeFeatures tests ────────────────────────────────────────────

describe('recognizeFeatures', () => {
  it('returns a FeatureResult with correct structure', () => {
    const palette = makeRegionPalette();
    const width = 48;
    const height = 64;
    const bbox: PersonBoundingBox = { xMin: 10, yMin: 0, xMax: 37, yMax: 50, width: 28, height: 51 };
    const mask = createMaskWithRegion(width, height, (x, y) => {
      return y >= 0 && y <= 15 && x >= bbox.xMin && x <= bbox.xMax;
    });

    const result = recognizeFeatures(palette, mask, width, height, bbox);

    // Verify all expected fields exist
    expect(result.hairVariant).toBeDefined();
    expect(result.outfitVariant).toBeDefined();
    expect(result.hasAccessories).toBe(false); // always false in this version (no imageData)
    expect(result.skinColor).toBeDefined();
    expect(result.hairColor).toBeDefined();
    expect(result.outfitPrimaryColor).toBeDefined();
    expect(result.outfitSecondaryColor).toBeDefined();
  });

  it('uses skin color from face region when face is skin-toned', () => {
    // Face primary is skin-toned → skinColor = face primary
    const faceColor = makeRegionColors(255, 230, 210); // skin color
    const palette = makeRegionPalette(undefined, faceColor);
    const width = 48;
    const height = 64;
    const bbox: PersonBoundingBox = { xMin: 10, yMin: 0, xMax: 37, yMax: 50, width: 28, height: 51 };
    const mask = createMaskWithRegion(width, height, (x, y) => {
      return y >= 0 && y <= 15 && x >= bbox.xMin && x <= bbox.xMax;
    });

    const result = recognizeFeatures(palette, mask, width, height, bbox);
    expect(result.skinColor.red).toBe(255);
    expect(result.skinColor.green).toBe(230);
    expect(result.skinColor.blue).toBe(210);
  });

  it('uses fallback skin color when face primary is not skin-toned', () => {
    // Face primary is NOT skin-toned → fallback (255, 230, 210)
    const faceColor = makeRegionColors(0, 255, 0); // green, not skin
    const palette = makeRegionPalette(undefined, faceColor);
    const width = 48;
    const height = 64;
    const bbox: PersonBoundingBox = { xMin: 10, yMin: 0, xMax: 37, yMax: 50, width: 28, height: 51 };
    const mask = createMaskWithRegion(width, height, (x, y) => {
      return y >= 0 && y <= 15 && x >= bbox.xMin && x <= bbox.xMax;
    });

    const result = recognizeFeatures(palette, mask, width, height, bbox);
    expect(result.skinColor.red).toBe(255);
    expect(result.skinColor.green).toBe(230);
    expect(result.skinColor.blue).toBe(210); // fallback
  });

  it('uses hair secondary color when hair primary is skin-toned', () => {
    // Hair primary is skin color → use secondary instead
    const hairColor: RegionColors = {
      primary: { red: 255, green: 230, blue: 210 }, // skin color (should be skipped)
      secondary: { red: 107, green: 75, blue: 62 }  // brown hair color
    };
    const palette = makeRegionPalette(hairColor);
    const width = 48;
    const height = 64;
    const bbox: PersonBoundingBox = { xMin: 10, yMin: 0, xMax: 37, yMax: 50, width: 28, height: 51 };
    const mask = createMaskWithRegion(width, height, (x, y) => {
      return y >= 0 && y <= 15 && x >= bbox.xMin && x <= bbox.xMax;
    });

    const result = recognizeFeatures(palette, mask, width, height, bbox);
    // Hair primary is skin-toned, so should use secondary
    // secondary is {red: 107, green: 75, blue: 62}
    expect(result.hairColor.red).toBe(107);
    expect(result.hairColor.green).toBe(75);
    expect(result.hairColor.blue).toBe(62);
  });

  it('uses hair primary when it is NOT skin-toned', () => {
    // Need a color that is NOT detected as skin by isSkinPixel
    // Pure blue (R=0, G=0, B=200) is NOT skin → use primary
    const hairColor: RegionColors = {
      primary: { red: 0, green: 0, blue: 200 }, // blue, not skin
      secondary: { red: 100, green: 80, blue: 70 }
    };
    const palette = makeRegionPalette(hairColor);
    const width = 48;
    const height = 64;
    const bbox: PersonBoundingBox = { xMin: 10, yMin: 0, xMax: 37, yMax: 50, width: 28, height: 51 };
    const mask = createMaskWithRegion(width, height, (x, y) => {
      return y >= 0 && y <= 15 && x >= bbox.xMin && x <= bbox.xMax;
    });

    const result = recognizeFeatures(palette, mask, width, height, bbox);
    expect(result.hairColor.red).toBe(0);    // primary
    expect(result.hairColor.green).toBe(0);
    expect(result.hairColor.blue).toBe(200);
  });
});

// ─── buildFeaturePalette tests ─────────────────────────────────────────

describe('buildFeaturePalette', () => {
  it('maps FeatureResult colors to hex strings with quantization', () => {
    const features: FeatureResult = {
      hairVariant: 'bob',
      outfitVariant: 'approved_base',
      hasAccessories: false,
      skinColor: { red: 255, green: 230, blue: 210 },
      hairColor: { red: 107, green: 75, blue: 62 },
      outfitPrimaryColor: { red: 80, green: 120, blue: 200 },
      outfitSecondaryColor: { red: 40, green: 40, blue: 40 }
    };

    const palette = buildFeaturePalette(features);

    // skin: quantize(255)=264→clamped to 255→0xff, quantize(230)=240→0xf0, quantize(210)=216→0xd8
    // Note: quantize rounds to nearest multiple of 24.
    // quantize(255) = round(10.625)*24 = 264, clamped by hexFromRgb to 255 → 0xff
    // quantize(230) = round(9.583)*24 = 240 → 0xf0
    // quantize(210) = round(8.75)*24 = 216 → 0xd8
    expect(palette.body).toBe('#fff0d8');

    // hair: quantize(107)=96→0x60, quantize(75)=72→0x48, quantize(62)=72→0x48
    // Note: quantize(62) = round(2.583)*24 = 72 (not 48!)
    expect(palette.hair).toBe('#604848');

    // outfit: quantize(80)=72→0x48, quantize(120)=120→0x78, quantize(200)=192→0xc0
    expect(palette.outfit).toBe('#4878c0');

    // accent: quantize(40)=48→0x30, quantize(40)=48→0x30, quantize(40)=48→0x30
    expect(palette.accent).toBe('#303030');

    // outline: skinHex (#fff0d8) darkened by 50%
    // Parse #fff0d8: r=255, g=240, b=216 → darkened: r=128, g=120, b=108 → #80786c
    expect(palette.outline).toBe('#80786c');

    // shadow: outline (#80786c) darkened by 70%
    // r=128*0.70=90→0x5a, g=120*0.70=84→0x54, b=108*0.70=76→0x4c
    expect(palette.shadow).toBe('#5a544c');

    // cheek: always '#ff9fb3'
    expect(palette.cheek).toBe('#ff9fb3');

    // flipper: accent color
    expect(palette.flipper).toBe('#303030');

    // shoes: accent !== outfit → accent, else '#1f2428'
    expect(palette.shoes).toBe('#303030'); // accent (#303030) !== outfit (#4878c0)
  });

  it('uses fallback shoes color when accent equals outfit', () => {
    const features: FeatureResult = {
      hairVariant: 'short',
      outfitVariant: 'simple_dress',
      hasAccessories: false,
      skinColor: { red: 255, green: 230, blue: 210 },
      hairColor: { red: 107, green: 75, blue: 62 },
      outfitPrimaryColor: { red: 80, green: 120, blue: 200 },
      outfitSecondaryColor: { red: 80, green: 120, blue: 200 } // same as primary!
    };

    const palette = buildFeaturePalette(features);

    // When accent === outfit, shoes fallback to '#1f2428'
    // accent = quantize(80,120,200) = #4878c0
    // outfit = quantize(80,120,200) = #4878c0
    // Same → shoes = '#1f2428'
    expect(palette.shoes).toBe('#1f2428');
  });

  it('correctly darkens outline from skin color', () => {
    // Test with a very dark skin color
    const features: FeatureResult = {
      hairVariant: 'bob',
      outfitVariant: 'approved_base',
      hasAccessories: false,
      skinColor: { red: 100, green: 70, blue: 50 },
      hairColor: { red: 60, green: 40, blue: 30 },
      outfitPrimaryColor: { red: 200, green: 50, blue: 50 },
      outfitSecondaryColor: { red: 50, green: 50, blue: 50 }
    };

    const palette = buildFeaturePalette(features);

    // skin: quantize(100)=96→0x60, quantize(70)=72→0x48, quantize(50)=48→0x30
    // body = #604830
    expect(palette.body).toBe('#604830');

    // outline = darken(#604830, 0.50)
    // r=96*0.50=48→0x30, g=72*0.50=36→0x24, b=48*0.50=24→0x18
    // outline = #302418
    expect(palette.outline).toBe('#302418');
  });
});

// ─── recognizeFeaturesWithImageData tests ──────────────────────────────

describe('recognizeFeaturesWithImageData', () => {
  it('sets hasAccessories to false when no accessory pixels are found', () => {
    // Create mock imageData with all skin-colored pixels → no accessories
    const width = 48;
    const height = 64;
    const bbox: PersonBoundingBox = { xMin: 10, yMin: 0, xMax: 37, yMax: 50, width: 28, height: 51 };
    const mask = createMaskWithRegion(width, height, (x, y) => {
      return x >= bbox.xMin && x <= bbox.xMax && y >= bbox.yMin && y <= bbox.yMax;
    });

    const data = new Uint8ClampedArray(width * height * 4);
    // Fill with skin-colored pixels
    for (let i = 0; i < width * height; i++) {
      data[i * 4] = 255;     // R
      data[i * 4 + 1] = 230; // G
      data[i * 4 + 2] = 210; // B
      data[i * 4 + 3] = 255; // A
    }

    const mockImageData = { data, width, height };

    const palette = makeRegionPalette();
    const result = recognizeFeaturesWithImageData(
      palette, mask, mockImageData as any, width, height, bbox
    );

    // All skin pixels → no accessories detected
    expect(result.hasAccessories).toBe(false);
  });

  it('sets hasAccessories to true when non-skin accessory pixels exist near face sides', () => {
    const width = 48;
    const height = 64;
    const bbox: PersonBoundingBox = { xMin: 10, yMin: 0, xMax: 37, yMax: 50, width: 28, height: 51 };
    const mask = createMaskWithRegion(width, height, (x, y) => {
      return x >= bbox.xMin && x <= bbox.xMax && y >= bbox.yMin && y <= bbox.yMax;
    });

    const data = new Uint8ClampedArray(width * height * 4);
    // Fill face region with skin color, sides with non-skin (accessory)
    const faceCenterX = (bbox.xMin + bbox.xMax) / 2; // 23.5
    const faceRadiusX = bbox.width * 0.25; // 7
    // faceY: 25%-45% of bbox height = 0 + 13 to 0 + 23

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const faceYStart = bbox.yMin + Math.round(bbox.height * 0.25);
        const faceYEnd = bbox.yMin + Math.round(bbox.height * 0.45);
        const leftXStart = Math.max(bbox.xMin, Math.floor(faceCenterX - faceRadiusX - bbox.width * 0.15));
        const leftXEnd = Math.floor(faceCenterX - faceRadiusX);
        const rightXStart = Math.ceil(faceCenterX + faceRadiusX);
        const rightXEnd = Math.min(bbox.xMax, Math.ceil(faceCenterX + faceRadiusX + bbox.width * 0.15));

        // Make left and right sides of face region be dark (headphone-like)
        if (y >= faceYStart && y < faceYEnd &&
          (x >= leftXStart && x < leftXEnd || x >= rightXStart && x <= rightXEnd)) {
          data[i] = 30;     // R (dark = headphone)
          data[i + 1] = 30; // G
          data[i + 2] = 30; // B
        } else {
          data[i] = 255;     // R (skin)
          data[i + 1] = 230; // G
          data[i + 2] = 210; // B
        }
        data[i + 3] = 255;
      }
    }

    const mockImageData = { data, width, height };

    const palette = makeRegionPalette();
    const result = recognizeFeaturesWithImageData(
      palette, mask, mockImageData as any, width, height, bbox
    );

    expect(result.hasAccessories).toBe(true);
  });

  it('inherits base result from recognizeFeatures', () => {
    const width = 48;
    const height = 64;
    const bbox: PersonBoundingBox = { xMin: 10, yMin: 0, xMax: 37, yMax: 50, width: 28, height: 51 };
    const mask = createMaskWithRegion(width, height, (x, y) => {
      return y >= 0 && y <= 15 && x >= bbox.xMin && x <= bbox.xMax;
    });

    const data = new Uint8ClampedArray(width * height * 4);
    for (let i = 0; i < width * height; i++) {
      data[i * 4] = 255;
      data[i * 4 + 1] = 230;
      data[i * 4 + 2] = 210;
      data[i * 4 + 3] = 255;
    }
    const mockImageData = { data, width, height };

    const palette = makeRegionPalette();
    const result = recognizeFeaturesWithImageData(
      palette, mask, mockImageData as any, width, height, bbox
    );

    // Should inherit all fields from recognizeFeatures
    expect(result.hairVariant).toBeDefined();
    expect(result.outfitVariant).toBeDefined();
    expect(result.skinColor).toBeDefined();
    expect(result.hairColor).toBeDefined();
    expect(result.outfitPrimaryColor).toBeDefined();
    expect(result.outfitSecondaryColor).toBeDefined();
  });
});
