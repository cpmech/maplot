import { setStroke } from '../drawing';

let canvas: HTMLCanvasElement;
let dc: CanvasRenderingContext2D;

beforeEach(() => {
  canvas = document.createElement('canvas');
  const theDC = canvas.getContext('2d');
  if (theDC) {
    dc = theDC;
    return;
  }
  fail('internal error');
});

describe('drawing', () => {
  it('setStroke works', () => {
    setStroke(dc, '#cecece');
    expect(dc.fillStyle).toBe('#000');
    expect(dc.strokeStyle).toBe('#cecece');
    expect(dc.globalAlpha).toBe(1);
    expect(dc.lineWidth).toBe(1);
  });
});
