import { drawCircle, setStroke, drawRect, drawLine } from '../canvas';
import { loadImages } from '../io';
import { hasProp } from '../helpers';
import { ICurveStyle } from '../types';

export class Markers {
  private dc: CanvasRenderingContext2D;
  private sizeMin: number;
  private sizeMax: number;
  private imgPaths: string[];
  private images: { [filePath: string]: HTMLImageElement } = {};

  constructor(
    dc: CanvasRenderingContext2D,
    sizeMin: number,
    sizeMax: number,
    imgPaths: string[] = [],
  ) {
    this.dc = dc;
    this.sizeMin = sizeMin;
    this.sizeMax = sizeMax;
    this.imgPaths = imgPaths;
  }

  async init(): Promise<void> {
    if (this.imgPaths.length > 0) {
      const imgs = await loadImages(this.imgPaths);
      imgs.forEach((img, index) => {
        this.images[this.imgPaths[index]] = img;
      });
    }
  }

  getSize(style: ICurveStyle, sizeMultiplier: number): number {
    if (style.markerType === 'img' && style.markerSize === 0) {
      const img = this.img(style);
      return this.size(img.width, sizeMultiplier);
    }
    return this.size(style.markerSize, sizeMultiplier);
  }

  draw(x: number, y: number, style: ICurveStyle, sizeMultiplier: number) {
    // 'none'
    if (style.markerType === 'none') {
      return;
    }

    // 'img'
    if (style.markerType === 'img') {
      const img = this.img(style);
      const msize = style.markerSize === 0 ? img.width : style.markerSize;
      const s = this.size(msize, sizeMultiplier);
      const h = s / 2;
      this.dc.drawImage(img, x - h, y - h, s, s);
      return;
    }

    // 'o'
    if (style.markerType === 'o') {
      const r = this.size(style.markerSize, sizeMultiplier);
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
      const w = this.size(style.markerSize, sizeMultiplier);
      this.activateStyle(style);
      if (style.markerIsVoid) {
        drawRect(this.dc, x, y, w, w, false);
      } else {
        drawRect(this.dc, x, y, w, w, true);
        if (style.markerLineColor && style.markerLineColor !== style.markerColor) {
          setStroke(
            this.dc,
            style.markerLineColor,
            style.markerAlpha,
            style.markerLineWidth,
            style.markerLineStyle,
          );
          drawRect(this.dc, x, y, w, w, false);
        }
      }
      return;
    }

    // '+'
    if (style.markerType === '+') {
      const h = this.size(style.markerSize, sizeMultiplier);
      this.activateStyle(style);
      drawLine(this.dc, x - h, y, x + h, y);
      drawLine(this.dc, x, y - h, x, y + h);
      return;
    }

    // 'x'
    if (style.markerType === 'x') {
      const h = this.size(style.markerSize, sizeMultiplier);
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

  private size(markerSize: number, sizeMultiplier: number): number {
    const size = markerSize * sizeMultiplier;
    if (size < this.sizeMin) {
      return this.sizeMin;
    }
    if (size > this.sizeMax) {
      return this.sizeMax;
    }
    return size;
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
