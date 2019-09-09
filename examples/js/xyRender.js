import {
  Metrics,
  Plotter,
  defaultPlotArgs,
  defaultCurveStyle,
  getContext2d,
} from '../../dist/esm/index-all-in-one';
import { x, y, z } from './data1';

export function xyRender() {
  const { canvas, dc } = getContext2d('xyCanvas');

  const args = {
    ...defaultPlotArgs,
    title: 'X-Y Plot',
    xIs: 'x',
    yIs: 'y',
  };

  const curves = {
    list: [
      {
        label: 'x-y Curve',
        kind: 'Group A',
        x: x.slice(0, 7),
        y: y.slice(0, 7),
        z: z.slice(0, 7),
        style: {
          ...defaultCurveStyle,
        },
        tagFirstPoint: false,
      },
    ],
  };

  const metrics = new Metrics(dc, args, curves);
  const plotter = new Plotter(dc, args, curves, metrics);

  metrics.resize(canvas.width, canvas.height);
  plotter.render();
}
