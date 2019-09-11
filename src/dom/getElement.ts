export const getElement = (divId: string): HTMLElement => {
  const el = document.getElementById(divId);
  if (!el) {
    throw new Error(`cannot get "${divId}"`);
  }
  return el;
};
