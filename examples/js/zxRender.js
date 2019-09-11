import {
  defaultPlotArgs,
  defaultAxisArgs,
  defaultCurveStyle,
  defaultLegendArgs,
  StaticGraph,
} from '../../dist/esm/index-all-in-one';
import { x, y, z } from './data1';

const args = {
  ...defaultPlotArgs,
  x: {
    ...defaultAxisArgs,
    label: 'z ►',
    coordName: 'z',
  },
  y: {
    ...defaultAxisArgs,
    label: 'x ►',
    coordName: 'x',
  },
  l: {
    ...defaultLegendArgs,
    on: false,
    atBottom: false,
  },
  title: 'Z-X Plot',
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
