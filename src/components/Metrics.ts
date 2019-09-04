import { IPlotArgs, ICurves, ILimits } from '../types';
import { toInt, numFmt } from '../helpers';
import { textWidthPx } from '../canvas';
import { getMarkerSize } from '../marker';
import { cteEps } from './constants';
import { Limits, getLimitsAroundCurves, checkLimitsForConsistency } from './Limits';
import { Ticks } from './Ticks';

//                |←——————————————————— W ————————————————————→|
//                       |←——————————— ww ——————————→|
//                            |←—————— w ——————→|
//              (0,0)
//   ———————————  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ ——→ xScr
//    ↑           ┃      |             '                       ┃
//    |           ┃   (x0,y0)          ' TR                    ┃
//    | ————————  ┃      ┌───────────────────────────┐ ——————— ┃ ——→ x
//    |   ↑       ┃      │ (p0,q0)     ' DV          │    ↑    ┃
//    |   |  ———  ┃      │    o─────────────────┐    │    |    ┃ ——→ p
//    |   |   ↑   ┃      │    │                 │    │    |    ┃
//    |           ┃ —LR— │-DH-│                 │-DH-│-RR-|-RL-┃
//       hh   h   ┃      │    │                 │    │    |    ┃
//    H           ┃      │    ↑ yReal           │    │    |    ┃
//        |   ↓   ┃      │    │                 │    │    |    ┃
//    |   |  ———  ┃      │    ●─────────────────o    │    |    ┃ ——→ xReal
//    |   ↓       ┃      │             ' DV  (pf,qf) │    ↓    ┃
//    |  ———————  ┃ ———— └───────────────────────────┘ ——————— ┃
//    |           ┃                    ' BR       (xf,yf)      ┃
//    ↓           ┃                    ' BL                    ┃
//   ———————————  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
//                |      |    |                              (W,H)
//                ↓      ↓    ↓
//               yScr    y    q
//
//    W: figure width          ww: plot area width     w: inner x-y area width
//    H: figure height         hh: plot area height    h: inner x-y area height
//
//    LR : Left Ruler          TR : Top Ruler          xScr ,yScr : "screen" coordinates
//    BR : Bottom Ruler        RR : Right Ruler        x    ,y    : plot area coordinates
//    BL : Bottom Legend       RL : Right Legend       xReal,yReal: x-y (real data) coords
//    DH : Delta Horizontal    DV : Delta Vertical

export class Metrics {
  // input
  dc: CanvasRenderingContext2D;
  args: IPlotArgs;
  curves: ICurves;

  // limits and ticks
  limits: Limits;
  ticks: Ticks;

  // marker multiplier
  markerMultiplier: number = 1; // to update marker sizes upon zoom
  markerSizePct: number = 0.5; // percentage of marker relative to real bounds of curves
  curveLimits: ILimits = { xmin: -1, xmax: +1, ymin: -1, ymax: +1 }; // reference values to set markers

  // size of ticks and labels
  xTickH: number = 0; // bottom (x) tick height
  xLblH: number = 0; // bottom (x) label height
  yTickW: number = 0; // left (y) tick width
  yLblW: number = 0; // left (y) label width
  legTxtW: number = 0; // legend text width
  legTxtH: number = 0; // legend text height
  legH: number = 0; // total legend height
  xScaleH: number = 0; // total bottom (x) scale height
  yScaleW: number = 0; // total bottom (y) scale width

  // geometry
  W: number = 0; // figure width
  H: number = 0; // figure height
  LR: number = 0; // Left Ruler thickness (screen coordinates)
  RR: number = 0; // Right Ruler thickness (screen coordinates)
  BR: number = 0; // Bottom Ruler thickness (screen coordinates)
  TR: number = 0; // Top Ruler thickness (screen coordinates)
  RL: number = 0; // Right Legend thickness
  BL: number = 0; // Bottom Legend thickness
  DH: number = 0; // Delta Horizontal
  DV: number = 0; // Delta Vertical
  ww: number = 0; // width of plotting area
  hh: number = 0; // height of plotting area
  w: number = 0; // width of inner x-y area
  h: number = 0; // height of inner x-y area

