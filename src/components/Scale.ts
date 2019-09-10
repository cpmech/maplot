import { IPlotArgs } from '../types';
import { numFmt } from '../helpers';
import { textWidthPx, setStroke, drawLine, drawTextVertUp, drawText } from '../canvas';
import { Metrics } from './Metrics';

export class Scale {
  dc: CanvasRenderingContext2D;
  args: IPlotArgs;
  metrics: Metrics;
  isYscale: boolean;

  constructor(dc: CanvasRenderingContext2D, args: IPlotArgs, metrics: Metrics, isYscale: boolean) {
    this.dc = dc;
    this.args = args;
    this.metrics = metrics;
    this.isYscale = isYscale;
  }

  getSize(): number {
    // constants
    const info = this.isYscale ? this.metrics.ticks.y : this.metrics.ticks.x;
    const args = this.isYscale ? this.args.y : this.args.x;
    const t = args.t;

    // length of ticks
    let tickLenTotal = t.length + t.gapValue;
    if ((this.isYscale && !t.vertNums) || (!this.isYscale && t.vertNums)) {
      tickLenTotal += this.valLen(info.lo, info.lo + info.unit * info.ndv, t.decDigits);
    } else {
      tickLenTotal += this.args.fsizeTicks;
    }

    // length of label
    let labelLen = 0;
    if (args.label) {
      labelLen = this.args.fsizeLabels;
      if ((this.isYscale && !args.labelVert) || (!this.isYscale && args.labelVert)) {
        const font = `${this.args.fsizeLabels}px ${this.args.fnameLabels}`;
        labelLen = textWidthPx(this.dc, args.label, font);
      }
    }

    // total length
    return tickLenTotal + labelLen + t.gapLabel;
  }

  draw() {
    this.dc.save();
    if (this.isYscale) {
      this.drawY();
      return;
    }
    this.drawX();
    this.dc.restore();
  }

  drawX() {
    // constants
    const font = `${this.args.fsizeTicks}px ${this.args.fnameTicks}`;
    const info = this.metrics.ticks.x;
    const args = this.args.x;
    const t = args.t;
    const min = this.metrics.x0;
    const max = this.metrics.xf;
    const c = this.metrics.yf;
    const cc = c + args.t.length + args.t.gapValue;

    // draw ticks and numbers
    let mreal = info.lo;
    let index = 0;
    while (mreal < max && index < t.maxNumber) {
      const m = this.metrics.xScr(mreal);
      if (m >= min && m <= max) {
        const s = numFmt(mreal, args.t.decDigits);
        setStroke(this.dc, t.color, t.alpha, t.lineWidth, t.lineStyle);
        drawLine(this.dc, m, c, m, c + t.length);
        if (t.vertNums) {
          drawTextVertUp(this.dc, s, m, cc, 'right', 'center', font, args.t.color);
        } else {
          drawText(this.dc, s, m, cc, 'center', 'top', font, args.t.color);
        }
      }
      mreal += info.unit;
      index++;
    }

    // draw label
    if (args.label) {
      const fontL = `${this.args.fsizeLabels}px ${this.args.fnameLabels}`;
      const xl = (min + max) / 2;
      const yl = this.metrics.yf + this.metrics.BS;
      if (args.labelVert) {
        drawTextVertUp(this.dc, args.label, xl, yl, 'left', 'center', fontL, t.color);
      } else {
        drawText(this.dc, args.label, xl, yl, 'center', 'bottom', fontL, t.color);
      }
    }
  }

  drawY() {
    // constants
    const font = `${this.args.fsizeTicks}px ${this.args.fnameTicks}`;
    const info = this.metrics.ticks.y;
    const args = this.args.y;
    const t = args.t;
    const min = this.metrics.y0;
    const max = this.metrics.yf;
    const c = this.metrics.x0 - args.t.length;
    const cc = c - args.t.gapValue;

    // draw ticks and numbers
    let mreal = info.lo;
    let index = 0;
    while (mreal < max && index < t.maxNumber) {
      const m = this.metrics.yScr(mreal);
      if (m >= min && m <= max) {
        const s = numFmt(mreal, args.t.decDigits);
        setStroke(this.dc, t.color, t.alpha, t.lineWidth, t.lineStyle);
        drawLine(this.dc, c, m, c + args.t.length, m);
        if (t.vertNums) {
          drawTextVertUp(this.dc, s, cc, m, 'center', 'bottom', font, args.t.color);
        } else {
          drawText(this.dc, s, cc, m, 'right', 'center', font, args.t.color);
        }
      }
      mreal += info.unit;
      index++;
    }

    // draw label
    if (args.label) {
      const fontL = `${this.args.fsizeLabels}px ${this.args.fnameLabels}`;
      const xl = this.metrics.x0 - this.metrics.LS;
      const yl = (min + max) / 2;
      if (args.labelVert) {
        drawTextVertUp(this.dc, args.label, xl, yl, 'center', 'top', fontL, t.color);
      } else {
        drawText(this.dc, args.label, xl, yl, 'left', 'bottom', fontL, t.color);
      }
    }
  }

  private valLen(minVal: number, maxVal: number, decDigits: number): number {
    const font = `${this.args.fsizeTicks}px ${this.args.fnameTicks}`;
    const textOfMinVal = numFmt(minVal, decDigits);
    const textOfMaxVal = numFmt(maxVal, decDigits);
    const sizeOfMinVal = textWidthPx(this.dc, textOfMinVal, font);
    const sizeOfMaxVal = textWidthPx(this.dc, textOfMaxVal, font);
    return Math.max(sizeOfMinVal, sizeOfMaxVal);
  }
}
