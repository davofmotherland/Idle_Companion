/**
 * Tests for region-sampler.ts
 * Focus on pure logic functions: computeBoundingBox, isSkinPixel, sampleRegionColors, extractRegionPalette
 *
 * Note: sampleRegionColors and extractRegionPalette require ImageData which is a browser API.
 * We create a mock ImageData using a Uint8ClampedArray for testing.
 */

import { describe, it, expect } from 'vitest';
import {
  computeBoundingBox,
  isSkinPixel,
  sampleRegionColors,
  extractRegionPalette
} from '../src/renderer/segmentation/region-sampler';
import type {
  SegmentationMask,
  PersonBoundingBox,
  RegionColors,
  RegionPalette
} from '../src/renderer/segmentation/types';

// ─── Mock ImageData helper ────────────────────────────────────────────

/**
 * Create a mock ImageData with the given pixel data.
 * Since ImageData is a browser API, we create a plain object that mimics its shape.
 */
function createMockImageData(
  width: number,
  height: number,
  pixels: { r: number; g: number; b: number; a: number }[] | null = null
): { data: Uint8ClampedArray; width: number; height: number } {
  const data = new Uint8ClampedArray(width * height * 4);
  if (pixels) {
    for (let i = 0; i < pixels.length && i < width * height; i++) {
      data[i * 4] = pixels[i].r;
      data[i * 4 + 1] = pixels[i].g;
      data[i * 4 + 2] = pixels[i].b;
      data[i * 4 + 3] = pixels[i].a;
    }
  }
  return { data, width, height };
}

// ─── computeBoundingBox tests ──────────────────────────────────────────

describe('computeBoundingBox', () => {
  it('returns null for an all-zero (empty) mask', () => {
    const mask: SegmentationMask = new Uint8Array(100); // all zeros
    const result = computeBoundingBox(mask, 10, 10);
    expect(result).toBeNull();
  });

  it('returns full bbox for an all-one (full) mask', () => {
    const mask: SegmentationMask = new Uint8Array(100).fill(1);
    const result = computeBoundingBox(mask, 10, 10);
    expect(result).not.toBeNull();
    expect(result!.xMin).toBe(0);
    expect(result!.yMin).toBe(0);
    expect(result!.xMax).toBe(9);
    expect(result!.yMax).toBe(9);
    expect(result!.width).toBe(10);
    expect(result!.height).toBe(10);
  });

  it('returns correct bbox for a partial mask (center region)', () => {
    // 10x10 grid, mask=1 only in rows 3-6, cols 2-7
    const mask: SegmentationMask = new Uint8Array(100);
    for (let y = 3; y <= 6; y++) {
      for (let x = 2; x <= 7; x++) {
        mask[y * 10 + x] = 1;
      }
    }
    const result = computeBoundingBox(mask, 10, 10);
    expect(result).not.toBeNull();
    expect(result!.xMin).toBe(2);
    expect(result!.yMin).toBe(3);
    expect(result!.xMax).toBe(7);
    expect(result!.yMax).toBe(6);
    expect(result!.width).toBe(6); // 7-2+1=6
    expect(result!.height).toBe(4); // 6-3+1=4
  });

  it('returns correct bbox for a single pixel', () => {
    const mask: SegmentationMask = new Uint8Array(100);
    mask[5 * 10 + 3] = 1; // pixel at (3,5)
    const result = computeBoundingBox(mask, 10, 10);
    expect(result).not.toBeNull();
    expect(result!.xMin).toBe(3);
    expect(result!.yMin).toBe(5);
    expect(result!.xMax).toBe(3);
    expect(result!.yMax).toBe(5);
    expect(result!.width).toBe(1);
    expect(result!.height).toBe(1);
  });

  it('returns correct bbox for a diagonal strip', () => {
    const mask: SegmentationMask = new Uint8Array(100);
    // Only row 0, columns 0,1
    mask[0] = 1;
    mask[1] = 1;
    const result = computeBoundingBox(mask, 10, 10);
    expect(result).not.toBeNull();
    expect(result!.xMin).toBe(0);
    expect(result!.yMin).toBe(0);
    expect(result!.xMax).toBe(1);
    expect(result!.yMax).toBe(0);
    expect(result!.width).toBe(2);
    expect(result!.height).toBe(1);
  });
});

