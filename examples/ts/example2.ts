import {
  ICurves,
  IPlotArgs,
  Metrics,
  Plotter,
  defaultPlotArgs,
  defaultCurveStyle,
  Resizer,
  getColor,
} from '../../src';

const el = document.getElementById('myCanvas');
if (!el) {
  throw new Error('Cannot get "myCanvas"');
}

const canvas = el as HTMLCanvasElement;
const dc = canvas.getContext('2d');
if (!dc) {
  throw new Error('Cannot get device context');
}

const args: IPlotArgs = {
  ...defaultPlotArgs,
  title: 'Many Curves',
  xIs: 'x',
  yIs: 'y',
};

const I = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const X = I.map(i => i / 20.0);
const XX = X.map(x => x * x);
const mX = X.map(x => 1 - x);
const mX2 = X.map(x => 1 - x * x);
const zp5 = X.map(x => 0.5);

const curves: ICurves = {
  list: [
    {
      label: 'y = x',
      kind: 'curve',
      x: X,
      y: X,
      z: [],
      style: {
        ...defaultCurveStyle,
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
      y: mX,
      z: [],
      style: {
        ...defaultCurveStyle,
        lineColor: getColor(1),
        markerType: '+',
        markerColor: '#555555',
      },
      tagFirstPoint: true,
    },
    {
      label: 'y = 0.5',
      kind: 'curve',
      x: X,
      y: zp5,
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
      y: mX2,
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

resizer.init(resizeCanvas);

resizeCanvas();
