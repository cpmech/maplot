export const resizeCanvas = (w: number, h: number, divIDcanvas: string) => {
  const can = document.getElementById(divIDcanvas) as HTMLCanvasElement;
  can.width = w;
  can.height = h;
};

export const resizeCanvasToParent = (divIDcanvas: string, divIDparent: string) => {
  const can = document.getElementById(divIDcanvas) as HTMLCanvasElement;
  const par = document.getElementById(divIDparent) as HTMLElement;
  can.width = par.clientWidth;
  can.height = par.clientHeight;
};

export const drawRectGivenDivId = (
  divID: string,
  x: number,
  y: number,
  w: number,
  h: number,
  color = '#20c8a6',
) => {
  const can = document.getElementById(divID) as HTMLCanvasElement;
  const dc = can.getContext('2d') as CanvasRenderingContext2D;
  dc.fillStyle = color;
  dc.clearRect(0, 0, can.width, can.height);
  dc.fillRect(x, y, w, h);
};
