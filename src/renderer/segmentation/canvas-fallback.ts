import {
  SegmentationMask,
  PersonBoundingBox,
  RegionPalette,
  RegionColors
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

type Rgb = { red: number; green: number; blue: number };

/**
 * Pure Canvas fallback for person segmentation when MediaPipe is unavailable.
 * Uses YCbCr skin color detection to locate the face region,
 * then extrapolates the full body bounding box below it.
 *
 * Returns a rough mask and bounding box, or null if skin detection fails
 * (e.g., > 60% of pixels are skin-colored → non-typical portrait photo).
 */
export function canvasFallbackSegment(image: HTMLImageElement): {
  mask: SegmentationMask;
  bbox: PersonBoundingBox;
} | null {
  const canvas = document.createElement('canvas');
  const maxDim = 200; // Downsample for speed
  const scale = Math.min(maxDim / image.naturalWidth, maxDim / image.naturalHeight, 1);
  const width = Math.round(image.naturalWidth * scale);
  const height = Math.round(image.naturalHeight * scale);

  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) return null;

  context.drawImage(image, 0, 0, width, height);
  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Step 1: Find skin pixels and compute face bounding box
  let skinXMin = width;
  let skinYMin = height;
  let skinXMax = 0;
  let skinYMax = 0;
  let skinPixelCount = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const offset = (y * width + x) * 4;
      if (isSkinPixel(data[offset], data[offset + 1], data[offset + 2])) {
        skinPixelCount += 1;
        if (x < skinXMin) skinXMin = x;
        if (x > skinXMax) skinXMax = x;
        if (y < skinYMin) skinYMin = y;
        if (y > skinYMax) skinYMax = y;
      }
    }
  }

  const totalPixels = width * height;
  const skinRatio = skinPixelCount / totalPixels;

  // If > 60% skin pixels → likely not a portrait photo, abort
  if (skinRatio > 0.60 || skinPixelCount < 20) return null;

  // Step 2: Estimate face center and expand downward for body
  const faceCenterX = (skinXMin + skinXMax) / 2;
  const faceWidth = skinXMax - skinXMin + 1;
  const faceHeight = skinYMax - skinYMin + 1;

  // Body width ≈ 1.5× face width (typical proportion)
  const bodyWidth = Math.round(faceWidth * 1.5);
  const bodyXMin = Math.max(0, Math.round(faceCenterX - bodyWidth / 2));
  const bodyXMax = Math.min(width - 1, Math.round(faceCenterX + bodyWidth / 2));

  // Body extends from face top down to ~4× face height
  const bodyYMin = skinYMin;
  const bodyYMax = Math.min(height - 1, skinYMin + Math.round(faceHeight * 4));

  // Step 3: Create a rough mask (person region = 1, background = 0)
  const mask = new Uint8Array(width * height);
  for (let y = bodyYMin; y <= bodyYMax; y++) {
    for (let x = bodyXMin; x <= bodyXMax; x++) {
      mask[y * width + x] = 1;
    }
  }

  // Also mark detected skin pixels outside the rough box as person
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const offset = (y * width + x) * 4;
      if (isSkinPixel(data[offset], data[offset + 1], data[offset + 2])) {
        mask[y * width + x] = 1;
      }
    }
  }

  return {
    mask,
    bbox: {
      xMin: bodyXMin,
      yMin: bodyYMin,
      xMax: bodyXMax,
      yMax: bodyYMax,
      width: bodyXMax - bodyXMin + 1,
      height: bodyYMax - bodyYMin + 1
    }
  };
}

/**
 * Frequency-based color clustering (faster than k-means for fallback).
 * Sorts quantized pixels by frequency and returns top-2 as primary/secondary.
 */
