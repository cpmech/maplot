export const hideElement = (divID: string) => {
  const el = document.getElementById(divID);
  if (!el) {
    throw new Error(`cannot find element "${divID}"`);
  }
  el.style.display = 'none';
};

export const hideElementIfClicked = (divID: string, clickedElement: HTMLElement) => {
  const el = document.getElementById(divID);
  if (!el) {
    throw new Error(`cannot find element "${divID}"`);
  }
  if (clickedElement === el) {
    el.style.display = 'none';
  }
};

export const showElement = (divID: string) => {
  const el = document.getElementById(divID);
  if (!el) {
    throw new Error(`cannot find element "${divID}"`);
  }
  el.style.display = 'block';
};

export const clearFileField = (divID: string) => {
  const el = document.getElementById(divID);
  if (!el) {
    throw new Error(`cannot find element "${divID}"`);
  }
  (el as HTMLInputElement).value = '';
};

export const displayIsOff = (elementId: string): boolean => {
  const ele = document.getElementById(elementId) as HTMLElement;
  if (ele === undefined || ele === null) {
    return true;
  }
  const res = ele.style ? ele.style.display : getComputedStyle(ele, null).display;
  return res === 'none';
};
