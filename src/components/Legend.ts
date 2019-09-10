import { IPlotArgs, ICurve, ICurves, ICurveStyle } from '../types';
import { setStroke, drawLine, drawRect, drawFilledRectWithEdge, textWidthPx } from '../canvas';
import { Markers } from './Markers';

export class Legend {
  // input
  dc: CanvasRenderingContext2D;
  args: IPlotArgs;
  curves: ICurves;
  markers: Markers;

  constructor(dc: CanvasRenderingContext2D, args: IPlotArgs, curves: ICurves, markers: Markers) {
    this.dc = dc;
    this.args = args;
    this.curves = curves;
    this.markers = markers;
  }

  getDims(): { width: number; height: number } {
    return {
      width: 600,
      height: 600,
    };
  }

  render(offsetX: number, offsetY: number) {
    this.dc.save();
    this.dc.translate(offsetX, offsetY);

    if (this.curves.list.length < 1) {
      return;
    }

    const { width, height } = this.getDims();

    drawFilledRectWithEdge(this.dc, 0, 0, width, height);

    const curves = this.curves.list;
    const l = this.args.l;
    const nCol = l.nCol > 0 ? l.nCol : l.atBottom ? curves.length : 1;
    const nRow = Math.trunc(curves.length / nCol) + 1;

    console.log('nRow =', nRow, ' nCol =', nCol);

    const colWidths = Array(nCol).fill(0);
    const rowHeights = Array(nRow).fill(0);
    for (let iCurve = 0; iCurve < curves.length; iCurve++) {
      const row = Math.floor(iCurve / nCol);
      const col = iCurve % nCol;
      const { w, h } = this.iconDims(curves[iCurve]);
      colWidths[col] = Math.max(colWidths[col], w);
      rowHeights[row] = Math.max(rowHeights[row], h);
    }
    console.log('colWidths =', colWidths, ' rowHeights =', rowHeights);

    let y = 0;
    let idxCurve = 0;
    for (let row = 0; row < nRow; row++) {
      let x = 0;
      for (let col = 0; col < nCol; col++) {
        const curve = curves[idxCurve];
        this.iconTextAtRight(x, y, colWidths[col], rowHeights[row], curve.style);
        x += colWidths[col] + l.gapIconsHoriz;
        idxCurve++;
        if (idxCurve === curves.length) {
          break;
        }
      }
      if (idxCurve === curves.length) {
        break;
      }
      y += rowHeights[row] + l.gapIconsVert;
    }

    this.dc.restore();
  }

  private iconDims(curve: ICurve): { w: number; h: number } {
    // const lineLen = Math.max(this.args.l.lineLen, style.markerSize)
    const font = `${this.args.fsizeLegend}px ${this.args.fnameLegend}`;
    const l = this.args.l;
    const labelLen = textWidthPx(this.dc, curve.label, font);
    return {
      w: l.lineLen + l.gapLineLabel + labelLen,
      h: Math.max(curve.style.markerSize, this.args.fsizeLegend),
    };
  }

  private iconTextAtRight(x: number, y: number, w: number, h: number, style: ICurveStyle) {
    drawFilledRectWithEdge(this.dc, x, y, w, h, '#cecece', '#ececec');

    // const lineLen = 20;
    // const gapLeft = 25;
    // const gapMiddle = 5;
    // const gapRight = 50;
    //
    //            |← lineLen →|← gapMiddle →|← labelLen →|
    //   gapLeft →[   line    |             |    txt     ]← gapRight
    //
    //  example:         ——o—— x = y²
    //

    // const u = u0 + gapLeft;
    // const v = v0;
    // const du = lineLen;

    const l = this.args.l;
    if (style.lineStyle !== 'none') {
      const dx = l.lineLen;
      const dy = h / 2;
      setStroke(this.dc, style.lineColor, style.lineAlpha, style.lineWidth, style.lineStyle);
      drawLine(this.dc, x, y + dy, x + dx, y + dy);
    }
  }
}
