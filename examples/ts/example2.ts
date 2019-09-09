import {
  ICurves,
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

const args = {
  ...defaultPlotArgs,
  title: 'Many Curves',
  xIs: 'x',
  yIs: 'y',
};

const I = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const X = I.map(i => i / 20.0);
const XX = X.map(x => x * x);
const mX = X.map(x => 1 - x);

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
        markerColor: '#cecece',
      },
      tagFirstPoint: true,
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