  // scaling factors
  sfx: number = 0; // x scale factor
  sfy: number = 0; // y scale factor

  // coordinates
  x0: number = 0; // x-origin of plotting area
  y0: number = 0; // y-origin of plotting area
  xf: number = 0; // x-max of plotting area
  yf: number = 0; // y-max of plotting area
  p0: number = 0; // x-origin of inner x-y area
  q0: number = 0; // y-origin of inner x-y area
  pf: number = 0; // x-max of plotting area
  qf: number = 0; // y-max of plotting area

  constructor(dc: CanvasRenderingContext2D, args: IPlotArgs, curves: ICurves) {
    if (!dc) {
      throw new Error(`Metircs: dc = ${dc} is invalid`);
    }
    if (!args) {
      throw new Error(`Metircs: args = ${args} is invalid`);
    }
    if (!curves) {
      throw new Error(`Metircs: curves = ${curves} is invalid`);
    }
    this.dc = dc;
    this.args = args;
    this.curves = curves;
    this.limits = new Limits(args, curves);
    this.ticks = new Ticks(args, this.limits);
  }

  resize(width: number, height: number) {
    if (this.curves.list.length > 0) {
      this.setScaleBasedOnCurves(width, height);
    } else {
      this.setScaleFromStartValues(width, height);
    }
  }

  setScaleBasedOnCurves(width: number, height: number) {
    if (this.curves.list.length > 0) {
      this.W = width;
      this.H = height;
      this.curveLimits = this.limits.aroundCurves();
      this.ticks.calculate();
      this.calculateMetrics();
      this.expandLimitsDueToEqualScale();
      this.smallShiftToCurves();
      this.limits.makeCopy();
      this.calcMarkerMultiplier();
    }
  }

  setScaleFromStartValues(width: number, height: number) {
    if (
      checkLimitsForConsistency(
        this.args.xminStart,
        this.args.xmaxStart,
        this.args.yminStart,
        this.args.ymaxStart,
      )
    ) {
      this.W = width;
      this.H = height;
      this.limits.xmin = this.args.xminStart;
      this.limits.xmax = this.args.xmaxStart;
      this.limits.ymin = this.args.yminStart;
      this.limits.ymax = this.args.ymaxStart;
      this.ticks.calculate();
      this.calculateMetrics();
      this.expandLimitsDueToEqualScale();
      this.limits.makeCopy();
      this.calcMarkerMultiplier();
    }
  }

  copyLimits() {
    this.limits.makeCopy();
  }

  translateLimitsRelativeToCopy(dx: number, dy: number) {
    this.limits.translateRelativeToCopy(dx, dy);
    this.ticks.calculate();
    this.calculateMetrics();
  }

  zoom(factor: number) {
    const dxOld = this.limits.xmax - this.limits.xmin;
    const dyOld = this.limits.ymax - this.limits.ymin;
    const dxNew = dxOld * factor;
    const dyNew = dyOld * factor;
    const dx = (dxOld - dxNew) / 2.0;
    const dy = (dyOld - dyNew) / 2.0;
    if (
      checkLimitsForConsistency(
        this.limits.xmin + dx,
        this.limits.xmax - dx,
        this.limits.ymin + dy,
        this.limits.ymax - dy,
      )
    ) {
      this.limits.xmin += dx;
      this.limits.xmax -= dx;
      this.limits.ymin += dy;
      this.limits.ymax -= dy;
      this.ticks.calculate();
      this.calculateMetrics();
      this.limits.makeCopy();
      this.calcMarkerMultiplier();
      return true;
    }
  }

  translateTo(x: number, y: number) {
    this.limits.translateTo(x, y);
    this.ticks.calculate();
    this.calculateMetrics();
    this.limits.makeCopy();
  }

