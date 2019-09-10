import {
  ICurves,
  IPlotArgs,
  Metrics,
  Plotter,
  defaultPlotArgs,
  defaultCurveStyle,
  Resizer,
  getColor,
  getContext2d,
  Markers,
} from '../../src';

const { canvas, dc } = getContext2d('myCanvas');

const args: IPlotArgs = {
  ...defaultPlotArgs,
  title: 'Many Curves',
  xIs: 'x',
  yIs: 'y',
  legendOn: true,
  markerImgPaths: ['images/blue-hrect.png', 'images/road-sign1.png'],
};

const I = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const X = I.map(i => i / 20.0);
const XX = X.map(x => x * x);
const OMX = X.map(x => 1 - x);
const OMX2 = X.map(x => 1 - x * x);
const ZP5 = X.map(x => 0.5);
const MX = X.map(x => 4 * x * (1 - x));
const NX = X.map(x => 1 - 4 * x * (1 - x));

const curves: ICurves = {
  list: [
    {
      label: 'y = -4 x (1 - x)',
      kind: 'curve',
      x: X,
      y: NX,
      z: [],
      style: {
        ...defaultCurveStyle,
        lineColor: getColor(0, 'medium2'),
        markerType: 'img',
        markerImg: 'images/road-sign1.png',
        markerSize: 64,
        markerColor: '#ffd600',
        markerLineColor: '#000000',
        markerEvery: 5,
      },
      tagFirstPoint: false,
    },
    {
      label: 'y = 4 x (1 - x)',
      kind: 'curve',
      x: X,
      y: MX,
      z: [],
      style: {
        ...defaultCurveStyle,
        lineColor: getColor(4, 'medium2'),
        markerType: 'img',
        markerImg: 'images/blue-hrect.png',
        markerSize: 128,
        markerColor: '#ffd600',
        markerLineColor: '#000000',
        markerEvery: 5,
      },
      tagFirstPoint: false,
    },
    {
      label: 'y = x',
      kind: 'curve',
      x: X,
      y: X,
      z: [],
      style: {
        ...defaultCurveStyle,
        lineColor: '#0f0',
        markerColor: '#f00',
        markerLineColor: '#000',
      },
      tagFirstPoint: false,
    },
    {
      label: 'y = x²',
      kind: 'curve',
      x: X,
      y: XX,
      z: [],
      style: {
        ...defaultCurveStyle,
        lineColor: getColor(0),
        markerType: 'none',
      },
      tagFirstPoint: false,
    },
    {
      label: 'y = 1 - x',
      kind: 'curve',
      x: X,
      y: OMX,
      z: [],
      style: {
        ...defaultCurveStyle,
        lineColor: getColor(1),
        markerType: '+',
        markerColor: '#555555',
      },
      tagFirstPoint: false,
    },
    {
      label: 'y = 0.5',
      kind: 'curve',
      x: X,
      y: ZP5,
      z: [],
      style: {
        ...defaultCurveStyle,
        lineColor: getColor(5),
        markerType: 'x',
        markerColor: '#f18a1f',
      },
      tagFirstPoint: true,
    },
    {
      label: 'y = 1 - x²',
      kind: 'curve',
      x: X,
      y: OMX2,
      z: [],
      style: {
        ...defaultCurveStyle,
        lineColor: getColor(2),
        markerType: 's',
        markerColor: '#ffd600',
        markerLineColor: '#000000',
      },
      tagFirstPoint: false,
    },
  ],
};

const markers = new Markers(dc, args);
const legend = new Legend(dc, args, curves, markers);
const metrics = new Metrics(dc, args, curves, markers);
const plotter = new Plotter(dc, args, curves, metrics, markers);
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
