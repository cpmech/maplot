import { truncate } from '../truncate';

describe('truncate', () => {
  it('truncate works', () => {
    expect(truncate(2, 123.456)).toBe(123.46);
  });
});