  // xScr converts real x-coords to to screen coordinates
  xScr(x: number): number {
    return toInt(this.p0 + this.sfx * (x - this.limits.xmin));
  }

  // yScr converts real y-coords to to screen coordinates
  yScr(y: number): number {
    if (this.args.invertYscale) {
      return toInt(this.q0 + this.sfy * (y - this.limits.ymin));
    } else {
      return toInt(this.qf - this.sfy * (y - this.limits.ymin));
    }
  }

  // xReal converts to real coordinates
  xReal(xscr: number) {
    return this.limits.xmin + (xscr - this.p0) / this.sfx;
  }

  // xReal converts to real coordinates
  yReal(yscr: number) {
    if (this.args.invertYscale) {
      return this.limits.ymin + (yscr - this.q0) / this.sfy;
    } else {
      return this.limits.ymin + (this.qf - yscr) / this.sfy;
    }
  }

  // dxReal converts screen increment to real coordinates
  dxReal(dxscr: number) {
    return dxscr / this.sfx;
  }

  // dyReal converts screen increment to real coordinates
  dyReal(dyscr: number) {
    return dyscr / this.sfy;
  }

  private calculateMetrics() {
    // font strings
    const fontTicks = `${this.args.fsizeTicks}px ${this.args.fnameTicks}`;
    const fontLegend = `${this.args.fsizeLegend}px ${this.args.fnameLegend}`;
    const fontLabels = `${this.args.fsizeLabels}px ${this.args.fnameLabels}`;

    // x-scale (BR): tick text height
    this.xTickH = this.args.fsizeTicks;
    if (this.args.xTicksVert) {
      const tx = '+' + numFmt(this.args.xTicksFormat, this.args.xTicksDecDigits, this.ticks.x.lo);
      const tw = textWidthPx(this.dc, tx, fontTicks);
      this.xTickH = tw;
    }

    // x-scale (BR): x-label text height
    this.xLblH = this.args.fsizeLabels;

    // y-scale (LR): tick text width
    const ty = '+' + numFmt(this.args.yTicksFormat, this.args.yTicksDecDigits, this.ticks.y.lo);
    this.yTickW = textWidthPx(this.dc, ty, fontTicks);

    // y-scale (LR): y-label text width
    if (this.args.yLabelVert) {
      this.yLblW = this.args.fsizeLabels;
    } else {
      this.yLblW = textWidthPx(this.dc, this.args.yLabel, fontLabels);
    }

    // legend dimensions
    this.legTxtW = 0;
    this.legTxtH = 0;
    this.legH = 0;
    if (this.args.legendOn) {
      const th = this.args.fsizeLegend;
      const mm = this.markerMultiplier;
      const smin = this.args.markerSizeMin;
      const smax = this.args.markerSizeMax;
      this.curves.list.forEach(curve => {
        const tw = textWidthPx(this.dc, curve.label, fontLegend);
        this.legTxtW = Math.max(this.legTxtW, tw);
        this.legTxtH = Math.max(this.legTxtH, th, getMarkerSize(curve.style, mm, smin, smax));
      });
      this.legH = (this.args.padLines + this.legTxtH) * this.args.legNrow;
    }

    // height of x-scale (ticks + label)
    this.xScaleH = this.args.xTicksLength + this.xTickH + this.xLblH + this.args.padXlabel * 2;

    // width of y-scale (ticks + label)
    this.yScaleW = this.args.yTicksLength + this.yTickW + this.yLblW + this.args.padYlabel * 2;

    // geometry
    this.LR = 0;
    this.RR = 6;
    this.BR = 0;
    this.TR = 6;
    this.RL = 0;
    this.BL = 0;
    this.BR = Math.max(this.BR, this.xScaleH);
    this.LR = Math.max(this.LR, this.yScaleW);
    if (this.args.legAtBottom) {
      this.BR += this.legH;
    } else {
      this.RR = this.args.legLineLen + this.args.legTxtGap + this.legTxtW;
      this.RR += this.args.padSmall + this.args.padLegRR;
    }

    // minimum values
    this.LR = Math.max(this.LR, this.args.minWidthLR);
    this.BR = Math.max(this.BR, this.args.minHeightBR);
    this.RR = Math.max(this.RR, this.args.minWidthRR);

    // height of title
    if (this.args.title) {
      const th = this.args.fsizeTitle;
      this.TR = th + this.args.padTitle;
    }

    // geometry
    this.DH = this.args.deltaH;
    this.DV = this.args.deltaV;
    this.ww = Math.max(1, this.W - (this.LR + this.RR + this.RL));
    this.hh = Math.max(1, this.H - (this.TR + this.BR + this.BL));
    this.w = Math.max(1, this.ww - 2 * this.DH);
    this.h = Math.max(1, this.hh - 2 * this.DV);

    // coordinates
    this.x0 = this.LR;
    this.y0 = this.TR;
    this.p0 = this.x0 + this.DH;
    this.q0 = this.y0 + this.DV;
    this.xf = this.x0 + this.ww;
    this.yf = this.y0 + this.hh;
    this.pf = this.p0 + this.w;
    this.qf = this.q0 + this.h;

    // scale factors
    this.sfx = this.w / (this.limits.xmax - this.limits.xmin);
    this.sfy = this.h / (this.limits.ymax - this.limits.ymin);
    if (this.sfx <= cteEps) {
      this.sfx = 1.0;
    }
    if (this.sfy <= cteEps) {
      this.sfy = 1.0;
    }
    if (this.args.equalScale) {
      const sf = Math.min(this.sfx, this.sfy);
      this.sfx = sf;
      this.sfy = sf;
    }
  }

