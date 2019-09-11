import { IPlotArgs, ICurve, ICurves } from '../types';
import { setStroke, drawLine, drawText, drawFilledRectWithEdge, textWidthPx } from '../canvas';
import { Markers } from './Markers';

// example of icons:
//
//           ————o————
//             x = y²
//   or:
//           ————o———— x = y²
//
//
// A: the icon is:
//
//   ———————————
//        ↑
//       gapV
//        |             |← lineLen →|
//        |       gapH →[   line    ]← gapH
//     gapLabelV
//        |                 label
//        |
//       gapV
//        ↓
//   ———————————
//
//
// B: the icon with the label @ right is:
//
//   ———————————
//        ↑
//       gapV
//        |          |← lineLen →|← gapLabelH →|← labelLen →|
//        |    gapH →[   line    |             |    txt     ]← gapH
//        |
//       gapV
//        ↓
//   ———————————
//
//
// the line is:
//
//     ———————————################——————————
//     |← gapEnd →|← markerSize →|← gapEnd →|
//
//
// so, the total length is:
//
//     lineLen = 2*gapEnd + max{l.lineLen,markerSize}
//
// A:  w = 2*gapH + max{lineLen,labelLen}
//     h = 2*gapV + gapLabelV + max{markerSize,lineWidth} + fontSize
//
// B:  w = 2*gapH + lineLen + gapLabelH + labelLen
//     h = 2*gapV + max{markerSize,lineWidth,fontSize}

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
        this.drawIcon(x, y, colWidths[col], rowHeights[row], curve);
        x += colWidths[col] + l.gapIconsH;
        idxCurve++;
        if (idxCurve === curves.length) {
          break;
        }
      }
      if (idxCurve === curves.length) {
        break;
      }
      y += rowHeights[row] + l.gapIconsV;
    }

    this.dc.restore();
  }

  private iconDims(curve: ICurve): { w: number; h: number } {
    // constants
    const l = this.args.l;
    const style = curve.style;
    const refProp = this.args.markerSizeRefProp;
    const markerSize = this.markers.getSize(style, refProp);
    const lineWidth = style.lineStyle !== 'none' ? style.lineWidth : 0;
    const lineLen = Math.max(l.lineLen, markerSize);
    const symbolH = Math.max(lineWidth, markerSize);

    // variables
    let w = 2 * l.gapH + lineLen;
    let h = 2 * l.gapV + symbolH;

    // with markers
    if (style.markerType !== 'none') {
      w += 2 * l.gapEnd;
    }

    // with labels
    if (curve.label) {
      const font = `${this.args.fsizeLegend}px ${this.args.fnameLegend}`;
      const labelLen = textWidthPx(this.dc, curve.label, font);
      if (l.labelAtRight) {
        w += l.gapLabelH + labelLen;
        if (this.args.fsizeLegend > symbolH) {
          h = 2 * l.gapV + this.args.fsizeLegend;
        }
      } else {
        w = Math.max(w, 2 * l.gapH + labelLen);
        h += l.gapLabelV + this.args.fsizeLegend;
      }
    }

    // results
    return { w, h };
  }

  private drawIcon(x0: number, y0: number, w: number, h: number, curve: ICurve) {
    drawFilledRectWithEdge(this.dc, x0, y0, w, h, '#ffffff', '#000000');

    // constants
    const l = this.args.l;
    const style = curve.style;
    const refProp = this.args.markerSizeRefProp;
    const markerSize = this.markers.getSize(style, refProp);
    let lineLen = Math.max(l.lineLen, markerSize);

    // variables
    const y = y0 + h / 2;
    let x = x0 + l.gapH;

    // line length
    if (style.markerType !== 'none') {
      lineLen += 2 * l.gapEnd;
    }

    // center line/marker if no label or vertical label
    if (curve.label === '' || !l.labelAtRight) {
      x = x0 + (w - lineLen) / 2;
    }

    // draw line
    if (style.lineStyle !== 'none') {
      setStroke(this.dc, style.lineColor, style.lineAlpha, style.lineWidth, style.lineStyle);
      drawLine(this.dc, x, y, x + lineLen, y);
    }

    // draw marker
    if (style.markerType !== 'none') {
      this.markers.draw(x + lineLen / 2, y, style, this.args.markerSizeRefProp);
    }

    // draw text
    if (curve.label) {
      const font = `${this.args.fsizeLegend}px ${this.args.fnameLegend}`;
      if (l.labelAtRight) {
        const xl = x + lineLen + l.gapLabelH;
        drawText(this.dc, curve.label, xl, y, 'left', 'center', font);
      } else {
        const xl = x0 + w / 2;
        drawText(this.dc, curve.label, xl, y + l.gapLabelV, 'center', 'top', font);
      }
    }
  }
}
