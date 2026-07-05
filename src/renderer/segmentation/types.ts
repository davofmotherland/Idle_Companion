/** Segmentation mask: each pixel 0=background 1=person */
export type SegmentationMask = Uint8Array;

/** Person bounding box within the image */
export type PersonBoundingBox = {
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
  width: number;
  height: number;
};

/** Region color sampling result (primary + secondary color) */
export type RegionColors = {
  primary: { red: number; green: number; blue: number };
  secondary: { red: number; green: number; blue: number };
};

/** 5-region palette extracted from segmented person */
export type RegionPalette = {
  hairRegion: RegionColors;      // y: 0%~25%
  faceRegion: RegionColors;      // y: 25%~45%
  upperBodyRegion: RegionColors; // y: 45%~70%
  lowerBodyRegion: RegionColors; // y: 70%~85%
  feetRegion: RegionColors;      // y: 85%~100%
};

/** Feature recognition result */
export type FeatureResult = {
  hairVariant: 'short' | 'bob' | 'long' | 'curly';
  outfitVariant: 'approved_base' | 'simple_dress' | 'shorts_casual' | 'hoodie_casual' | 'soft_uniform';
  hasAccessories: boolean;  // headphones/hat detection
  skinColor: { red: number; green: number; blue: number };
  hairColor: { red: number; green: number; blue: number };
  outfitPrimaryColor: { red: number; green: number; blue: number };
  outfitSecondaryColor: { red: number; green: number; blue: number };
};

/** Feature palette used for drawing the pixel character */
export type FeaturePalette = {
  hair: string;
  body: string;    // skin color
  outline: string;
  accent: string;  // outfit secondary / decoration
  outfit: string;  // outfit primary
  flipper: string;
  shadow: string;
  cheek: string;
  shoes: string;   // shoes independent color
};
