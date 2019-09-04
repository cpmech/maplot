import { IRect } from '../../types';
import { pointRectDist } from '../pointRectDist';

describe('pointRectDist', () => {
  const rect: IRect = {
    a: [-1, -1],
    b: [+1, +1],
  };

  it('left corner', () => {
    expect(pointRectDist([-1, -1], rect)).toEqual(0);
    expect(pointRectDist([-1, +1], rect)).toEqual(0);
  });

  it('left/bottom corner', () => {
    expect(pointRectDist([-2, -2], rect)).toEqual(Math.SQRT2);
  });

  it('bottom along vertical line', () => {
    expect(pointRectDist([-1, -2], rect)).toEqual(1);
    expect(pointRectDist([+1, -2], rect)).toEqual(1);
  });

  it('right/bottom corner', () => {
    expect(pointRectDist([+2, -2], rect)).toEqual(Math.SQRT2);
  });

  it('right along horizontal line', () => {
    expect(pointRectDist([+2, -1], rect)).toEqual(1);
    expect(pointRectDist([+2, +1], rect)).toEqual(1);
  });

  it('right/top corner', () => {
    expect(pointRectDist([+2, +2], rect)).toEqual(Math.SQRT2);
  });

  it('top along vertical line', () => {
    expect(pointRectDist([-1, +2], rect)).toEqual(1);
    expect(pointRectDist([+1, +2], rect)).toEqual(1);
  });

  it('left/top corner', () => {
    expect(pointRectDist([-2, +2], rect)).toEqual(Math.SQRT2);
  });

  it('inside', () => {
    expect(pointRectDist([0, 0], rect)).toEqual(-1);
  });
});
