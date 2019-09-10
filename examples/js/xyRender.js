import {
  Metrics,
  Plotter,
  defaultPlotArgs,
  defaultCurveStyle,
  getContext2d,
} from '../../dist/esm/index-all-in-one';
import { x, y, z } from './data1';

const { canvas, dc } = getContext2d('xyCanvas');

const args = {
  ...defaultPlotArgs,
  title: 'X-Y Plot',
  xIs: 'x',
  yIs: 'y',
  markerImgPaths: ['images/circle-cross1.png'],
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
        markerType: 'img',
        markerImg: 'images/circle-cross1.png',
        markerSize: 128,
      },
      tagFirstPoint: false,
    },
  ],
};

const metrics = new Metrics(dc, args, curves);
const plotter = new Plotter(dc, args, curves, metrics);

export async function xyInit() {
  await metrics.markers.init();
}

export function xyResizeAndRender(width, height) {
  metrics.resize(canvas.width, canvas.height);
  plotter.render();
}
