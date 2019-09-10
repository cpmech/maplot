import { defaultPlotArgs, defaultCurveStyle, StaticGraph } from '../../dist/esm/index-all-in-one';
import { x, y, z } from './data1';

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
      x: x.slice(0, 7),
      y: y.slice(0, 7),
      z: z.slice(0, 7),
      style: {
        ...defaultCurveStyle,
        markerType: 'img',
        markerImg: 'images/circle-cross1.png',
        markerSize: 128,
      },
    },
  ],
};

const graph = new StaticGraph(args, curves, 'xyCanvas', 0.5, 0.5);

(async () => {
  await graph.init();
})();
