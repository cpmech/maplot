import { IPlotArgs, ICurves, ILimits } from '../types';
import { cteEps } from './constants';
import { Markers } from './Markers';
import { Legend } from './Legend';
import { Scale } from './Scale';
import { Ticks } from './Ticks';
import { Limits, getLimitsAroundCurves, checkLimitsForConsistency } from './Limits';

//                |←———————————————————————— W ————————————————————————————————→|
//                |←——— LR ———|←——————————— ww ——————————→|←——————— RR ————————→|
//                            .    |←—————— w ——————→|    .                     .
//              (0,0)         .                           .                     .
//   ———————————  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ ——→ xScr
//    ↑   ↑       ┃                         gTR                                 ┃
//    |  TR       ┃                                                             ┃
//    |   ↓       ┃        (x0,y0)          gTR                                 ┃
//    | ————————  ┃  . . . .  ┌───────────────────────────┐        —————        ┃ ——→ x
//    |   ↑       ┃           │ (p0,q0)     ' dV          │          ↑          ┃
//    |   |  ———  ┃           │    o─────────────────┐    │          |          ┃ ——→ p
//    |   |   ↑   ┃           │    │                 │    │    |     |    |     ┃
//    |           ┃  gLR | LS │-dH-│                 │-dH-│-RS-|-gRR-|-RL-|-gRR-┃
//       hh   h   ┃           │    │                 │    │    |     |    |     ┃
//    H           ┃           │    ↑ yReal           │    │          |          ┃
//        |   ↓   ┃           │    │                 │    │          |          ┃
//    |   |  ———  ┃           │    ●─────────────────o    │          |          ┃ ——→ xReal
//    |   ↓       ┃           │             ' dV  (pf,qf) │          ↓          ┃
//    |  ———————  ┃  . . . .  └───────────────────────────┘        —————        ┃
//    |   ↑       ┃                        BS          (xf,yf)                  ┃
//    |   |       ┃                      ───────                                ┃
//    |           ┃                        gBR                                  ┃
//    |  BR       ┃                      ───────                                ┃
//    |           ┃                        BL                                   ┃
//    |   |       ┃                      ───────                                ┃
//    ↓   ↓       ┃                        gBR                                  ┃
//   ———————————  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
//                |           |    |                                          (W,H)
//                ↓           ↓    ↓
//               yScr         y    q
//
//    W: figure width          ww: plot area width     w: inner x-y area width
//    H: figure height         hh: plot area height    h: inner x-y area height
//
//    LR : Left Ruler          TR : Top Ruler          xScr ,yScr : "screen" coordinates
//    LS : Left Scale          gLR: gap for LR         xReal,yReal: x-y (real data) coords
//    BR : Bottom Ruler        RR : Right Ruler        x    ,y    : plot area coordinates
//    BL : Bottom Legend       RL : Right Legend
//    BS : Bottom Scale        RS : Right Scale
//    gRR: gap for RS          gBR: gap for BS
//    dH : Delta Horizontal    dV : Delta Vertical

export class Metrics {
  // input
  dc: CanvasRenderingContext2D;
  args: IPlotArgs;
  curves: ICurves;
  markers: Markers;
  legend?: Legend;

  // scale, limits and ticks
  xscale: Scale;
  yscale: Scale;
  limits: Limits;
  ticks: Ticks;

  // marker multiplier
  markerRefLength: number = 800; // reference width to update marker sizes upon zoom
  curveLimits: ILimits = { xmin: -1, xmax: +1, ymin: -1, ymax: +1 }; // reference values to set markers

  // geometry
  W: number = 0; // figure width
  H: number = 0; // figure height
  LR: number = 0; // Left Ruler thickness (screen coordinates)
  RR: number = 0; // Right Ruler thickness (screen coordinates)
  BR: number = 0; // Bottom Ruler thickness (screen coordinates)
  TR: number = 0; // Top Ruler thickness (screen coordinates)
  BL: number = 0; // Bottom Legend thickness
  RL: number = 0; // Right Legend thickness
  BS: number = 0; // Bottom Scale
  LS: number = 0; // Left Scale
  RS: number = 0; // Right Scale
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

