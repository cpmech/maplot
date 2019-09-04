import sprintf from 'sprintf-js';

export const numFmt = (format: string, ndigits: number, x: number): string => {
  let val = x;
  if (ndigits >= 0) {
    val = Number(x.toFixed(ndigits));
  }
  return sprintf.sprintf(format, val);
};
