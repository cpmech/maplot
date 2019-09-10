import { Markers } from './Markers';
import { IPlotArgs, ICurves } from '../types';

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

  render() {}

  private iconTextAtRight() {
    //            |← lineLen →|← gapMiddle →|← labelLen →|
    //   gapLeft →[   line    |             |    txt     ]← gapRight
    //
    //    example:     ——x—— x = y
    //
    //   [gap][line|txt][gap][line|txt] ...  ←  yl
    //        ↑              ↑
    //        x              x
  }
}
