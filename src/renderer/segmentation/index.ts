/** Segmentation module barrel export */

export type {
  SegmentationMask,
  PersonBoundingBox,
  RegionColors,
  RegionPalette,
  FeatureResult,
  FeaturePalette
} from './types';

export { computeBoundingBox, extractRegionPalette, sampleRegionColors, isSkinPixel } from './region-sampler';
export { recognizeFeatures, recognizeFeaturesWithImageData, buildFeaturePalette } from './feature-recognizer';
export { getSegmenter, segmentImage, isFallbackMode } from './segmenter';
export { canvasFallbackSegment, canvasFallbackSampleRegions } from './canvas-fallback';
