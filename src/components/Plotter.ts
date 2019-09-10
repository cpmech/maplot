import { ICurves, IPlotArgs, ICurveStyle } from '../types';
import { drawRect, setStroke, drawLine, drawText, drawTextVertUp, textWidthPx } from '../canvas';
import { pointRectInsideL } from '../geometry';
import { numFmt } from '../helpers';
import { cteSqrtEps, cteEps } from './constants';
import { Markers } from './Markers';
import { Legend } from './Legend';
import { Metrics } from './Metrics';

export class Plotter {
  dc: CanvasRenderingContext2D;
  args: IPlotArgs;
  curves: ICurves;
  markers: Markers;
  legend: Legend;
  metrics: Metrics;

  constructor(
    dc: CanvasRenderingContext2D,
    args: IPlotArgs,
    curves: ICurves,
    markers: Markers,
    legend: Legend,
    metrics: Metrics,
  ) {
    this.dc = dc;
    this.args = args;
    this.curves = curves;
    this.markers = markers;
    this.legend = legend;
    this.metrics = metrics;
  }

  render() {
    // clear background
    this.clearBackground();

    // skip
    if (
      this.metrics.w < 1 ||
      this.metrics.ticks.x.ndv < 2 ||
      this.metrics.ticks.y.ndv < 2 ||
      this.metrics.sfx < cteEps ||
      this.metrics.sfy < cteEps
    ) {
      return;
    }

    // draw features
    this.drawGrid();
    this.drawCurves();
    this.drawTopRuler();
    this.drawRightRuler();
    this.drawLegendAtRightRuler();
    this.drawBottomRuler();
    this.drawLegendAtBottomRuler();
    this.drawLeftRuler();
    this.drawFrame();
  }

  clearBackground() {
    // draw background of inner plot-area
    this.dc.globalAlpha = 1;
    this.dc.fillStyle = this.args.colorPlotArea;
    drawRect(this.dc, this.metrics.x0, this.metrics.y0, this.metrics.ww, this.metrics.hh, true);
  }

  drawGrid() {
    // skip
    if (
      !this.args.gridShow ||
      this.metrics.ticks.x.lo >= this.metrics.limits.xmax ||
      this.metrics.ticks.y.lo >= this.metrics.limits.ymax
    ) {
      return;
    }

    // set stroke
    setStroke(
      this.dc,
      this.args.gridColor,
      this.args.gridAlpha,
      this.args.gridLineWidth,
      this.args.gridLineStyle,
    );

    // vertical lines
    let xreal = this.metrics.ticks.x.lo;
    while (xreal < this.metrics.limits.xmax) {
      const x = this.metrics.xScr(xreal);
      if (x >= this.metrics.x0 && x <= this.metrics.xf) {
        drawLine(this.dc, x, this.metrics.y0, x, this.metrics.yf);
      }
      xreal += this.metrics.ticks.x.unit;
    }

    // horizontal lines
    let yreal = this.metrics.ticks.y.lo;
    while (yreal < this.metrics.limits.ymax) {
      const y = this.metrics.yScr(yreal);
      if (y >= this.metrics.y0 && y <= this.metrics.yf) {
        drawLine(this.dc, this.metrics.x0, y, this.metrics.xf, y);
      }
      yreal += this.metrics.ticks.y.unit;
    }
  }

