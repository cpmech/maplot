export interface ICoordsCanvas {
  x: number; // real x-coord
  y: number; // real y-coord
  u: number; // normalized x-coord
  v: number; // normalized y-coord
}

export const getMousePos = (
  canvas: HTMLCanvasElement,
  event: MouseEvent,
  zoom: number = 1,
): ICoordsCanvas => {
  if (zoom < 1) {
    zoom = 1;
  }
  const rect = canvas.getBoundingClientRect();
  const eventX = event.clientX - rect.left * zoom;
  const eventY = event.clientY - rect.top * zoom;
  const x = Math.floor((eventX / zoom) * (canvas.width / rect.width));
  const y = Math.floor((eventY / zoom) * (canvas.height / rect.height));
  return {
    x,
    y,
    u: x / canvas.width,
    v: y / canvas.height,
  };
};
