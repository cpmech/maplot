import { toInt } from '../toInt';

describe('toInt', () => {
  it('works', () => {
    expect(toInt(123.456)).toBe(123);
  });
});