  private expandLimitsDueToEqualScale() {
    if (!this.args.equalScale) {
      return;
    }

    //  xmin       xmaxTmp    xmaxNew
    //    ____________  _ _ _ _ _
    //   |            |          |  ymax
    //   |                       |
    //   | dy         |          .
    //   |                       |
    //   |  dx := dy  |          .
    //   |____________  _ _ _ _ _|  ymin

    // expand limits along larger dimension
    if (this.w > this.h) {
      this.limits.xmax = this.xReal(this.xf);
    } else {
      if (this.args.invertYscale) {
        this.limits.ymax = this.yReal(this.yf);
      } else {
        this.limits.ymax = this.yReal(this.y0);
      }
    }
  }

  private smallShiftToCurves() {
    if (this.curves.list.length > 0) {
      const res = getLimitsAroundCurves(this.args, this.curves);
      const xmid = (res.xmin + res.xmax) / 2;
      const ymid = (res.ymin + res.ymax) / 2;
      const ucen = (this.p0 + this.pf) / 2;
      const vcen = (this.q0 + this.qf) / 2;
      const xcen = this.xReal(ucen);
      const ycen = this.yReal(vcen);
      const dx = xcen - xmid;
      const dy = ycen - ymid;
      this.limits.xmin -= dx;
      this.limits.xmax -= dx;
      this.limits.ymin += dy;
      this.limits.ymax += dy;
      this.ticks.decreaseLo(dx, dy);
    }
  }

  private calcMarkerMultiplier() {
    const dxrealcurve = this.curveLimits.xmax - this.curveLimits.xmin;
    const dyrealcurve = this.curveLimits.ymax - this.curveLimits.ymin;
    const dcurve = Math.min(dxrealcurve, dyrealcurve);
    const dmreal = this.markerSizePct * dcurve;
    const dmavescr = (this.args.markerSizeMin + this.args.markerSizeMax) / 2;
    const dmavereal = this.dxReal(dmavescr);
    const avemultiplier = dmreal / dmavereal;
    this.markerMultiplier = avemultiplier;
  }
}
