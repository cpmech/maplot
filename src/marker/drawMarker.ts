import { ICurveStyle } from '../types';
import { imageMarker } from './imageMarker';
import { getMarkerSize } from './getMarkerSize';
import { circleMarker } from './circleMarker';
import { rectMarker } from './rectMarker';
import { lineMarker } from './lineMarker';

export const drawMarker = (
  dc: CanvasRenderingContext2D,
  x: number,
  y: number,
  style: ICurveStyle,
  sizeMultiplier: number,
  smin: number,
  smax: number,
) => {
  // skip if marker type is empty
  if (style.markerType === '') {
    return;
  }

  // markersize and half-markersize
  const s = getMarkerSize(style, sizeMultiplier, smin, smax);
  const h = s / 2;

  // draw marker
  switch (style.markerType) {
    // circle
    case 'o':
      circleMarker(dc, x, y, h, style);
      break;

    // square
    case 's':
      rectMarker(dc, x - h, y - h, s, s, style);
      break;

    // cross
    case '+':
      lineMarker(dc, x - h, y, x + h, y, style);
      lineMarker(dc, x, y - h, x, y + h, style);
      break;

    // x
    case 'x':
      lineMarker(dc, x - h, y - h, x + h, y + h, style);
      lineMarker(dc, x - h, y + h, x + h, y - h, style);
      break;

    // use image as marker
    default:
      const img = imageMarker(style);
      dc.drawImage(img, x - h, y - h, s, s);
  }
};
