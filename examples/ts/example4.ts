import {
  ICurves,
  IPlotArgs,
  Metrics,
  Plotter,
  defaultPlotArgs,
  defaultCurveStyle,
  Resizer,
  getContext2d,
} from '../../src';

const { canvas, dc } = getContext2d('myCanvas');

const images = [
  { filePath: 'images/blue-hrect.png', markerSize: 0, label: 'H-Rect' },
  { filePath: 'images/red-vrect.png', markerSize: 0, label: 'V-Rect' },
  { filePath: 'images/yellow-square.png', markerSize: 0, label: 'Square' },
  // { filePath: 'images/base-200.png', markerSize: 16, label: 'Base' },
  // { filePath: 'images/city-200.png', markerSize: 32, label: 'City' },
  // { filePath: 'images/fortress-200.png', markerSize: 24, label: 'Fortress' },
  // { filePath: 'images/house-200.png', markerSize: 16, label: 'House' },
  // { filePath: 'images/intersection-200.png', markerSize: 14, label: 'Intersection' },
  // { filePath: 'images/lookout-200.png', markerSize: 16, label: 'Lookout' },
  // { filePath: 'images/mine-200.png', markerSize: 16, label: 'Mine' },
  // { filePath: 'images/station-200.png', markerSize: 16, label: 'Station' },
  // { filePath: 'images/tower-200.png', markerSize: 16, label: 'Tower' },
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
    kind: 'curve',
    x: [0],
    y: [0],
    z: [],
    style: {
      ...defaultCurveStyle,
      lineStyle: 'none',
      markerType: 'img',
      markerImg: image.filePath,
      // markerSize: image.markerSize,
    },
    tagFirstPoint: false,
  })),
};

/*
curves.list.push({
  label: 'With Marker',
  kind: 'curve',
  x: [1],
  y: [1],
  z: [],
  style: {
    ...defaultCurveStyle,
    markerType: 'o',
    markerColor: '#ffd600',
    markerLineColor: '#000',
  },
  tagFirstPoint: false,
});
*/

const metrics = new Metrics(dc, args, curves);
const plotter = new Plotter(dc, args, curves, metrics);
const resizer = new Resizer();

function resizeCanvas() {
  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;
  canvas.width = width;
  canvas.height = height;
  metrics.resize(canvas.width, canvas.height);
  plotter.render();
}

(async () => {
  await metrics.markers.init();
  resizer.init(resizeCanvas);
})();
