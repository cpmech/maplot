import {
  defaultPlotArgs,
  defaultAxisArgs,
  defaultCurveStyle,
  StaticGraph,
} from '../../dist/esm/index-all-in-one';
import { x, y, z } from './data1';

const args = {
  ...defaultPlotArgs,
  x: {
    ...defaultAxisArgs,
    label: '◄ z',
    coordName: 'z',
    invert: true,
    minFix: -0.1,
    maxFix: +1.1,
    minFixOn: true,
    maxFixOn: true,
  },
  y: {
    ...defaultAxisArgs,
    label: 'y ►',
    coordName: 'y',
    minFix: -0.1,
    maxFix: +1.1,
    minFixOn: true,
    maxFixOn: true,
  },
  title: 'Y-Z Plot',
  markerImgPaths: ['images/star2.png'],
};

const curves = {
  list: [
    {
      label: 'y-z Curve',
      x: x.slice(10),
      y: y.slice(10),
      z: z.slice(10),
      style: {
        ...defaultCurveStyle,
        markerType: 'img',
        markerImg: 'images/star2.png',
        markerSize: 128,
      },
    },
  ],
};

const graph = new StaticGraph(args, curves, 'yzCanvas', 0.5, 0.5);

(async () => {
  await graph.init();
})();