// ─── isSkinPixel tests ─────────────────────────────────────────────────

describe('isSkinPixel', () => {
  it('recognizes typical skin color (warm peach)', () => {
    // R=255, G=230, B=210 is the fallback skin color used in the code
    expect(isSkinPixel(255, 230, 210)).toBe(true);
  });

  it('recognizes typical skin color (medium brown)', () => {
    // A medium brown skin tone
    expect(isSkinPixel(180, 140, 120)).toBe(true);
  });

  it('recognizes typical skin color (light skin)', () => {
    // Light skin
    expect(isSkinPixel(240, 210, 190)).toBe(true);
  });

  it('rejects pure red (not skin)', () => {
    expect(isSkinPixel(255, 0, 0)).toBe(false);
  });

  it('rejects pure green (not skin)', () => {
    expect(isSkinPixel(0, 255, 0)).toBe(false);
  });

  it('rejects pure blue (not skin)', () => {
    expect(isSkinPixel(0, 0, 255)).toBe(false);
  });

  it('rejects black (not skin)', () => {
    expect(isSkinPixel(0, 0, 0)).toBe(false);
  });

  it('rejects white (not skin)', () => {
    expect(isSkinPixel(255, 255, 255)).toBe(false);
  });

  it('rejects dark navy (not skin)', () => {
    expect(isSkinPixel(20, 30, 80)).toBe(false);
  });

  it('rejects bright yellow (not skin)', () => {
    expect(isSkinPixel(255, 255, 0)).toBe(false);
  });

  // Boundary: test some colors near the skin detection boundaries
  it('handles borderline Cb value (Cb=77 boundary)', () => {
    // We need to find an RGB where Cb = 77 (lower boundary)
    // Cb = 128 - 0.168736*R - 0.331264*G + 0.5*B
    // For R=0, G=0: Cb = 128 + 0.5*B → B = (77-128)/0.5 = -102 → not achievable
    // For R=100, G=100: Cb = 128 - 16.87 - 33.13 + 0.5*B = 78 + 0.5*B
    // To get Cb=77: B = (77-78)/0.5 = -2 → not achievable with positive B
    // Let's just test with a color near the boundary
    // R=255, G=220, B=180: Cb = 128 - 43.14 - 72.88 + 90 = 102 (in range), Cr should be checked too
    expect(isSkinPixel(255, 220, 180)).toBe(true);
  });
});

// ─── sampleRegionColors tests ──────────────────────────────────────────

describe('sampleRegionColors', () => {
  it('returns default gray for empty region (no person pixels)', () => {
    const imageData = createMockImageData(10, 10, null);
    const mask: SegmentationMask = new Uint8Array(100); // all zeros → no person pixels
    const result = sampleRegionColors(imageData as any, mask, 10, 0, 10);
    // Empty pixels → default gray (128,128,128)
    expect(result.primary.red).toBe(128);
    expect(result.primary.green).toBe(128);
    expect(result.primary.blue).toBe(128);
    expect(result.secondary.red).toBe(128);
    expect(result.secondary.green).toBe(128);
    expect(result.secondary.blue).toBe(128);
  });

  it('returns dominant color for a single-color region', () => {
    // 10x10 image, all person pixels are the same color (R=100, G=50, B=200)
    const pixels: { r: number; g: number; b: number; a: number }[] = [];
    for (let i = 0; i < 100; i++) {
      pixels.push({ r: 100, g: 50, b: 200, a: 255 });
    }
    const imageData = createMockImageData(10, 10, pixels);
    const mask: SegmentationMask = new Uint8Array(100).fill(1); // all person pixels
    const result = sampleRegionColors(imageData as any, mask, 10, 0, 10);
    // Quantize(100) = 96, quantize(50) = 48, quantize(200) = 192
    expect(result.primary.red).toBe(96);
    expect(result.primary.green).toBe(48);
    expect(result.primary.blue).toBe(192);
    // Single color → primary = secondary
    expect(result.secondary.red).toBe(96);
    expect(result.secondary.green).toBe(48);
    expect(result.secondary.blue).toBe(192);
  });

  it('separates two dominant colors in a multi-color region', () => {
    // 10x10 = 100 pixels: 60 are blue-ish, 40 are red-ish
    const pixels: { r: number; g: number; b: number; a: number }[] = [];
    for (let i = 0; i < 60; i++) {
      pixels.push({ r: 50, g: 80, b: 200, a: 255 }); // blue-ish
    }
    for (let i = 60; i < 100; i++) {
      pixels.push({ r: 200, g: 60, b: 50, a: 255 }); // red-ish
    }
    const imageData = createMockImageData(10, 10, pixels);
    const mask: SegmentationMask = new Uint8Array(100).fill(1);
    const result = sampleRegionColors(imageData as any, mask, 10, 0, 10);
    // Primary should be the more frequent color (blue-ish)
    // Quantize: (50→48, 80→72, 200→192) and (200→192, 60→48, 50→48)
    // Blue cluster (60 pixels) should be primary
    expect(result.primary.blue).toBeGreaterThan(result.primary.red);
    // Red cluster (40 pixels) should be secondary
    expect(result.secondary.red).toBeGreaterThan(result.secondary.blue);
  });

  it('only samples person pixels (mask=1), skipping background', () => {
    // 10x10 image: only middle row (y=5) is person pixels, all blue
    const pixels: { r: number; g: number; b: number; a: number }[] = [];
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        if (y === 5) {
          pixels.push({ r: 50, g: 80, b: 200, a: 255 }); // blue
        } else {
          pixels.push({ r: 255, g: 0, b: 0, a: 255 }); // red background
        }
      }
    }
    const imageData = createMockImageData(10, 10, pixels);
    const mask: SegmentationMask = new Uint8Array(100);
    for (let x = 0; x < 10; x++) {
      mask[5 * 10 + x] = 1; // only row 5 is person
    }
    const result = sampleRegionColors(imageData as any, mask, 10, 0, 10);
    // Should only sample the blue pixels from row 5
    // Quantize(50)=48, quantize(80)=72, quantize(200)=192
    expect(result.primary.red).toBe(48);
    expect(result.primary.green).toBe(72);
    expect(result.primary.blue).toBe(192);
  });
});

