export interface IContext2d {
  canvas: HTMLCanvasElement;
  dc: CanvasRenderingContext2D;
}

export const getContext2d = (canvasDivIdOrElem: string | HTMLCanvasElement): IContext2d => {
  let canvas: HTMLCanvasElement;
  if (typeof canvasDivIdOrElem === 'string') {
    const el = document.getElementById(canvasDivIdOrElem);
    if (!el) {
      throw new Error(`cannot get "${canvasDivIdOrElem}"`);
    }
    canvas = el as HTMLCanvasElement;
  } else {
    canvas = canvasDivIdOrElem;
  }
  const dc = canvas.getContext('2d');
  if (!dc) {
    throw new Error('cannot get device context');
  }

  return { canvas, dc };
};
