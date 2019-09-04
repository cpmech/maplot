import { getUnitVec } from '../getUnitVec';
import { truncate } from '../../helpers';

describe('getUnitVec', () => {
  it('works', () => {
    const v = getUnitVec([Math.SQRT2, Math.SQRT2]);
    const w = [truncate(10, v[0]), truncate(10, v[0])];
    expect(w).toEqual([0.7071067812, 0.7071067812]);
  });
});
