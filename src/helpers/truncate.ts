// truncate returns a truncated float number
export const truncate = (ndigits: number, x: number): number => {
  return Number(x.toFixed(ndigits));
};
