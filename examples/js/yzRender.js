import { defaultPlotArgs, defaultCurveStyle, StaticGraph } from '../../dist/esm/index-all-in-one';
import { x, y, z } from './data1';

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