function frequencyCluster(pixels: Rgb[]): RegionColors {
  if (pixels.length === 0) {
    return {
      primary: { red: 128, green: 128, blue: 128 },
      secondary: { red: 128, green: 128, blue: 128 }
    };
  }

  const colorMap = new Map<string, { color: Rgb; count: number }>();
  for (const p of pixels) {
    const q = { red: quantize(p.red), green: quantize(p.green), blue: quantize(p.blue) };
    const key = `${q.red},${q.green},${q.blue}`;
    const existing = colorMap.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      colorMap.set(key, { color: q, count: 1 });
    }
  }

  const sorted = [...colorMap.values()].sort((a, b) => b.count - a.count);
  return {
    primary: sorted[0]?.color ?? { red: 128, green: 128, blue: 128 },
    secondary: sorted[1]?.color ?? sorted[0]?.color ?? { red: 128, green: 128, blue: 128 }
  };
}

/**
 * Pure Canvas region sampling without MediaPipe segmentation mask.
 * Uses skin detection + extrapolated bounding box to divide regions.
 *
 * Hair region: exclude skin pixels → hairColor is the dominant non-skin color
 * Face region: skin pixels → skinColor is the dominant skin color
 * Body regions: all pixels in respective Y-slices
 */
export function canvasFallbackSampleRegions(image: HTMLImageElement): RegionPalette | null {
  const canvas = document.createElement('canvas');
  const maxDim = 200;
  const scale = Math.min(maxDim / image.naturalWidth, maxDim / image.naturalHeight, 1);
  const width = Math.round(image.naturalWidth * scale);
  const height = Math.round(image.naturalHeight * scale);

  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) return null;

  context.drawImage(image, 0, 0, width, height);
  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;

  // First: get segmentation fallback
  const segmentResult = canvasFallbackSegment(image);
  if (!segmentResult) return null;

  const { bbox } = segmentResult;
  const bboxTop = bbox.yMin;
  const bboxHeight = bbox.height;

  // Define 5 regions relative to bbox
  const hairYStart = bboxTop;
  const hairYEnd = bboxTop + Math.round(bboxHeight * 0.25);
  const faceYStart = hairYEnd;
  const faceYEnd = bboxTop + Math.round(bboxHeight * 0.45);
  const upperYStart = faceYEnd;
  const upperYEnd = bboxTop + Math.round(bboxHeight * 0.70);
  const lowerYStart = upperYEnd;
  const lowerYEnd = bboxTop + Math.round(bboxHeight * 0.85);
  const feetYStart = lowerYEnd;
  const feetYEnd = Math.min(bbox.yMax + 1, height);

  // Helper: collect RGB pixels in a Y range, optionally filtering by skin/non-skin
  function collectPixels(
    yStart: number,
    yEnd: number,
    filter: 'all' | 'skin' | 'non_skin' = 'all'
  ): Rgb[] {
    const pixels: Rgb[] = [];
    for (let y = yStart; y < yEnd; y++) {
      for (let x = bbox.xMin; x <= bbox.xMax; x++) {
        const offset = (y * width + x) * 4;
        const r = data[offset];
        const g = data[offset + 1];
        const b = data[offset + 2];
        const isSkin = isSkinPixel(r, g, b);

        if (filter === 'all') {
          pixels.push({ red: r, green: g, blue: b });
        } else if (filter === 'skin' && isSkin) {
          pixels.push({ red: r, green: g, blue: b });
        } else if (filter === 'non_skin' && !isSkin) {
          pixels.push({ red: r, green: g, blue: b });
        }
      }
    }
    return pixels;
  }

  // Hair: non-skin pixels → dominant non-skin color = hair color
  const hairColors = frequencyCluster(collectPixels(hairYStart, hairYEnd, 'non_skin'));

  // Face: skin pixels → dominant skin color = skin tone
  const faceColors = frequencyCluster(collectPixels(faceYStart, faceYEnd, 'skin'));

  // Upper/lower body: all pixels
  const upperColors = frequencyCluster(collectPixels(upperYStart, upperYEnd));
  const lowerColors = frequencyCluster(collectPixels(lowerYStart, lowerYEnd));
  const feetColors = frequencyCluster(collectPixels(feetYStart, feetYEnd));

  return {
    hairRegion: hairColors,
    faceRegion: faceColors,
    upperBodyRegion: upperColors,
    lowerBodyRegion: lowerColors,
    feetRegion: feetColors
  };
}
