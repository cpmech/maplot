export const numFmt = (
  x: number, // the number
  nDecimal: number = -1, // fixed number of decimals. use -1 for not-fixed
  fixedWidth: number = -1, // pad-left with spaces if greater than -1
  nDigitsMax: number = 10, // max allowed number of digits, including lhs and rhs
  zeroTol: number = 1e-10, // replace with zero if |x| < zeroTol
): string => {
  // handle zero
  if (Math.abs(x) < zeroTol) {
    if (fixedWidth) {
      return '0'.padStart(fixedWidth);
    }
    return '0';
  }

  // truncate if nDecimal is given
  let val = x;
  if (nDecimal >= 0) {
    val = Number(x.toFixed(nDecimal));
  }

  // change precision if too long
  if (val.toString().length > nDigitsMax) {
    let r = x.toPrecision(nDigitsMax);
    if (r.includes('e') && r.length > nDigitsMax + 4) {
      r = x.toPrecision(nDigitsMax - 5);
    }
    val = Number(r);
  }

  // return with width set
  if (fixedWidth) {
    return val.toString().padStart(fixedWidth);
  }

  // return string
  return val.toString();
};
