export const inputClearValue = (divID: string) => {
  const el = document.getElementById(divID);
  if (!el) {
    throw new Error(`cannot find element "${divID}"`);
  }
  (el as HTMLInputElement).value = '';
};
