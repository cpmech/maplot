import { toInt } from '../helpers/toInt';
import { getOrthoVec } from '../geometry';

export const setStroke = (
  dc: CanvasRenderingContext2D,
  color: string,
  alpha: number = 1.0,
  width: number = 1.0,
  style: string = '-',
) => {
  dc.fillStyle = '';
  dc.strokeStyle = color;
  dc.globalAlpha = alpha;
  dc.lineWidth = width;
  switch (style) {
    case '--':
      dc.setLineDash([5, 5]);
      break;
    case ':':
      dc.setLineDash([2, 2]);
      break;
    default:
      dc.setLineDash([]);
  }
};

export const drawLine = (
  dc: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  xf: number,
  yf: number,
) => {
  dc.beginPath();
  dc.moveTo(x0, y0);
  dc.lineTo(xf, yf);
  dc.stroke();
};

export const drawLines = (dc: CanvasRenderingContext2D, X: number[], Y: number[]) => {
  dc.beginPath();
  dc.moveTo(X[0], Y[0]);
  for (let i = 1; i < X.length; i++) {
    dc.lineTo(X[i], Y[i]);
  }
  dc.stroke();
};

export const drawCircle = (
  dc: CanvasRenderingContext2D,
  xc: number,
  yc: number,
  r: number,
  filled: boolean,
) => {
  dc.beginPath();
  dc.arc(xc, yc, r, 0.0, 2.0 * Math.PI);
  if (filled) {
    dc.fill();
  } else {
    dc.stroke();
  }
};

export const drawEllipse = (
  dc: CanvasRenderingContext2D,
  xc: number,
  yc: number,
  rx: number,
  ry: number,
  rot: number,
  alpMin: number,
  alpMax: number,
  antiClockwise: boolean,
  closed: boolean,
) => {
  dc.beginPath();
  dc.ellipse(xc, yc, rx, ry, rot, alpMin, alpMax, antiClockwise);
  if (closed) {
    dc.closePath();
  }
  dc.stroke();
};

export const drawSquare = (
  dc: CanvasRenderingContext2D,
  x: number,
  y: number,
  l: number,
  filled: boolean,
) => {
  if (filled) {
    dc.fillRect(x - l / 2, y - l / 2, l, l);
  } else {
    dc.strokeRect(x - l / 2, y - l / 2, l, l);
  }
};

export const drawRect = (
  dc: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  wid: number,
  hei: number,
  filled: boolean,
) => {
  if (filled) {
    dc.fillRect(x0, y0, wid, hei);
  } else {
    dc.strokeRect(x0, y0, wid, hei);
  }
};

export const drawText = (
  dc: CanvasRenderingContext2D,
  txt: string,
  x: number,
  y: number,
  ha: string = 'center',
  va: string = 'center',
  fontString: string = '16px Courier New',
  color: string = 'black',
) => {
  if (va === 'center') {
    va = 'middle';
  }
  dc.fillStyle = color;
  dc.font = fontString;
  dc.textAlign = ha as CanvasTextAlign;
  dc.textBaseline = va as CanvasTextBaseline;
  dc.fillText(txt, x, y);
};

export const drawTextVertUp = (
  dc: CanvasRenderingContext2D,
  txt: string,
  x: number,
  y: number,
  ha: string = 'center',
  va: string = 'center',
  fontString: string = '16px Courier New',
  color: string = 'black',
) => {
  if (va === 'center') {
    va = 'middle';
  }
  dc.save();
  dc.translate(x, y);
  dc.rotate(-Math.PI / 2);
  dc.fillStyle = color;
  dc.font = fontString;
  dc.textAlign = ha as CanvasTextAlign;
  dc.textBaseline = va as CanvasTextBaseline;
  dc.fillText(txt, 0, 0);
  dc.restore();
};

export const drawHline = (dc: CanvasRenderingContext2D, y: number) => {
  dc.beginPath();
  dc.moveTo(0, y + 0.5);
  dc.lineTo(dc.canvas.width, y + 0.5);
  dc.stroke();
};

export const drawVline = (dc: CanvasRenderingContext2D, x: number) => {
  dc.beginPath();
  dc.moveTo(x + 0.5, 0);
  dc.lineTo(x + 0.5, dc.canvas.height);
  dc.stroke();
};

export const drawCross = (dc: CanvasRenderingContext2D, x: number, y: number) => {
  drawHline(dc, y);
  drawVline(dc, x);
};

export const drawGrid = (
  dc: CanvasRenderingContext2D,
  rmin: number,
  rmax: number,
  smin: number,
  smax: number,
  ndiv: number,
) => {
  const lr = rmax - rmin;
  const ls = smax - smin;
  const dr = lr / ndiv;
  const ds = ls / ndiv;
  const nr = toInt(lr / dr) + 1;
  const ns = toInt(ls / ds) + 1;
  for (let i = 0; i < nr; i++) {
    const r = rmin + i * dr;
    drawLine(dc, r, smin, r, smax);
  }
  for (let i = 0; i < ns; i++) {
    const s = smin + i * ds;
    drawLine(dc, rmin, s, rmax, s);
  }
};

export const drawEquiTriangle = (
  dc: CanvasRenderingContext2D,
  edgeLength: number,
  xTip: number[], // position of tip
  u: number[], // direction, unit vector
  filled: boolean,
) => {
  const l = edgeLength;
  const h = (Math.sqrt(3) * l) / 2;
  const v = getOrthoVec(u);
  const x0 = xTip[0] - u[0] * h;
  const y0 = xTip[1] - u[1] * h;
  const x1 = x0 - (v[0] * l) / 2;
  const y1 = y0 - (v[1] * l) / 2;
  const x2 = x0 + u[0] * h;
  const y2 = y0 + u[1] * h;
  const x3 = x0 + (v[0] * l) / 2;
  const y3 = y0 + (v[1] * l) / 2;
  dc.beginPath();
  dc.moveTo(x1, y1);
  dc.lineTo(x2, y2);
  dc.lineTo(x3, y3);
  dc.lineTo(x1, y1);
  if (filled) {
    dc.fill();
  } else {
    dc.stroke();
  }
};
