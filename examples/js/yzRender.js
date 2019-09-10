import {
  Metrics,
  Plotter,
  defaultPlotArgs,
  defaultCurveStyle,
  getContext2d,
} from '../../dist/esm/index-all-in-one';
import { x, y, z } from './data1';

const { canvas, dc } = getContext2d('yzCanvas');

const args = {
  ...defaultPlotArgs,
  title: 'Y-Z Plot',
  xIs: 'z',
  yIs: 'y',
  xLabel: '◄ z',
  yLabel: 'y ►',
  invertXscale: true,
  markerImgPaths: ['images/star2.png'],
  xminFix: -0.1,
  xmaxFix: +1.1,
  yminFix: -0.1,
  ymaxFix: +1.1,
  xminFixOn: true,
  xmaxFixOn: true,
  yminFixOn: true,
  ymaxFixOn: true,
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
        markerType: 'img',
        markerImg: 'images/star2.png',
        markerSize: 128,
      },
      tagFirstPoint: false,
    },
  ],
};

const metrics = new Metrics(dc, args, curves);
const plotter = new Plotter(dc, args, curves, metrics);

export async function yzInit() {
  await metrics.markers.init();
}

export function yzResizeAndRender(width, height) {
  metrics.resize(canvas.width, canvas.height);
  plotter.render();
}
