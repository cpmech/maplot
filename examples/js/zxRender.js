import {
  Metrics,
  Plotter,
  defaultPlotArgs,
  defaultCurveStyle,
  getContext2d,
} from '../../dist/esm/index-all-in-one';
import { x, y, z } from './data1';

const { canvas, dc } = getContext2d('zxCanvas');

const args = {
  ...defaultPlotArgs,
  title: 'Z-X Plot',
  xIs: 'z',
  yIs: 'x',
  xLabel: 'z ►',
  yLabel: 'x ►',
  markerImgPaths: ['images/star1.png'],
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
        markerType: 'img',
        markerImg: 'images/star1.png',
        markerSize: 128,
      },
      tagFirstPoint: false,
    },
  ],
};

const metrics = new Metrics(dc, args, curves);
const plotter = new Plotter(dc, args, curves, metrics);

export async function zxInit() {
  await metrics.markers.init();
}

export function zxResizeAndRender(width, height) {
  metrics.resize(canvas.width, canvas.height);
  plotter.render();
}
