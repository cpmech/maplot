import { ICurveStyle } from '../types';
import { drawLine } from '../canvas';
import { activateStyleForMarker } from './styles';

export const lineMarker = (
  dc: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  style: ICurveStyle,
) => {
  activateStyleForMarker(dc, style);
  drawLine(dc, x1, y1, x2, y2);
};
