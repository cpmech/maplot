import { IPoint, IRect } from '../types';
import { pointRectDist } from '../geometry';
import { drawRect, drawCircle } from '../canvas';

// drawPointRectDist draws point-rectangle distance function
export const drawPointRectDist = (dc: CanvasRenderingContext2D, p: IPoint, r: IRect) => {
  dc.fillStyle = 'rgba(255, 0, 0, 0.8)';
  const w = r.b[0] - r.a[0];
  const h = r.b[1] - r.a[1];
  drawRect(dc, r.a[0], r.a[1], w, h, true);
  const D = pointRectDist(p, r);
  if (D < 0) {
    dc.fillStyle = 'rgba(0, 255, 0, 0.8)';
    drawCircle(dc, p[0], p[1], 20, true);
  } else {
    dc.fillStyle = 'rgba(0, 0, 255, 0.8)';
    drawCircle(dc, p[0], p[1], D, true);
  }
};
