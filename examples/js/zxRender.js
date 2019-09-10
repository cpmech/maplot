import { defaultPlotArgs, defaultCurveStyle, StaticGraph } from '../../dist/esm/index-all-in-one';
import { x, y, z } from './data1';

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
      x: x.slice(6, 11),
      y: y.slice(6, 11),
      z: z.slice(6, 11),
      style: {
        ...defaultCurveStyle,
        markerType: 'img',
        markerImg: 'images/star1.png',
        markerSize: 128,
      },
    },
  ],
};

const graph = new StaticGraph(args, curves, 'zxCanvas', 0.5, 0.5);

(async () => {
  await graph.init();
})();
