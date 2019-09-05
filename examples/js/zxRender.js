import { Metrics, Plotter, defaultPlotArgs, defaultCurveStyle } from '../../dist/index-esm';
import { x, y, z } from './data1';

export function zxRender() {
  const canvas = document.getElementById('zxCanvas');
  if (!canvas) {
    throw new Error('Cannot get "myCanvas"');
  }

  const dc = canvas.getContext('2d');

  const args = {
    ...defaultPlotArgs,
    title: 'Z-X Plot',
    xIs: 'z',
    yIs: 'x',
    xLabel: 'z ►',
    yLabel: 'x ►',
  };

  const curves = {
    list: [
      {
        label: 'z-x Curve',
        kind: 'Group A',
        x: x.slice(6, 11),
        y: y.slice(6, 11),
        z: z.slice(6, 11),
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