  drawCurves() {
    // skip
    if (this.curves.list.length < 1) {
      return;
    }

    // choose axes
    const u = this.args.xIs;
    const v = this.args.yIs;

    // draw lines
    this.curves.list.forEach(curve => {
      const c = curve as any;
      if (curve.style.lineStyle && c[u].length > 1) {
        setStroke(
          this.dc,
          curve.style.lineColor,
          curve.style.lineAlpha,
          curve.style.lineWidth,
          curve.style.lineStyle,
        );
        let x = this.metrics.xScr(c[u][0]);
        let y = this.metrics.yScr(c[v][0]);
        this.dc.beginPath();
        this.dc.moveTo(x, y);
        let hasSegment = false;
        for (let i = 1; i < c[u].length; i++) {
          const inside = pointRectInsideL(c[u][i], c[v][i], this.metrics.limits, cteSqrtEps);
          if (!this.args.clipOn || inside) {
            x = this.metrics.xScr(c[u][i]);
            y = this.metrics.yScr(c[v][i]);
            this.dc.lineTo(x, y);
            hasSegment = true;
          }
        }
        if (hasSegment) {
          this.dc.stroke();
        }
      }
    });

    // draw markers
    const fontMarkerLabel = `${this.args.fsizeMarkerLabel}px ${this.args.fnameMarkerLabel}`;
    const mm = this.metrics.markerRefLength;
    this.curves.list.forEach(curve => {
      const c = curve as any;
      if (curve.style.markerType) {
        let idx = 0;
        for (let i = 0; i < c[u].length; i++) {
          const inside = pointRectInsideL(c[u][i], c[v][i], this.metrics.limits, cteSqrtEps);
          if (!this.args.clipOn || inside) {
            if (i >= idx) {
              const x = this.metrics.xScr(c[u][i]);
              let y = this.metrics.yScr(c[v][i]);
              this.markers.draw(x, y, curve.style, mm);
              if (i === 0 && curve.tagFirstPoint) {
                const lbl = curve.label;
                const clr = this.args.colorMarkerLabel;
                y -= this.markers.getSize(curve.style, mm) / 2;
                drawText(this.dc, lbl, x, y, 'center', 'bottom', fontMarkerLabel, clr);
              }
              idx += curve.style.markerEvery;
            }
          }
        }
      }
    });
  }

  drawTopRuler() {
    // skip
    if (this.metrics.TR < 1) {
      return;
    }

    // clear background
    this.dc.globalAlpha = 1;
    this.dc.fillStyle = this.args.colorTopRuler;
    const bgWidth = Math.max(1, this.metrics.W - this.metrics.LR);
    drawRect(this.dc, this.metrics.LR, 0, bgWidth, this.metrics.TR, true);

    // draw title
    if (this.args.title) {
      const fontTitle = `${this.args.fsizeTitle}px ${this.args.fnameTitle}`;
      const x = this.metrics.W / 2;
      const y = this.metrics.TR / 2;
      drawText(this.dc, this.args.title, x, y, 'center', 'center', fontTitle);
    }
  }

  drawRightRuler() {
    // skip
    if (this.metrics.RR < 1) {
      return;
    }

    // clear background
    this.dc.globalAlpha = 1;
    this.dc.fillStyle = this.args.colorRightRuler;
    const bgWidth = Math.max(1, this.metrics.W - this.metrics.ww - this.metrics.LR);
    drawRect(this.dc, this.metrics.xf, this.metrics.y0, bgWidth, this.metrics.hh, true);
  }

  drawBottomRuler() {
    // skip
    if (this.metrics.BR < 1) {
      return;
    }

    // clear background
    this.dc.globalAlpha = 1;
    this.dc.fillStyle = this.args.colorBottomRuler;
    const bgHeight = Math.max(1, this.metrics.H - this.metrics.hh - this.metrics.TR);
    drawRect(this.dc, 0, this.metrics.yf, this.metrics.W, bgHeight, true);

    // draw x-ticks (vertical lines)
    const fontTicks = `${this.args.fsizeTicks}px ${this.args.fnameTicks}`;
    let xreal = this.metrics.ticks.x.lo;
    while (xreal < this.metrics.limits.xmax) {
      const x = this.metrics.xScr(xreal);
      if (x >= this.metrics.x0 && x <= this.metrics.xf) {
        setStroke(
          this.dc,
          this.args.xTicksColor,
          this.args.xTicksAlpha,
          this.args.xTicksLineWidth,
          this.args.xTicksLineStyle,
        );
        drawLine(this.dc, x, this.metrics.yf, x, this.metrics.yf + this.args.xTicksLength);
        let y = this.metrics.yf + this.args.xTicksLength;
        const tx = numFmt(xreal, this.args.xTicksDecDigits);
        if (this.args.xTicksVert) {
          y += this.args.padSmall;
          drawTextVertUp(this.dc, tx, x, y, 'right', 'center', fontTicks, this.args.xTicksColor);
        } else {
          drawText(this.dc, tx, x, y, 'center', 'top', fontTicks, this.args.xTicksColor);
        }
      }
      xreal += this.metrics.ticks.x.unit;
    }

    // x-label
    if (this.args.xLabel) {
      const fontLabels = `${this.args.fsizeLabels}px ${this.args.fnameLabels}`;
      const pad = this.args.padXlabel;
      const xm = (this.metrics.x0 + this.metrics.xf) / 2;
      const ym = this.metrics.yf + this.args.xTicksLength + this.metrics.xTickH + pad;
      const clr = this.args.xTicksColor;
      drawText(this.dc, this.args.xLabel, xm, ym, 'center', 'top', fontLabels, clr);
    }
  }

