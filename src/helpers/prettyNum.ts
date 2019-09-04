// prettyNum returns a text representation of FP numbers in a nice format
export const prettyNum = (x: number, width: number, numDecIfTooLong: number = 3): string => {
  let txt = String(x);
  if (txt.length > width) {
    txt = String(x.toFixed(numDecIfTooLong));
  }
  return txt;
};
