import {
  SegmentationMask,
  PersonBoundingBox,
  RegionColors,
  RegionPalette
} from './types';

/** RGB triplet */
type Rgb = { red: number; green: number; blue: number };

/** Quantize a channel value to 24-step increments for palette stability */
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

/** Convert RGB to YCbCr color space */
function rgbToYCbCr(r: number, g: number, b: number): { y: number; cb: number; cr: number } {
  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
  const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
  return { y, cb, cr };
}

/**
 * YCbCr skin pixel detection.
 * Standard skin color range: Cb ∈ [77, 127], Cr ∈ [133, 173]
 */
export function isSkinPixel(r: number, g: number, b: number): boolean {
  const { cb, cr } = rgbToYCbCr(r, g, b);
  return cb >= 77 && cb <= 127 && cr >= 133 && cr <= 173;
}

/**
 * Compute the bounding box of all mask=1 (person) pixels.
 * Returns null if no person pixels are found.
 */
export function computeBoundingBox(
  mask: SegmentationMask,
  imageWidth: number,
  imageHeight: number
): PersonBoundingBox | null {
  let xMin = imageWidth;
  let yMin = imageHeight;
  let xMax = 0;
  let yMax = 0;
  let found = false;

  for (let y = 0; y < imageHeight; y++) {
    for (let x = 0; x < imageWidth; x++) {
      if (mask[y * imageWidth + x] === 1) {
        found = true;
        if (x < xMin) xMin = x;
        if (x > xMax) xMax = x;
        if (y < yMin) yMin = y;
        if (y > yMax) yMax = y;
      }
    }
  }

  if (!found) return null;

  return {
    xMin,
    yMin,
    xMax,
    yMax,
    width: xMax - xMin + 1,
    height: yMax - yMin + 1
  };
}

/**
 * Simple k-means clustering for color quantization.
 * Quantizes pixels first, then clusters into k groups.
 * 3 iterations is sufficient for the small pixel count (~48×64 region).
 */
function simpleKMeans(pixels: Rgb[], k: number = 2): { primary: Rgb; secondary: Rgb } {
  if (pixels.length === 0) {
    return {
      primary: { red: 128, green: 128, blue: 128 },
      secondary: { red: 128, green: 128, blue: 128 }
    };
  }

  // Quantize all pixels to 24-step for stability
  const quantized: Rgb[] = pixels.map((p) => ({
    red: quantize(p.red),
    green: quantize(p.green),
    blue: quantize(p.blue)
  }));

  // Count frequency of each quantized color
  const colorMap = new Map<string, { color: Rgb; count: number }>();
  for (const c of quantized) {
    const key = `${c.red},${c.green},${c.blue}`;
    const existing = colorMap.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      colorMap.set(key, { color: c, count: 1 });
    }
  }

  // Sort by frequency descending, pick top-k as initial centroids
  const sorted = [...colorMap.values()].sort((a, b) => b.count - a.count);

  if (sorted.length <= 1) {
    return {
      primary: sorted[0]?.color ?? { red: 128, green: 128, blue: 128 },
      secondary: sorted[0]?.color ?? { red: 128, green: 128, blue: 128 }
    };
  }

  // Initial centroids: top-2 most frequent colors
  let centroids: Rgb[] = [
    sorted[0].color,
    sorted.length > 1 ? sorted[1].color : sorted[0].color
  ];

  // Ensure k centroids (pad if needed)
  while (centroids.length < k) {
    centroids.push({ red: 128, green: 128, blue: 128 });
  }

  // 3 iterations of k-means
  for (let iteration = 0; iteration < 3; iteration++) {
    // Assign each pixel to nearest centroid
    const clusters: Rgb[][] = Array.from({ length: k }, () => []);
    for (const px of quantized) {
      let bestDist = Infinity;
      let bestIdx = 0;
      for (let ci = 0; ci < centroids.length; ci++) {
        const dist = rgbDistanceSq(px, centroids[ci]);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = ci;
        }
      }
      clusters[bestIdx].push(px);
    }

    // Recompute centroids as mean of assigned pixels
    centroids = clusters.map((cluster) => {
      if (cluster.length === 0) return centroids[0];
      const sumR = cluster.reduce((s, p) => s + p.red, 0);
      const sumG = cluster.reduce((s, p) => s + p.green, 0);
      const sumB = cluster.reduce((s, p) => s + p.blue, 0);
      return {
        red: quantize(sumR / cluster.length),
        green: quantize(sumG / cluster.length),
        blue: quantize(sumB / cluster.length)
      };
    });
  }

  // Final assignment to determine cluster sizes
  const finalClusters: Rgb[][] = Array.from({ length: k }, () => []);
  for (const px of quantized) {
    let bestDist = Infinity;
    let bestIdx = 0;
    for (let ci = 0; ci < centroids.length; ci++) {
      const dist = rgbDistanceSq(px, centroids[ci]);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = ci;
      }
    }
    finalClusters[bestIdx].push(px);
  }

  // Sort clusters by size: largest = primary, second = secondary
  const sortedClusters = finalClusters
    .map((cluster, idx) => ({ centroid: centroids[idx], size: cluster.length }))
    .sort((a, b) => b.size - a.size);

  return {
    primary: sortedClusters[0]?.centroid ?? { red: 128, green: 128, blue: 128 },
    secondary: sortedClusters[1]?.centroid ?? sortedClusters[0]?.centroid ?? { red: 128, green: 128, blue: 128 }
  };
}

