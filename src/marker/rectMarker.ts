import { ICurveStyle } from '../types';
import { drawRect, setStroke } from '../canvas';
import { activateStyleForMarker } from './styles';

export const rectMarker = (
  dc: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  style: ICurveStyle,
) => {
  activateStyleForMarker(dc, style);
  if (style.markerIsVoid) {
    drawRect(dc, x, y, w, h, false);
  } else {
    drawRect(dc, x, y, w, h, true);
    if (style.markerLineColor && style.markerLineColor !== style.markerColor) {
      setStroke(
        dc,
        style.markerLineColor,
        style.markerAlpha,
        style.markerLineWidth,
        style.markerLineStyle,
      );
      drawRect(dc, x, y, w, h, false);
    }
  }
};
