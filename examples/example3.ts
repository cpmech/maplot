import { ICurves, IPlotArgs, defaultPlotArgs, defaultCurveStyle, StaticGraph } from '../src';

const images = [
  { filePath: 'images/base-200.png', markerSize: 60, label: 'Base' },
  { filePath: 'images/city-200.png', markerSize: 100, label: 'City' },
  { filePath: 'images/fortress-200.png', markerSize: 60, label: 'Fortress' },
  { filePath: 'images/house-200.png', markerSize: 60, label: 'House' },
  { filePath: 'images/intersection-200.png', markerSize: 60, label: 'Intersection' },
  { filePath: 'images/lookout-200.png', markerSize: 60, label: 'Lookout' },
  { filePath: 'images/mine-200.png', markerSize: 60, label: 'Mine' },
  { filePath: 'images/station-200.png', markerSize: 60, label: 'Station' },
  { filePath: 'images/tower-200.png', markerSize: 60, label: 'Tower' },
];

const args: IPlotArgs = {
  ...defaultPlotArgs,
  title: 'Many Curves',
  markerImgPaths: images.map((image) => image.filePath),
  markerSizeAuto: true,
};

const curves: ICurves = {
  list: images.map((image, i) => ({
    label: image.label,
    x: [i / images.length],
    y: [i / images.length],
    style: {
      ...defaultCurveStyle,
      lineStyle: 'none',
      markerType: 'img',
      markerImg: image.filePath,
      markerSize: image.markerSize,
    },
  })),
};

curves.list.push({
  label: 'With Marker',
  kind: 'curve',
  x: [1],
  y: [1],
  style: {
    ...defaultCurveStyle,
    markerType: 'o',
    markerColor: '#ffd600',
    markerLineColor: '#000',
  },
});

const graph = new StaticGraph(args, curves, 'myCanvasParent', 'myCanvas');

(async () => {
  await graph.init();
})();
