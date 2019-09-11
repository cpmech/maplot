import { drawCircle, setStroke, drawRect, drawLine } from '../canvas';
import { loadImages } from '../io';
import { hasProp } from '../helpers';
import { ICurveStyle, IPlotArgs } from '../types';

export class Markers {
  private dc: CanvasRenderingContext2D;
  private args: IPlotArgs;
  private images: { [filePath: string]: HTMLImageElement } = {};

  constructor(dc: CanvasRenderingContext2D, args: IPlotArgs) {
    this.dc = dc;
    this.args = args;
  }

  async init(): Promise<void> {
    if (this.args.markerImgPaths.length > 0) {
      const imgs = await loadImages(this.args.markerImgPaths);
      imgs.forEach((img, index) => {
        this.images[this.args.markerImgPaths[index]] = img;
      });
    }
  }

  getSize(style: ICurveStyle, referenceLength: number, fixedSize?: number): number {
    // 'none'
    if (style.markerType === 'none') {
      return 0;
    }

    // multiplier and size
    let mm = 1.0;
    let ms = fixedSize || style.markerSize;
    if (fixedSize === undefined && this.args.markerSizeAuto) {
      mm = this.args.markerSizeRefProp * referenceLength;
    }

    // size if 'img'
    if (ms === 0) {
      if (style.markerType === 'img') {
        const img = this.img(style);
        ms = Math.max(img.width, img.height);
      } else {
        ms = this.args.markerSizeDefault;
      }
    }

    // additional multiplier
    let c = 1.0;

    // 'img'
    if (style.markerType === 'img') {
      c = 1.0;
    }

    // 'o'
    if (style.markerType === 'o') {
      c = 1.1;
    }

    // 's'
    if (style.markerType === 's') {
      c = 1.0;
    }

    // '+'
    if (style.markerType === '+') {
      c = 1.2;
    }

    // 'x'
    if (style.markerType === 'x') {
      c = 1.0;
    }

    // results
    const size = c * mm * ms;
    return Math.max(this.args.markerSizeMin, Math.min(size, this.args.markerSizeMax));
  }

  draw(x: number, y: number, style: ICurveStyle, referenceLength: number, fixedSize?: number) {
    // 'none'
    if (style.markerType === 'none') {
      return;
    }

    // size
    const s = this.getSize(style, referenceLength, fixedSize);

    // 'img'
    if (style.markerType === 'img') {
      const img = this.img(style);
      const f = img.height / img.width;
      const r = s / 2;
      if (img.width > img.height) {
        this.dc.drawImage(img, x - r, y - r * f, s, s * f);
      } else {
        this.dc.drawImage(img, x - r / f, y - r, s / f, s);
      }
      return;
    }

    // 'o'
    if (style.markerType === 'o') {
      const r = s / 2;
      this.activateStyle(style);
      if (style.markerIsVoid) {
        drawCircle(this.dc, x, y, r, false);
      } else {
        drawCircle(this.dc, x, y, r, true);
        if (style.markerLineColor && style.markerLineColor !== style.markerColor) {
          setStroke(
            this.dc,
            style.markerLineColor,
            style.markerAlpha,
            style.markerLineWidth,
            style.markerLineStyle,
          );
          drawCircle(this.dc, x, y, r, false);
        }
      }
      return;
    }

    // 's'
    if (style.markerType === 's') {
      const h = s / 2;
      this.activateStyle(style);
      if (style.markerIsVoid) {
        drawRect(this.dc, x - h, y - h, s, s, false);
      } else {
        drawRect(this.dc, x - h, y - h, s, s, true);
        if (style.markerLineColor && style.markerLineColor !== style.markerColor) {
          setStroke(
            this.dc,
            style.markerLineColor,
            style.markerAlpha,
            style.markerLineWidth,
            style.markerLineStyle,
          );
          drawRect(this.dc, x - h, y - h, s, s, false);
        }
      }
      return;
    }

    // '+'
    if (style.markerType === '+') {
      const h = s / 2;
      this.activateStyle(style);
      drawLine(this.dc, x - h, y, x + h, y);
      drawLine(this.dc, x, y - h, x, y + h);
      return;
    }

    // 'x'
    if (style.markerType === 'x') {
      const h = s / 2;
      this.activateStyle(style);
      drawLine(this.dc, x - h, y - h, x + h, y + h);
      drawLine(this.dc, x - h, y + h, x + h, y - h);
      return;
    }

    throw new Error(`markerType = "${style.markerType}" is invalid`);
  }

  private img(style: ICurveStyle) {
    if (!hasProp(this.images, style.markerImg)) {
      throw new Error(`cannot find image named ${style.markerImg}. did you forget to call init()?`);
    }
    return this.images[style.markerImg];
  }

  private activateStyle(style: ICurveStyle) {
    if (style.markerIsVoid) {
      setStroke(
        this.dc,
        style.markerColor,
        style.markerAlpha,
        style.markerLineWidth,
        style.markerLineStyle,
      );
      return;
    }
    this.dc.fillStyle = style.markerColor;
    this.dc.strokeStyle = style.markerColor;
    this.dc.globalAlpha = style.markerAlpha;
    this.dc.lineWidth = style.markerLineWidth;
  }
}
