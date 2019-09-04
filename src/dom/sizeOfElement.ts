export interface IDivSize {
  width: number;
  height: number;
}

export const sizeOfElement = (divID: string): IDivSize => {
  const el = document.getElementById(divID);
  if (!el) {
    throw new Error(`cannot find element "${divID}"`);
  }
  return {
    width: el.clientWidth,
    height: el.clientHeight,
  };
};
