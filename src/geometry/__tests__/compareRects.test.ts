import { IRect } from '../../types';
import { compareRects } from '../compareRects';

describe('compareRects', () => {
  const reference: IRect = {
    a: [-1, -1],
    b: [+1, +1],
  };

  it('finds (xminus,yminus)', () => {
    expect(compareRects(reference, { a: [-3, -3], b: [-2, -2] })).toEqual({
      xminus: true,
      xplus: false,
      yminus: true,
      yplus: false,
      intersected: false,
    });
  });

  it('finds (yminus)', () => {
    expect(compareRects(reference, { a: [-0.5, -3], b: [0.5, -2] })).toEqual({
      xminus: false,
      xplus: false,
      yminus: true,
      yplus: false,
      intersected: false,
    });
  });

  it('finds (xplus,yminus)', () => {
    expect(compareRects(reference, { a: [2, -3], b: [3, -2] })).toEqual({
      xminus: false,
      xplus: true,
      yminus: true,
      yplus: false,
      intersected: false,
    });
  });

  it('finds (xplus)', () => {
    expect(compareRects(reference, { a: [2, -0.5], b: [3, 0.5] })).toEqual({
      xminus: false,
      xplus: true,
      yminus: false,
      yplus: false,
      intersected: false,
    });
  });

  it('finds (xplus,yplus)', () => {
    expect(compareRects(reference, { a: [2, 2], b: [3, 3] })).toEqual({
      xminus: false,
      xplus: true,
      yminus: false,
      yplus: true,
      intersected: false,
    });
  });

  it('finds (yplus)', () => {
    expect(compareRects(reference, { a: [-0.5, 2], b: [0.5, 3] })).toEqual({
      xminus: false,
      xplus: false,
      yminus: false,
      yplus: true,
      intersected: false,
    });
  });

  it('finds (xminus,yplus)', () => {
    expect(compareRects(reference, { a: [-3, 2], b: [-2, 3] })).toEqual({
      xminus: true,
      xplus: false,
      yminus: false,
      yplus: true,
      intersected: false,
    });
  });

  it('finds (intersected)', () => {
    expect(compareRects(reference, { a: [-3, -3], b: [3, 2] })).toEqual({
      xminus: false,
      xplus: false,
      yminus: false,
      yplus: false,
      intersected: true,
    });
  });
});
