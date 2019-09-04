import { IRect, ILimits } from '../../types';
import { pointRectInside, pointRectInsideL } from '../pointRectInside';

describe('pointRectInside', () => {
  const rect: IRect = {
    a: [-1, -1],
    b: [+1, +1],
  };

  it('exactly @ left corner', () => {
    expect(pointRectInside([-1, -1], rect, 0)).toBeTruthy();
    expect(pointRectInside([-1, +1], rect, 0)).toBeTruthy();
  });

  it('left corner', () => {
    expect(pointRectInside([-1.01, -1], rect, 0)).toBeFalsy();
    expect(pointRectInside([-1.01, +1], rect, 0)).toBeFalsy();
  });

  it('left/bottom corner', () => {
    expect(pointRectInside([-2, -2], rect)).toBeFalsy();
  });

  it('bottom along vertical line', () => {
    expect(pointRectInside([-1, -2], rect)).toBeFalsy();
    expect(pointRectInside([+1, -2], rect)).toBeFalsy();
  });

  it('right/bottom corner', () => {
    expect(pointRectInside([+2, -2], rect)).toBeFalsy();
  });

  it('right along horizontal line', () => {
    expect(pointRectInside([+2, -1], rect)).toBeFalsy();
    expect(pointRectInside([+2, +1], rect)).toBeFalsy();
  });

  it('right/top corner', () => {
    expect(pointRectInside([+2, +2], rect)).toBeFalsy();
  });

  it('top along vertical line', () => {
    expect(pointRectInside([-1, +2], rect)).toBeFalsy();
    expect(pointRectInside([+1, +2], rect)).toBeFalsy();
  });

  it('left/top corner', () => {
    expect(pointRectInside([-2, +2], rect)).toBeFalsy();
  });

  it('inside', () => {
    expect(pointRectInside([0, 0], rect)).toBeTruthy();
  });
});

describe('pointRectInsideL', () => {
  const lims: ILimits = {
    xmin: -1,
    xmax: +1,
    ymin: -1,
    ymax: +1,
  };

  it('exactly @ left corner', () => {
    expect(pointRectInsideL(-1, -1, lims, 0)).toBeTruthy();
    expect(pointRectInsideL(-1, +1, lims, 0)).toBeTruthy();
  });

  it('left corner', () => {
    expect(pointRectInsideL(-1.01, -1, lims, 0)).toBeFalsy();
    expect(pointRectInsideL(-1.01, +1, lims, 0)).toBeFalsy();
  });

  it('left/bottom corner', () => {
    expect(pointRectInsideL(-2, -2, lims)).toBeFalsy();
  });

  it('bottom along vertical line', () => {
    expect(pointRectInsideL(-1, -2, lims)).toBeFalsy();
    expect(pointRectInsideL(+1, -2, lims)).toBeFalsy();
  });

  it('right/bottom corner', () => {
    expect(pointRectInsideL(+2, -2, lims)).toBeFalsy();
  });

  it('right along horizontal line', () => {
    expect(pointRectInsideL(+2, -1, lims)).toBeFalsy();
    expect(pointRectInsideL(+2, +1, lims)).toBeFalsy();
  });

  it('right/top corner', () => {
    expect(pointRectInsideL(+2, +2, lims)).toBeFalsy();
  });

  it('top along vertical line', () => {
    expect(pointRectInsideL(-1, +2, lims)).toBeFalsy();
    expect(pointRectInsideL(+1, +2, lims)).toBeFalsy();
  });

  it('left/top corner', () => {
    expect(pointRectInsideL(-2, +2, lims)).toBeFalsy();
  });

  it('inside', () => {
    expect(pointRectInsideL(0, 0, lims)).toBeTruthy();
  });
});
