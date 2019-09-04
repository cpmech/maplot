import { ICurves, IPlotArgs, ILimits } from '../types';
import { cteEps } from './constants';

export default class Limits {
  // input
  args: IPlotArgs;
  curves: ICurves;

  // computed
  xmin: number = -1; // minimum x value
  xmax: number = +1; // maximum x value
  ymin: number = -1; // minimum y value
  ymax: number = +1; // maximum y value

  // backup values
  xminCopy: number = -1; // minimum x value
  xmaxCopy: number = +1; // maximum x value
  yminCopy: number = -1; // minimum y value
  ymaxCopy: number = +1; // maximum y value

  constructor(args: IPlotArgs, curves: ICurves) {
    if (!args) {
      throw new Error(`Limits: args = ${args} is invalid`);
    }
    if (!curves) {
      throw new Error(`Limits: curves = ${curves} is invalid`);
    }
    this.args = args;
    this.curves = curves;
  }

  aroundCurves(expansion: number = 1.5): ILimits {
    // search curves
    const res = getLimitsAroundCurves(this.args, this.curves);
    const dx = res.xmax - res.xmin;
    const dy = res.ymax - res.ymin;
    const xmid = (res.xmin + res.xmax) / 2;
    const ymid = (res.ymin + res.ymax) / 2;
    const lx = (expansion * dx) / 2;
    const ly = (expansion * dy) / 2;
    this.xmin = xmid - lx;
    this.xmax = xmid + lx;
    this.ymin = ymid - ly;
    this.ymax = ymid + ly;

    // center if equal scales
    if (this.args.equalScale) {
      this.fixEqualScale();
    }

    // set fixed limits
    this.setFixedLimits();

    // return limits arounc curves
    return res;
  }

  makeCopy() {
    this.xminCopy = this.xmin;
    this.xmaxCopy = this.xmax;
    this.yminCopy = this.ymin;
    this.ymaxCopy = this.ymax;
  }

  translateRelativeToCopy(dx: number, dy: number) {
    this.xmin = this.xminCopy - dx;
    this.xmax = this.xmaxCopy - dx;
    if (this.args.invertYscale) {
      this.ymin = this.yminCopy - dy;
      this.ymax = this.ymaxCopy - dy;
    } else {
      this.ymin = this.yminCopy + dy;
      this.ymax = this.ymaxCopy + dy;
    }
  }

  translateTo(x: number, y: number) {
    const lx = this.xmax - this.xmin;
    const ly = this.ymax - this.ymin;
    this.xmin = x - lx / 2;
    this.xmax = x + lx / 2;
    this.ymin = y - ly / 2;
    this.ymax = y + ly / 2;
  }

  private setFixedLimits() {
    if (this.args.xminFixOn) {
      this.xmin = this.args.xminFix;
    }
    if (this.args.xmaxFixOn) {
      this.xmax = this.args.xmaxFix;
    }
    if (this.args.yminFixOn) {
      this.ymin = this.args.yminFix;
    }
    if (this.args.ymaxFixOn) {
      this.ymax = this.args.ymaxFix;
    }
  }

  private fixEqualScale() {
    // constants
    const dx = this.xmax - this.xmin;
    const dy = this.ymax - this.ymin;
    const dmax = Math.max(dx, dy);
    const xcen = (this.xmin + this.xmax) / 2;
    const ycen = (this.ymin + this.ymax) / 2;

    // results
    this.xmin = xcen - dmax / 2;
    this.xmax = xcen + dmax / 2;
    this.ymin = ycen - dmax / 2;
    this.ymax = ycen + dmax / 2;
  }
}

export const getLimitsAroundCurves = (args: IPlotArgs, curves: ICurves): ILimits => {
  const res: ILimits = { xmin: -1, xmax: +1, ymin: -1, ymax: +1 };
  const u = args.xIs;
  const v = args.yIs;
  curves.list.forEach((curve, index) => {
    const c = curve as any;
    if (c[u].length !== c[v].length) {
      throw new Error(`lengths of ${u} and ${v} must be the same`);
    }
    if (c[u].length > 0) {
      if (index === 0) {
        res.xmin = Math.min(...c[u]);
        res.xmax = Math.max(...c[u]);
        res.ymin = Math.min(...c[v]);
        res.ymax = Math.max(...c[v]);
      } else {
        res.xmin = Math.min(res.xmin, ...c[u]);
        res.xmax = Math.max(res.xmax, ...c[u]);
        res.ymin = Math.min(res.ymin, ...c[v]);
        res.ymax = Math.max(res.ymax, ...c[v]);
      }
    }
  });
  if (Math.abs(res.xmax - res.xmin) <= cteEps) {
    res.xmin = res.xmin - 1;
    res.xmax = res.xmax + 1;
  }
  if (Math.abs(res.ymax - res.ymin) <= cteEps) {
    res.ymin = res.ymin - 1;
    res.ymax = res.ymax + 1;
  }
  return res;
};

export const checkLimitsForConsistency = (
  xmin: number,
  xmax: number,
  ymin: number,
  ymax: number,
): boolean => {
  if (xmin > xmax) {
    return false;
  }
  if (ymin > ymax) {
    return false;
  }
  if (xmin === xmax) {
    return false;
  }
  if (ymin === ymax) {
    return false;
  }
  if (xmin <= Number.NEGATIVE_INFINITY || xmin >= Number.POSITIVE_INFINITY) {
    return false;
  }
  if (xmax <= Number.NEGATIVE_INFINITY || xmax >= Number.POSITIVE_INFINITY) {
    return false;
  }
  if (ymin <= Number.NEGATIVE_INFINITY || ymin >= Number.POSITIVE_INFINITY) {
    return false;
  }
  if (ymax <= Number.NEGATIVE_INFINITY || ymax >= Number.POSITIVE_INFINITY) {
    return false;
  }
  return true;
};
