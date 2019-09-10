import { ITicksInfo } from '../types';
import { IPlotArgs } from '../types/plotargs';
import { cteSqrtEps, cteEps, cteMin, cteMax } from './constants';
import { Limits } from './Limits';

export class Ticks {
  // input
  args: IPlotArgs;
  limits: Limits;

  // values
  x: ITicksInfo = { lo: 0, unit: 0, ndv: 0 };
  y: ITicksInfo = { lo: 0, unit: 0, ndv: 0 };

  constructor(args: IPlotArgs, limits: Limits) {
    this.args = args;
    this.limits = limits;
  }

  getRange(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    return {
      xmin: this.x.lo,
      xmax: this.x.lo + this.x.unit * this.x.ndv,
      ymin: this.y.lo,
      ymax: this.y.lo + this.y.unit * this.y.ndv,
    };
  }

  calculate() {
    const dx = this.limits.xmax - this.limits.xmin;
    const dy = this.limits.ymax - this.limits.ymin;
    let xnumtck = this.args.x.t.approxNumber;
    let ynumtck = this.args.y.t.approxNumber;
    if (Math.abs(dx) <= cteEps) {
      xnumtck = 3;
    }
    if (Math.abs(dy) <= cteEps) {
      ynumtck = 3;
    }
    const xflag = this.args.x.t.wholeNums;
    const yflag = this.args.y.t.wholeNums;
    if (this.args.equalScale) {
      if (dx <= dy) {
        this.genScaleValues(this.x, this.limits.xmin, this.limits.xmax, xnumtck, xflag);
        const unit = this.x.unit;
        this.genScaleValues(this.y, this.limits.ymin, this.limits.ymax, ynumtck, yflag, unit, true);
      } else {
        this.genScaleValues(this.y, this.limits.ymin, this.limits.ymax, ynumtck, yflag);
        const unit = this.y.unit;
        this.genScaleValues(this.x, this.limits.xmin, this.limits.xmax, xnumtck, xflag, unit, true);
      }
    } else {
      this.genScaleValues(this.x, this.limits.xmin, this.limits.xmax, xnumtck, xflag);
      this.genScaleValues(this.y, this.limits.ymin, this.limits.ymax, ynumtck, yflag);
    }
  }

  decreaseLo(dx: number, dy: number) {
    const nx = Math.trunc(dx / this.x.unit);
    const ny = Math.trunc(dy / this.y.unit);
    this.x.lo -= nx * this.x.unit;
    this.y.lo -= ny * this.y.unit;
  }

  // compute pretty scale numbers
  private genScaleValues(
    o: ITicksInfo,
    Lo: number,
    Hi: number,
    nDiv: number,
    wholeNumbersOnly: boolean = false,
    fixedUnit: number = 1,
    useFixedUnit: boolean = false,
  ) {
    // constants
    const roundingEps = cteSqrtEps;
    const epsCorrection = 0.0;
    const shrinkSml = 0.75;
    const h = 1.5;
    const h5 = 0.5 + 1.5 * h;

    // local variables
    const minN = Math.trunc(Math.trunc(nDiv) / Math.trunc(3));
    let lo = Lo;
    let hi = Hi;
    const dx = hi - lo;
    let cell = 1.0; // cell := "scale" here
    let ub = 0.0; // upper bound on cell/unit
    let isml = true; // is small ?

    // check range
    if (!(dx === 0 && hi === 0)) {
      cell = Math.abs(hi);
      ub = 1.0 + 1.5 / (1.0 + h5);
      let nd = 1;

      if (Math.abs(lo) > Math.abs(hi)) {
        cell = Math.abs(lo);
      }
      if (h5 >= 1.5 * h + 0.5) {
        ub = 1.0 + 1.0 / (1.0 + h);
      }
      if (nDiv > 1) {
        nd = nDiv;
      }
      isml = dx < cell * ub * nd * cteEps * 3; // added times 3, as several calculations here
    }

    // set cell
    if (isml) {
      if (cell > 10) {
        cell = 9 + cell / 10;
      }
      cell *= shrinkSml;
      if (minN > 1) {
        cell /= minN;
      }
    } else {
      cell = dx;
      if (nDiv > 1) {
        cell /= nDiv;
      }
    }
    if (cell < 20 * cteMin) {
      cell = 20 * cteMin; // very small range.. corrected
    } else if (cell * 10 > cteMax) {
      cell = 0.1 * cteMax; // very large range.. corrected
    }

    // find base and unit
    const bas = Math.pow(10.0, Math.floor(Math.log10(cell))); // base <= cell < 10*base
    let unit = bas;
    if (useFixedUnit) {
      unit = fixedUnit;
    } else {
      ub = 2 * bas;
      if (ub - cell < h * (cell - unit)) {
        unit = ub;
        ub = 5 * bas;
        if (ub - cell < h5 * (cell - unit)) {
          unit = ub;
          ub = 10 * bas;
          if (ub - cell < h * (cell - unit)) {
            unit = ub;
          }
        }
      }
    }

    // whole numbers only
    if (wholeNumbersOnly) {
      unit = Math.ceil(unit);
    }

    // find number of
    let ns = Math.floor(lo / unit + roundingEps);
    let nu = Math.ceil(hi / unit - roundingEps);
    if (epsCorrection > 0 && (epsCorrection > 1 || !isml)) {
      if (lo > 0) {
        lo *= 1 - cteEps;
      } else {
        lo = -cteMin;
      }
      if (hi > 0) {
        hi *= 1 + cteEps;
      } else {
        hi = +cteMin;
      }
    }
    while (ns * unit > lo + roundingEps * unit) {
      ns -= 1.0;
    }
    while (nu * unit < hi - roundingEps * unit) {
      nu += 1.0;
    }

    // find number of divisions
    let ndv = Math.trunc(0.5 + nu - ns);
    if (ndv < minN) {
      const k = minN - ndv;
      if (ns >= 0.0) {
        nu += k / 2;
        ns -= k / 2 + (k % 2);
      } else {
        ns -= k / 2;
        nu += k / 2 + (k % 2);
      }
      ndv = minN;
    }
    ndv++;

    // ensure that result covers original range
    if (ns * unit < lo) {
      lo = ns * unit;
    }
    if (nu * unit > hi) {
      hi = nu * unit;
    }

    // results
    o.lo = lo;
    o.unit = unit;
    o.ndv = ndv;
  }
}
