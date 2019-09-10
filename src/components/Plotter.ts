import { ICurves, IPlotArgs } from '../types';
import { drawRect, setStroke, drawLine, drawText } from '../canvas';
import { pointRectInsideL } from '../geometry';
import { cteSqrtEps, cteEps } from './constants';
import { Markers } from './Markers';
import { Legend } from './Legend';
import { Metrics } from './Metrics';

export class Plotter {
  dc: CanvasRenderingContext2D;
  args: IPlotArgs;
  curves: ICurves;
  markers: Markers;
  metrics: Metrics;
  legend?: Legend;

  constructor(
    dc: CanvasRenderingContext2D,
    args: IPlotArgs,
    curves: ICurves,
    markers: Markers,
    metrics: Metrics,
    legend?: Legend,
  ) {
    this.dc = dc;
    this.args = args;
    this.curves = curves;
    this.markers = markers;
    this.metrics = metrics;
    this.legend = legend;
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
    this.drawBottomRuler();
    this.drawLeftRuler();
    this.drawFrame();
    if (this.legend && this.args.legendOn) {
      this.legend.render(this.metrics.xf + this.metrics.RR, this.metrics.TR);
    }
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
    const u = this.args.x.coordName;
    const v = this.args.y.coordName;

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

    // draw scale
    this.metrics.xscale.draw();
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

    // draw scale
    this.metrics.yscale.draw();
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
}
