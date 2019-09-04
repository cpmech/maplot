import { drawPointRectDist } from '../drawPointRectDist';

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

describe('debug', () => {
  it('drawPointRectDist (inside)', () => {
    drawPointRectDist(dc, [0, 0], { a: [-1, -1], b: [+1, +1] });
    expect(dc.fillStyle).toBe('rgba(0, 255, 0, 0.8)');
  });
  it('drawPointRectDist (outside)', () => {
    drawPointRectDist(dc, [3, 3], { a: [-1, -1], b: [+1, +1] });
    expect(dc.fillStyle).toBe('rgba(0, 0, 255, 0.8)');
  });
});
