import { ICurves, IPlotArgs, defaultPlotArgs, defaultCurveStyle, StaticGraph } from '../../src';

const images = [
  { filePath: 'images/blue-hrect.png', markerSize: 0, label: 'H-Rect' },
  { filePath: 'images/red-vrect.png', markerSize: 0, label: 'V-Rect' },
  { filePath: 'images/yellow-square.png', markerSize: 0, label: 'Square' },
];

const args: IPlotArgs = {
  ...defaultPlotArgs,
  title: 'Many Curves',
  xIs: 'x',
  yIs: 'y',
  markerImgPaths: images.map(image => image.filePath),
  legendOn: false,
  markerSizeAuto: true,
  equalScale: true,
};

const curves: ICurves = {
  list: images.map((image, i) => ({
    label: image.label,
    x: [0],
    y: [0],
    style: {
      ...defaultCurveStyle,
      lineStyle: 'none',
      markerType: 'img',
      markerImg: image.filePath,
      // markerSize: image.markerSize,
    },
  })),
};

const graph = new StaticGraph(args, curves, 'myCanvas');

(async () => {
  await graph.init();
})();