  drawLeftRuler() {
    // skip
    if (this.metrics.LR < 1) {
      return;
    }

    // clear background
    this.dc.globalAlpha = 1;
    this.dc.fillStyle = this.args.colorLeftRuler;
    drawRect(this.dc, 0, 0, this.metrics.LR, this.metrics.hh + this.metrics.TR, true);

    // draw y-ticks (horizontal lines)
    const fontTicks = `${this.args.fsizeTicks}px ${this.args.fnameTicks}`;
    let yreal = this.metrics.ticks.y.lo;
    while (yreal < this.metrics.limits.ymax) {
      const y = this.metrics.yScr(yreal);
      if (y >= this.metrics.y0 && y <= this.metrics.yf) {
        setStroke(
          this.dc,
          this.args.yTicksColor,
          this.args.yTicksAlpha,
          this.args.yTicksLineWidth,
          this.args.yTicksLineStyle,
        );
        drawLine(this.dc, this.metrics.x0 - this.args.yTicksLength, y, this.metrics.x0, y);
        const ty = numFmt(yreal, this.args.xTicksDecDigits);
        const x = this.metrics.x0 - this.args.yTicksLength - 1;
        drawText(this.dc, ty, x, y, 'right', 'center', fontTicks, this.args.yTicksColor);
      }
      yreal += this.metrics.ticks.y.unit;
    }

    // y-label
    if (this.args.yLabel) {
      const fontLabels = `${this.args.fsizeLabels}px ${this.args.fnameLabels}`;
      const pad = this.args.padYlabel;
      const xmid = this.metrics.x0 - this.args.xTicksLength - this.metrics.yTickW - pad;
      const ymid = (this.metrics.y0 + this.metrics.yf) / 2;
      const clr = this.args.yTicksColor;
      if (this.args.yLabelVert) {
        drawTextVertUp(this.dc, this.args.yLabel, xmid, ymid, 'center', 'bottom', fontLabels, clr);
      } else {
        drawText(this.dc, this.args.yLabel, xmid, ymid, 'right', 'center', fontLabels, clr);
      }
    }
  }

  drawFrame() {
    if (this.args.borderShow) {
      setStroke(
        this.dc,
        this.args.borderColor,
        this.args.borderAlpha,
        this.args.borderLineWidth,
        this.args.borderLineStyle,
      );
      drawRect(this.dc, this.metrics.x0, this.metrics.y0, this.metrics.ww, this.metrics.hh, false);
    }
    if (this.args.frameShow) {
      setStroke(
        this.dc,
        this.args.frameColor,
        this.args.frameAlpha,
        this.args.frameLineWidth,
        this.args.frameLineStyle,
      );
      drawRect(this.dc, 0, 0, this.metrics.W, this.metrics.H, false);
    }
  }