  constructor(
    dc: CanvasRenderingContext2D,
    args: IPlotArgs,
    curves: ICurves,
    markers: Markers,
    legend?: Legend,
  ) {
    this.dc = dc;
    this.args = args;
    this.curves = curves;
    this.markers = markers;
    this.legend = legend;
    this.xscale = new Scale(dc, args, this, false);
    this.yscale = new Scale(dc, args, this, true);
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
        this.args.x.minStart,
        this.args.x.maxStart,
        this.args.y.minStart,
        this.args.y.maxStart,
      )
    ) {
      this.W = width;
      this.H = height;
      this.limits.xmin = this.args.x.minStart;
      this.limits.xmax = this.args.x.maxStart;
      this.limits.ymin = this.args.y.minStart;
      this.limits.ymax = this.args.y.maxStart;
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
    if (this.args.x.invert) {
      return Math.trunc(this.pf - this.sfx * (x - this.limits.xmin));
    } else {
      return Math.trunc(this.p0 + this.sfx * (x - this.limits.xmin));
    }
  }

  // yScr converts real y-coords to to screen coordinates
  yScr(y: number): number {
    if (this.args.y.invert) {
      return Math.trunc(this.q0 + this.sfy * (y - this.limits.ymin));
    } else {
      return Math.trunc(this.qf - this.sfy * (y - this.limits.ymin));
    }
  }

  // xReal converts to real coordinates
  xReal(xscr: number) {
    if (this.args.x.invert) {
      return this.limits.xmin + (this.pf - xscr) / this.sfx;
    } else {
      return this.limits.xmin + (xscr - this.p0) / this.sfx;
    }
  }

  // xReal converts to real coordinates
  yReal(yscr: number) {
    if (this.args.y.invert) {
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
    // height of title
    let titleHeightPlusGap = 0;
    if (this.args.title) {
      titleHeightPlusGap = this.args.fsizeTitle + 2 * this.args.gTR;
    }

    // scales
    this.BS = this.xscale.getSize();
    this.LS = this.yscale.getSize();
    this.RS = 0;

    // legend dimensions
    this.BL = 0;
    this.RL = 0;
    let gBRtotal = this.args.gBR;
    let gRRtotal = this.args.gRR;
    if (this.legend && this.args.l.on) {
      const legDims = this.legend.getDims();
      if (this.args.l.atBottom) {
        gBRtotal += this.args.gBR;
        this.BL = legDims.height;
      } else {
        gRRtotal = this.args.gRR;
        this.RL = legDims.width;
      }
    }

    // rulers
    this.TR = Math.max(this.args.minTR, titleHeightPlusGap);
    this.LR = Math.max(this.args.minLR, this.args.gLR + this.LS);
    this.BR = Math.max(this.args.minBR, gBRtotal + this.BS + this.BL);
    this.RR = Math.max(this.args.minRR, gRRtotal + this.RS + this.RL);

    // geometry
    this.ww = Math.max(1, this.W - this.LR - this.RR);
    this.hh = Math.max(1, this.H - this.TR - this.BR);
    this.w = Math.max(1, this.ww - 2 * this.args.dH);
    this.h = Math.max(1, this.hh - 2 * this.args.dV);

    // coordinates
    this.x0 = this.LR;
    this.y0 = this.TR;
    this.p0 = this.x0 + this.args.dH;
    this.q0 = this.y0 + this.args.dV;
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
      if (this.args.x.invert) {
        this.limits.xmax = this.xReal(this.x0);
      } else {
        this.limits.xmax = this.xReal(this.xf);
      }
    } else {
      if (this.args.y.invert) {
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
      this.limits.ymin -= dy;
      this.limits.ymax -= dy;
      this.ticks.decreaseLo(dx, dy);
    }
  }

  private calcMarkerMultiplier() {
    this.markerRefLength = Math.min(this.w, this.h);
  }
}
