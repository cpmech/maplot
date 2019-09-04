import { ICurveStyle } from '../types';
import { drawCircle, setStroke } from '../canvas';
import { activateStyleForMarker } from './styles';

export const circleMarker = (
  dc: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  style: ICurveStyle,
) => {
  activateStyleForMarker(dc, style);
  if (style.markerIsVoid) {
    drawCircle(dc, x, y, r, false);
  } else {
    drawCircle(dc, x, y, r, true);
    if (style.markerLineColor && style.markerLineColor !== style.markerColor) {
      setStroke(
        dc,
        style.markerLineColor,
        style.markerAlpha,
        style.markerLineWidth,
        style.markerLineStyle,
      );
      drawCircle(dc, x, y, r, false);
    }
  }
};