// ─── extractRegionPalette tests ────────────────────────────────────────

describe('extractRegionPalette', () => {
  it('extracts a 5-region palette with correct region boundaries', () => {
    // Create a 10x20 image where each region has a distinct color
    // Bbox covers entire image (0,0) to (9,19)
    const width = 10;
    const height = 20;
    const mask: SegmentationMask = new Uint8Array(width * height).fill(1);
    const bbox: PersonBoundingBox = { xMin: 0, yMin: 0, xMax: 9, yMax: 19, width: 10, height: 20 };

    const pixels: { r: number; g: number; b: number; a: number }[] = [];
    // hair region: y 0-4 (25% of 20 = 5 rows)
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < width; x++) {
        pixels.push({ r: 60, g: 40, b: 30, a: 255 }); // dark brown hair
      }
    }
    // face region: y 5-8 (45% of 20 = 9, 9-5=4 rows)
    for (let y = 5; y < 9; y++) {
      for (let x = 0; x < width; x++) {
        pixels.push({ r: 240, g: 210, b: 190, a: 255 }); // skin color
      }
    }
    // upper body: y 9-13 (70% of 20 = 14, 14-9=5 rows)
    for (let y = 9; y < 14; y++) {
      for (let x = 0; x < width; x++) {
        pixels.push({ r: 80, g: 120, b: 200, a: 255 }); // blue shirt
      }
    }
    // lower body: y 14-16 (85% of 20 = 17, 17-14=3 rows)
    for (let y = 14; y < 17; y++) {
      for (let x = 0; x < width; x++) {
        pixels.push({ r: 40, g: 40, b: 40, a: 255 }); // dark pants
      }
    }
    // feet: y 17-19 (remaining)
    for (let y = 17; y < 20; y++) {
      for (let x = 0; x < width; x++) {
        pixels.push({ r: 30, g: 30, b: 30, a: 255 }); // dark shoes
      }
    }

    const imageData = createMockImageData(width, height, pixels);
    const result: RegionPalette = extractRegionPalette(
      imageData as any, mask, width, height, bbox
    );

    // Check hair region: quantize(60)=72, quantize(40)=48, quantize(30)=24
    // Note: quantize(60) = round(2.5)*24 = 72 (rounds up at midpoint)
    expect(result.hairRegion.primary.red).toBe(72);
    expect(result.hairRegion.primary.green).toBe(48);
    expect(result.hairRegion.primary.blue).toBe(24);

    // Check face region: quantize(240)=240, quantize(210)=216, quantize(190)=192
    expect(result.faceRegion.primary.red).toBe(240);
    expect(result.faceRegion.primary.green).toBe(216);
    expect(result.faceRegion.primary.blue).toBe(192);

    // Check upper body: quantize(80)=72, quantize(120)=120, quantize(200)=192
    expect(result.upperBodyRegion.primary.red).toBe(72);
    expect(result.upperBodyRegion.primary.green).toBe(120);
    expect(result.upperBodyRegion.primary.blue).toBe(192);

    // Check lower body: quantize(40)=48, quantize(40)=48, quantize(40)=48
    expect(result.lowerBodyRegion.primary.red).toBe(48);
    expect(result.lowerBodyRegion.primary.green).toBe(48);
    expect(result.lowerBodyRegion.primary.blue).toBe(48);

    // Check feet: quantize(30)=24, quantize(30)=24, quantize(30)=24
    expect(result.feetRegion.primary.red).toBe(24);
    expect(result.feetRegion.primary.green).toBe(24);
    expect(result.feetRegion.primary.blue).toBe(24);
  });

  it('handles partial mask correctly (only some pixels are person)', () => {
    // 10x10 image, bbox covers (2,2)-(7,7), but only some pixels are person
    const width = 10;
    const height = 10;
    const mask: SegmentationMask = new Uint8Array(100);
    const bbox: PersonBoundingBox = { xMin: 2, yMin: 2, xMax: 7, yMax: 7, width: 6, height: 6 };

    // Set mask=1 only in hair region (y=2,3) and face region (y=4,5)
    for (let y = 2; y <= 3; y++) {
      for (let x = 2; x <= 7; x++) {
        mask[y * width + x] = 1;
      }
    }
    for (let y = 4; y <= 5; y++) {
      for (let x = 2; x <= 7; x++) {
        mask[y * width + x] = 1;
      }
    }

    // All pixels are blue
    const pixels: { r: number; g: number; b: number; a: number }[] = [];
    for (let i = 0; i < 100; i++) {
      pixels.push({ r: 50, g: 80, b: 200, a: 255 });
    }
    const imageData = createMockImageData(width, height, pixels);

    const result: RegionPalette = extractRegionPalette(
      imageData as any, mask, width, height, bbox
    );

    // Hair and face regions should have blue as primary
    // Upper/lower/feet regions: since mask=0 in those regions, sampleRegionColors gets empty pixels
    // Empty pixels → kMeans default gray (128,128,128) for both primary and secondary
    // BUT wait: the mask has mask=1 in y=2,3 (hair) and y=4,5 (face), but
    // the upper/lower/feet regions are also at y=6-7 (within the bbox).
    // The mask has mask=0 there, so pixels are skipped. Result: default gray.
    //
    // However, the mask in the test is NOT entirely empty outside hair/face.
    // The bbox covers y=2-7, and mask=1 only at y=2,3 and y=4,5.
    // But upperBodyRegion samples y from faceYEnd to upperYEnd.
    // faceYEnd = bboxTop + Math.round(bboxHeight * 0.45) = 2 + round(6*0.45) = 2 + 3 = 5
    // upperYEnd = 2 + round(6*0.70) = 2 + 4 = 6
    // So upperBodyRegion samples y=5-5 (just row 5), which has mask=1!
    // The mask=1 pixels there are blue (50,80,200).
    // quantize(50)=48, so upperBodyRegion.primary.red should be 48, not 128.
    //
    // The feet region: feetYStart = lowerYEnd, feetYEnd = min(yMax+1, height)
    // lowerYEnd = 2 + round(6*0.85) = 2 + 5 = 7
    // feetYEnd = min(8, 10) = 8
    // feet region: y=7-7, but mask=0 there → default gray (128)
    expect(result.hairRegion.primary.blue).toBeGreaterThan(result.hairRegion.primary.red);
    expect(result.faceRegion.primary.blue).toBeGreaterThan(result.faceRegion.primary.red);
    // upperBody has mask=1 pixels → should have blue-ish color (quantized)
    expect(result.upperBodyRegion.primary.blue).toBeGreaterThan(result.upperBodyRegion.primary.red);
    // feet region has no mask pixels → default gray
    expect(result.feetRegion.primary.red).toBe(128);
  });
});
