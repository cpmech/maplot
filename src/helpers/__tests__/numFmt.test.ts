import { numFmt } from '../numFmt';

describe('numFmt', () => {
  it('%13f works with 3 digits', () => {
    expect(numFmt('%13f', 3, 123.456789)).toBe('      123.457');
  });
});
