import { IPlotArgs, ICurves, ICurveStyle } from '../types';
import { setStroke, drawLine, drawRect, drawFilledRectWithEdge } from '../canvas';
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
      width: 30,
      height: 20,
    };
  }

  render(offsetX: number, offsetY: number) {
    this.dc.save();
    this.dc.translate(offsetX, offsetY);

    const { width, height } = this.getDims();

    drawFilledRectWithEdge(this.dc, 0, 0, width, height);

    // this.iconTextAtRight(0, 100, this.curves.list[0].style);

    this.dc.restore();
  }

  private iconTextAtRight(u0: number, v0: number, style: ICurveStyle) {
    const lineLen = 20;
    const gapLeft = 25;
    const gapMiddle = 5;
    const gapRight = 50;
    //
    //            |← lineLen →|← gapMiddle →|← labelLen →|
    //   gapLeft →[   line    |             |    txt     ]← gapRight
    //
    //  example:         ——o—— x = y²
    //

    const u = u0 + gapLeft;
    const v = v0;
    const du = lineLen;
    if (style.lineStyle !== 'none') {
      setStroke(this.dc, style.lineColor, style.lineAlpha, style.lineWidth, style.lineStyle);
      drawLine(this.dc, u, v, u + du, v);
    }
  }
}
