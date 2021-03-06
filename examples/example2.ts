import {
  ICurves,
  IPlotArgs,
  defaultPlotArgs,
  defaultCurveStyle,
  defaultLegendArgs,
  defaultAxisArgs,
  getColor,
  StaticGraph,
} from '../src';

const colorScheme = 'medium2';

const args: IPlotArgs = {
  ...defaultPlotArgs,
  markerSizeAuto: false,
  x: {
    ...defaultAxisArgs,
    label: 'x ►',
  },
  l: {
    ...defaultLegendArgs,
    on: true,
    atBottom: false,
  },
  title: 'Many Curves',
  markerImgPaths: ['images/blue-hrect.png', 'images/road-sign1.png'],
};

const I = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const X = I.map((i) => i / 20.0);
const XX = X.map((x) => x * x);
const OMX = X.map((x) => 1 - x);
const OMX2 = X.map((x) => 1 - x * x);
const ZP5 = X.map((x) => 0.5);
const MX = X.map((x) => 4 * x * (1 - x));
const NX = X.map((x) => 1 - 4 * x * (1 - x));

const curves: ICurves = {
  list: [
    {
      label: 'y = -4 x (1 - x)',
      x: X,
      y: NX,
      style: {
        ...defaultCurveStyle,
        lineColor: getColor(0, colorScheme),
        markerType: 'img',
        markerImg: 'images/road-sign1.png',
        markerSize: 64,
        markerColor: '#000000',
        markerLineColor: '#000000',
        markerEvery: 5,
      },
    },
    {
      label: 'y = 4 x (1 - x)',
      x: X,
      y: MX,
      style: {
        ...defaultCurveStyle,
        lineColor: getColor(1, colorScheme),
        markerType: 'img',
        markerImg: 'images/blue-hrect.png',
        markerSize: 128,
        markerColor: '#000000',
        markerLineColor: '#000000',
        markerEvery: 5,
      },
    },
    {
      label: 'y = x',
      x: X,
      y: X,
      style: {
        ...defaultCurveStyle,
        lineColor: getColor(2, colorScheme),
        markerColor: '#000000',
        markerLineColor: '#000000',
      },
    },
    {
      label: 'y = x²',
      kind: 'curve',
      x: X,
      y: XX,
      style: {
        ...defaultCurveStyle,
        lineColor: getColor(3, colorScheme),
        markerType: 'none',
      },
    },
    {
      label: 'y = 1 - x',
      x: X,
      y: OMX,
      z: [],
      style: {
        ...defaultCurveStyle,
        lineColor: getColor(4, colorScheme),
        markerType: '+',
        markerColor: '#000000',
      },
    },
    {
      label: 'y = 0.5',
      x: X,
      y: ZP5,
      style: {
        ...defaultCurveStyle,
        lineColor: getColor(5, colorScheme),
        markerType: 'x',
        markerColor: '#000000',
      },
    },
    {
      label: 'y = 1 - x²',
      x: X,
      y: OMX2,
      style: {
        ...defaultCurveStyle,
        lineColor: getColor(6, colorScheme),
        markerType: 's',
        markerColor: '#000000',
        markerLineColor: '#000000',
      },
    },
  ],
};

const graph = new StaticGraph(args, curves, 'myCanvasParent', 'myCanvas');

(async () => {
  await graph.init();
})();