  drawLegendAtBottomRuler() {
    // check
    if (this.metrics.BR < 1 || !this.args.legendOn || !this.args.legendAtBottom) {
      return;
    }

    // font strings
    const fontLabels = `${this.args.fsizeLabels}px ${this.args.fnameLabels}`;
    const fontLegend = `${this.args.fsizeLegend}px ${this.args.fnameLegend}`;

    /*

    // compute legend data, where the legend "icon" dimensions are:
    //
    //        |← legLineLen →|← labelLen →|
    //   [gap][      line    |    txt     ]     example:     ——x——Curve1
    //
    //   [gap][line|txt][gap][line|txt] ...  ←  yl
    //        ↑              ↑
    //        x              x
    //
    const hei = this.args.padSmall + this.metrics.legTxtH; // icon height
    const lll = this.args.legLineLen; // length of legend line
    const hll = lll / 2; // half length of legend line
    let xl = this.args.legGap; // initial x-coord on icon line
    let yl = this.metrics.yf + this.metrics.xScaleH + hei / 2; // initial y-coord on icon line
    let col = 0; // column number
    let ncol = Math.trunc(this.curves.list.length / this.args.legNrow); // number of columns
    if (this.curves.list.length % this.args.legNrow > 0) {
      ncol++;
    }

    const mm = this.metrics.markerRefLength;
    this.curves.list.forEach(curve => {
      // icon={line,marker} and label
      if (curve.style.markerType) {
        const sz = this.markers.getSize(curve.style, mm, this.args.legMarkerSizeRefProp);
        if (xl + hll + sz < this.metrics.xf) {
          this.markers.draw(xl + hll, yl, curve.style, mm, this.args.legMarkerSizeRefProp);
        }
      }
      if (curve.style.lineStyle) {
        if (xl + lll < this.metrics.xf) {
          setStroke(
            this.dc,
            curve.style.lineColor,
            curve.style.lineAlpha,
            curve.style.lineWidth,
            curve.style.lineStyle,
          );
          drawLine(this.dc, xl, yl, xl + lll, yl);
        }
      }
      if (curve.label) {
        const xt = xl + lll + this.args.legTxtGap;
        if (xt + this.metrics.legTxtW < this.metrics.xf) {
          drawText(this.dc, curve.label, xt, yl, 'left', 'center', fontLegend);
        }
      }

      // update column position
      let tw = this.metrics.legTxtW;
      if (this.args.legNrow < 2) {
        tw = textWidthPx(this.dc, curve.label, fontLabels);
      }
      xl += lll + this.args.legTxtGap + tw + this.args.legGap;

      // update row position
      if (this.args.legNrow > 1) {
        if (col === ncol - 1) {
          col = -1;
          xl = this.args.legGap;
          yl += hei;
        }
        col++;
      }
    });

    */
  }

  drawLegendAtRightRuler() {
    // check
    if (this.metrics.RR < 1 || !this.args.legendOn || this.args.legendAtBottom) {
      return;
    }

    // font strings
    const fontLegend = `${this.args.fsizeLegend}px ${this.args.fnameLegend}`;

    /*

    // compute legend data, where the legend "icon" dimensions are:
    //
    //        |← LegHlen →|
    //   [gap][   line    |txt]  ← yl
    //   [gap][   line    |txt]
    //        ↑
    //        xl
    //
    const hei = this.args.padSmall + this.metrics.legTxtH; // icon height
    const lll = this.args.legLineLen; // length of legend line
    const hll = lll / 2; // half length of legend line
    const xl = this.metrics.xf + this.args.padLegRR;
    let yl = this.metrics.TR + this.args.legGap + hei / 2;

    const mm = this.metrics.markerRefLength;
    this.curves.list.forEach(curve => {
      // icon={line,marker} and label
      if (curve.style.markerType !== 'none') {
        this.markers.draw(xl + hll, yl, curve.style, mm, this.args.legMarkerSizeRefProp);
      }
      if (curve.style.lineStyle) {
        setStroke(
          this.dc,
          curve.style.lineColor,
          curve.style.lineAlpha,
          curve.style.lineWidth,
          curve.style.lineStyle,
        );
        drawLine(this.dc, xl, yl, xl + lll, yl);
      }
      if (curve.label) {
        const xt = xl + lll + this.args.legTxtGap;
        drawText(this.dc, curve.label, xt, yl, 'left', 'center', fontLegend);
      }

      // update row position
      yl += hei + this.args.legGap;
    });

    */
  }
}
