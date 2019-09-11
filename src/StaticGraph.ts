import { ICurves, IPlotArgs, IPadding } from './types';
import { Markers, Legend, Metrics, Plotter } from './components';
import { Resizer, getContext2d } from './dom';

export class StaticGraph {
  markers: Markers;
  legend: Legend;
  metrics: Metrics;
  plotter: Plotter;
  resizer: Resizer;

  constructor(
    args: IPlotArgs,
    curves: ICurves,
    canvasDivId: string,
    canvasWidthMultiplier: number = 1,
    canvasHeightMultiplier: number = 1,
    canvasPadding?: IPadding,
  ) {
    const { canvas, dc } = getContext2d(canvasDivId);
    this.markers = new Markers(dc, args);
    this.legend = new Legend(dc, args, curves, this.markers);
    this.metrics = new Metrics(dc, args, curves, this.markers, this.legend, canvasPadding);
    this.plotter = new Plotter(dc, args, curves, this.markers, this.metrics, this.legend);
    this.resizer = new Resizer(
      ({ width, height }) => {
        canvas.width = width;
        canvas.height = height;
        this.metrics.resize(canvas.width, canvas.height);
        this.plotter.render();
      },
      canvasWidthMultiplier,
      canvasHeightMultiplier,
    );
  }

  async init() {
    await this.markers.init();
    this.resizer.start();
  }
}
