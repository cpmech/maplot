import { getColor } from '../colors';

describe('getColor', () => {
  it('default blue works', () => {
    expect(getColor(0)).toBe('blue');
  });

  it('default green works', () => {
    expect(getColor(1)).toBe('green');
  });

  it('default magenta works', () => {
    expect(getColor(2)).toBe('magenta');
  });

  it('default orange works', () => {
    expect(getColor(3)).toBe('orange');
  });

  it('default red works', () => {
    expect(getColor(4)).toBe('red');
  });

  it('default cyan works', () => {
    expect(getColor(5)).toBe('cyan');
  });

  it('default black works', () => {
    expect(getColor(6)).toBe('black');
  });
});
