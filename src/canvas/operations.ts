import { drawRect, setStroke } from './drawing';

export const setShadow = (dc: CanvasRenderingContext2D, scale: number = 10) => {
  dc.strokeStyle = 'rgba(255,255,255,0.95)'; // foreground
  dc.fillStyle = dc.strokeStyle; // foreground
  dc.shadowColor = 'black'; // Color of the shadow; RGB, RGBA, HSL, HEX, and other inputs are valid.
  dc.shadowOffsetX = 0; // Horizontal distance of the shadow, in relation to the text.
  dc.shadowOffsetY = 0; // Vertical distance of the shadow, in relation to the text.
  dc.shadowBlur = scale; // scale
};

export const clearShadow = (dc: CanvasRenderingContext2D) => {
  dc.shadowColor = '';
  dc.shadowBlur = 0;
};

export const textWidthPx = (
  dc: CanvasRenderingContext2D,
  txt: string,
  fontString: string = '16px Courier New',
): number => {
  const prevFont = dc.font;
  dc.font = fontString;
  const w = dc.measureText(txt).width;
  dc.font = prevFont;
  return Math.ceil(w);
};

export const drawFilledRectWithEdge = (
  dc: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  fillColor: string = '#9ec6e7',
  edgeColor: string = '#000000',
) => {
  dc.fillStyle = fillColor;
  drawRect(dc, x, y, w, h, true);
  setStroke(dc, edgeColor, 1, 1, '-');
  drawRect(dc, x, y, w, h, false);
};
