import { Metrics, Plotter, defaultPlotArgs, defaultCurveStyle } from '../../dist/index-esm';
import { x, y, z } from './data1';

export function yzRender() {
  const canvas = document.getElementById('yzCanvas');
  if (!canvas) {
    throw new Error('Cannot get "myCanvas"');
  }

  const dc = canvas.getContext('2d');

  const args = {
    ...defaultPlotArgs,
    title: 'Y-Z Plot',
    xIs: 'y',
    yIs: 'z',
    xLabel: 'y ►',
    yLabel: 'z ►',
  };

  const curves = {
    list: [
      {
        label: 'y-z Curve',
        kind: 'Group A',
        x,
        y,
        z,
        style: {
          ...defaultCurveStyle,
          lineColor: '#ff0000',
          lineStyle: '-',
          markerType: 'o',
          markerColor: '#00ff00',
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
