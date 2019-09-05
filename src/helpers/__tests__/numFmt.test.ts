import { numFmt } from '../numFmt';

describe('numFmt', () => {
  it('works with 3 digits (%13g)', () => {
    expect(numFmt(123.456789, 3)).toBe('123.457');
  });

  it('works with 3 digits and 13 chars (%13.3f)', () => {
    expect(numFmt(123.456789, 3, 13)).toBe('      123.457');
  });

  it('works with long number', () => {
    expect(numFmt(123.45678901234567890123)).toBe('123.456789');
  });

  it('works with big number', () => {
    expect(numFmt(12345678901234567890123)).toBe('1.2346e+22');
  });

  it('works with big number and 12 chars', () => {
    expect(numFmt(12345678901234567890123, -1, 12)).toBe('  1.2346e+22');
  });

  it('works with tiny number', () => {
    expect(numFmt(-5.551115123125783e-8)).toBe('-5.5511e-8');
  });

  it('works with near zero number', () => {
    expect(numFmt(-5.551115123125783e-17)).toBe('0');
  });

  it('works with near zero number and 8 chars', () => {
    expect(numFmt(-5.551115123125783e-17, -1, 8)).toBe('       0');
  });
});