/** Squared Euclidean distance between two RGB colors */
function rgbDistanceSq(a: Rgb, b: Rgb): number {
  return (a.red - b.red) ** 2 + (a.green - b.green) ** 2 + (a.blue - b.blue) ** 2;
}

/**
 * Sample region colors within a vertical slice of the bounding box.
 * Only pixels where mask=1 (person) are considered.
 * Returns primary + secondary colors via k-means clustering.
 */
export function sampleRegionColors(
  imageData: ImageData,
  mask: SegmentationMask,
  imageWidth: number,
  regionYStart: number,
  regionYEnd: number
): RegionColors {
  const data = imageData.data;
  const pixels: Rgb[] = [];

  for (let y = regionYStart; y < regionYEnd; y++) {
    for (let x = 0; x < imageWidth; x++) {
      const idx = y * imageWidth + x;
      if (mask[idx] !== 1) continue;
      const offset = idx * 4;
      const r = data[offset];
      const g = data[offset + 1];
      const b = data[offset + 2];
      pixels.push({ red: r, green: g, blue: b });
    }
  }

  const clustered = simpleKMeans(pixels, 2);
  return clustered;
}

/**
 * Extract a 5-region palette from the segmented person.
 * Regions are defined relative to the bounding box Y coordinates:
 * - hairRegion:    bbox.yMin → bbox.yMin + 25% of bbox.height
 * - faceRegion:    +25% → +45%
 * - upperBodyRegion: +45% → +70%
 * - lowerBodyRegion: +70% → +85%
 * - feetRegion:    +85% → bbox.yMax
 */
export function extractRegionPalette(
  imageData: ImageData,
  mask: SegmentationMask,
  imageWidth: number,
  imageHeight: number,
  bbox: PersonBoundingBox
): RegionPalette {
  const bboxTop = bbox.yMin;
  const bboxHeight = bbox.height;

  const hairYStart = bboxTop;
  const hairYEnd = bboxTop + Math.round(bboxHeight * 0.25);

  const faceYStart = hairYEnd;
  const faceYEnd = bboxTop + Math.round(bboxHeight * 0.45);

  const upperYStart = faceYEnd;
  const upperYEnd = bboxTop + Math.round(bboxHeight * 0.70);

  const lowerYStart = upperYEnd;
  const lowerYEnd = bboxTop + Math.round(bboxHeight * 0.85);

  const feetYStart = lowerYEnd;
  const feetYEnd = Math.min(bbox.yMax + 1, imageHeight);

  return {
    hairRegion: sampleRegionColors(imageData, mask, imageWidth, hairYStart, hairYEnd),
    faceRegion: sampleRegionColors(imageData, mask, imageWidth, faceYStart, faceYEnd),
    upperBodyRegion: sampleRegionColors(imageData, mask, imageWidth, upperYStart, upperYEnd),
    lowerBodyRegion: sampleRegionColors(imageData, mask, imageWidth, lowerYStart, lowerYEnd),
    feetRegion: sampleRegionColors(imageData, mask, imageWidth, feetYStart, feetYEnd)
  };
}
