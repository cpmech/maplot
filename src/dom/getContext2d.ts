export interface IContext2d {
  canvas: HTMLCanvasElement;
  dc: CanvasRenderingContext2D;
}

export const getContext2d = (canvasDivId: string): IContext2d => {
  const el = document.getElementById(canvasDivId);
  if (!el) {
    throw new Error(`cannot get "${canvasDivId}"`);
  }

  const canvas = el as HTMLCanvasElement;
  const dc = canvas.getContext('2d');
  if (!dc) {
    throw new Error('cannot get device context');
  }

  return { canvas, dc };
};
