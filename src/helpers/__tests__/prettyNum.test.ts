import { prettyNum } from '../prettyNum';

describe('prettyNum', () => {
  it('works with length > width', () => {
    expect(prettyNum(123.45678901234, 7)).toBe('123.457');
  });

  it('works with length > width and numDecIfTooLong=2', () => {
    expect(prettyNum(123.45678901234, 7, 2)).toBe('123.46');
  });

  it('works with length < width', () => {
    expect(prettyNum(123.45678901234, 20)).toBe('123.45678901234');
  });
});
