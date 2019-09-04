import { ICurveStyle } from '../types';
import { imageMarker } from './imageMarker';

export const getMarkerSize = (
  style: ICurveStyle,
  multiplier: number,
  smin: number,
  smax: number,
): number => {
  let size = smin;
  if (style.markerType.startsWith('img:') && style.markerSize === 0) {
    const img = imageMarker(style);
    size = img.width * multiplier;
  } else {
    size = style.markerSize * multiplier;
  }
  if (size < smin) {
    size = smin;
  }
  if (size > smax) {
    size = smax;
  }
  return size;
};
