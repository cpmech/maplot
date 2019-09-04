import { ICurveStyle } from '../types';
import { setStroke } from '../canvas';

export const activateStyleForLine = (dc: CanvasRenderingContext2D, style: ICurveStyle) => {
  setStroke(dc, style.lineColor, style.lineAlpha, style.lineWidth, style.lineStyle);
};

export const activateStyleForMarker = (dc: CanvasRenderingContext2D, style: ICurveStyle) => {
  if (style.markerIsVoid) {
    setStroke(
      dc,
      style.markerColor,
      style.markerAlpha,
      style.markerLineWidth,
      style.markerLineStyle,
    );
  } else {
    dc.fillStyle = style.markerColor;
    dc.strokeStyle = style.markerColor;
    dc.globalAlpha = style.markerAlpha;
    dc.lineWidth = style.markerLineWidth;
  }
};
