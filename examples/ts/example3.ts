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

const markerImgPaths = [
  'images/base-200.png',
  'images/city-200.png',
  'images/fortress-200.png',
  'images/house-200.png',
  'images/intersection-200.png',
  'images/lookout-200.png',
  'images/mine-200.png',
  'images/station-200.png',
  'images/tower-200.png',
];

const args: IPlotArgs = {
  ...defaultPlotArgs,
  title: 'Many Curves',
  xIs: 'x',
  yIs: 'y',
  markerImgPaths,
  legendOn: true,
};

const I = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const X = I.map(i => i / 10.0);

const curves: ICurves = {
  list: markerImgPaths.map((markerImg, i) => ({
    label: markerImg.replace(/images\//, ''),
    kind: 'curve',
    x: [X[i]],
    y: [X[i]],
    z: [],
    style: {
      ...defaultCurveStyle,
      markerType: 'img',
      markerImg,
    },
    tagFirstPoint: false,
  })),
};

const metrics = new Metrics(dc, args, curves);
const plotter = new Plotter(dc, args, curves, metrics);

function resizeCanvas() {
  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;
  canvas.width = width;
  canvas.height = height;
  metrics.resize(canvas.width, canvas.height);
  plotter.render();
}

const resizer = new Resizer();

(async () => {
  await metrics.markers.init();
  resizer.init(resizeCanvas);
})();
