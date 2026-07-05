import { SegmentationMask } from './types';

const SEGMENTATION_TIMEOUT_MS = 8_000;

/** Lazy-loaded MediaPipe SelfieSegmentation instance */
let segmenterInstance: any | null = null;
let isLoadAttempted = false;
let useCanvasFallback = false;
let initErrorLogged = false;

/**
 * Sleep helper for timeouts.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get the segmentation model instance.
 * Tries to load MediaPipe SelfieSegmentation on first call.
 * Falls back to Canvas-based approach if loading fails.
 * Returns null if in fallback mode (caller should use canvas-fallback instead).
 */
export async function getSegmenter(): Promise<any | null> {
  // Already in fallback mode — skip MediaPipe entirely
  if (useCanvasFallback) return null;

  // Instance already cached — reuse it
  if (segmenterInstance) return segmenterInstance;

  // Previous load attempt failed — don't retry
  if (isLoadAttempted) return null;

  // Attempt to load MediaPipe SelfieSegmentation
  isLoadAttempted = true;

  try {
    // Dynamic import of MediaPipe selfie segmentation
    const { SelfieSegmentation } = await import('@mediapipe/selfie_segmentation');

    const selfieSegmentation = new SelfieSegmentation({
      locateFile: (file: string) => {
        // Point to local public directory for WASM and model files
        // These files are in public/mediapipe/ and served from the renderer root
        return `./mediapipe/${file}`;
      }
    });

    selfieSegmentation.setOptions({
      modelSelection: 0,  // 0 = general model (landscape + portrait)
      selfieMode: false    // We're processing arbitrary photos, not selfies
    });

    // Initialize the model by sending a dummy frame
    // This triggers WASM loading and model initialization
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('MediaPipe initialization timeout'));
      }, 10_000);

      selfieSegmentation.onResults(() => {
        clearTimeout(timeout);
        resolve();
      });

      // Create a minimal 1×1 canvas to trigger initialization
      const dummyCanvas = document.createElement('canvas');
      dummyCanvas.width = 1;
      dummyCanvas.height = 1;
      selfieSegmentation.send({ image: dummyCanvas }).catch(() => {
        clearTimeout(timeout);
        reject(new Error('MediaPipe send failed during initialization'));
      });
    });

    segmenterInstance = selfieSegmentation;
    console.info('[M4] MediaPipe SelfieSegmentation loaded successfully');
    return segmenterInstance;
  } catch (error) {
    if (!initErrorLogged) {
      console.warn('[M4] MediaPipe SelfieSegmentation failed to load, falling back to Canvas:', error);
      initErrorLogged = true;
    }
    useCanvasFallback = true;
    segmenterInstance = null;
    return null;
  }
}

/**
 * Process MediaPipe segmentation results to extract a binary mask.
 * The mask has value 1 for person pixels and 0 for background pixels.
 */
function extractMaskFromResults(results: any, width: number, height: number): SegmentationMask {
  const mask = new Uint8Array(width * height);

  // MediaPipe provides segmentation as a confidence mask.
  // results.segmentationMask is usually a HTMLCanvasElement in the CPU solution,
  // but can be a GPU texture in WebGL mode. Try to read it robustly.
  if (results.segmentationMask) {
    const maskSource = results.segmentationMask as HTMLCanvasElement | HTMLImageElement;
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = width;
    maskCanvas.height = height;
    const maskContext = maskCanvas.getContext('2d');
    if (!maskContext) {
      return mask;
    }

    try {
      // Draw the mask onto our own canvas so we can read its pixels
      maskContext.drawImage(maskSource, 0, 0, width, height);
      const maskData = maskContext.getImageData(0, 0, width, height);
      for (let i = 0; i < width * height; i++) {
        // Confidence is stored as opacity/intensity; use red channel as grayscale
        const confidence = maskData.data[i * 4];
        mask[i] = confidence > 128 ? 1 : 0;
      }
    } catch (drawError) {
      console.warn('[M4] Failed to draw segmentation mask:', drawError);
    }
  } else if (results.segmentation) {
    // Alternative: direct boolean mask
    const segmentationData = results.segmentation;
    if (segmentationData instanceof Uint8Array) {
      for (let i = 0; i < Math.min(segmentationData.length, mask.length); i++) {
        mask[i] = segmentationData[i] > 0 ? 1 : 0;
      }
    }
  }

  return mask;
}

/**
 * Segment an image using MediaPipe SelfieSegmentation.
 * Returns a binary mask (1=person, 0=background) or null if segmentation fails.
 * Caller should fall back to canvas-based approach if null is returned.
 */
export async function segmentImage(image: HTMLImageElement): Promise<SegmentationMask | null> {
  const segmenter = await getSegmenter();
  if (!segmenter) return null;

  try {
    return await Promise.race<SegmentationMask | null>([
      new Promise<SegmentationMask | null>((resolve) => {
        let completed = false;
        const originalOnResults = segmenter.onResults;

        segmenter.onResults((results: any) => {
          if (completed) return;
          completed = true;
          if (!results || !results.segmentationMask) {
            resolve(null);
            return;
          }
          const mask = extractMaskFromResults(results, image.naturalWidth, image.naturalHeight);
          resolve(mask);
        });

        segmenter.send({ image }).catch((error: any) => {
          if (!completed) {
            completed = true;
            console.warn('[M4] MediaPipe send failed:', error);
            resolve(null);
          }
        });
      }),
      sleep(SEGMENTATION_TIMEOUT_MS).then(() => {
        console.warn('[M4] MediaPipe segmentation timed out; switching to Canvas fallback.');
        return null;
      })
    ]);
  } catch (error) {
    console.warn('[M4] MediaPipe segmentation failed:', error);
    return null;
  }
}

/**
 * Check whether the system is currently in Canvas fallback mode.
 * Useful for UI to display appropriate messaging.
 */
export function isFallbackMode(): boolean {
  return useCanvasFallback;
}
