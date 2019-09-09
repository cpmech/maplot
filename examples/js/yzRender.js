import {
  Metrics,
  Plotter,
  defaultPlotArgs,
  defaultCurveStyle,
  getContext2d,
} from '../../dist/esm/index-all-in-one';
import { x, y, z } from './data1';

export function yzRender() {
  const { canvas, dc } = getContext2d('yzCanvas');

  const args = {
    ...defaultPlotArgs,
    title: 'Y-Z Plot',
    xIs: 'z',
    yIs: 'y',
    xLabel: '◄ z',
    yLabel: 'y ►',
    invertXscale: true,
  };

  const curves = {
    list: [
      {
        label: 'y-z Curve',
        kind: 'Group A',
        x: x.slice(10),
        y: y.slice(10),
        z: z.slice(10),
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
