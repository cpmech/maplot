import {
  ICurves,
  IPlotArgs,
  defaultPlotArgs,
  defaultCurveStyle,
  defaultLegendArgs,
  defaultAxisArgs,
  StaticGraph,
} from '../src';

//           0    1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16
const x = [0.0, 0.0, 0.5, 0.8, 0.8, 0.5, 0.0, 1.0, 0.3, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
const y = [0.0, 1.0, 1.0, 0.7, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.8, 0.6, 0.4, 0.4];
const z = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.2, 0.5, 0.8, 1.0, 1.0, 0.7, 0.5, 0.5, 0.7, 1.0];

const argsXY: IPlotArgs = {
  ...defaultPlotArgs,
  x: {
    ...defaultAxisArgs,
    coordName: 'x',
  },
  y: {
    ...defaultAxisArgs,
    coordName: 'y',
  },
  l: {
    ...defaultLegendArgs,
    on: false,
    atBottom: false,
  },
  title: 'X-Y Plot',
  markerImgPaths: ['images/circle-cross1.png'],
};

const argsYZ: IPlotArgs = {
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
  l: {
    ...defaultLegendArgs,
    on: false,
    atBottom: false,
  },
  title: 'Y-Z Plot',
  markerImgPaths: ['images/star2.png'],
};

const argsZX: IPlotArgs = {
  ...defaultPlotArgs,
  x: {
    ...defaultAxisArgs,
    label: 'z ►',
    coordName: 'z',
  },
  y: {
    ...defaultAxisArgs,
    label: 'x ►',
    coordName: 'x',
  },
  l: {
    ...defaultLegendArgs,
    on: false,
    atBottom: false,
  },
  title: 'Z-X Plot',
  markerImgPaths: ['images/star1.png'],
};

const curvesXY: ICurves = {
  list: [
    {
      label: 'x-y Curve',
      x: x.slice(0, 7),
      y: y.slice(0, 7),
      z: z.slice(0, 7),
      style: {
        ...defaultCurveStyle,
        markerType: 'img',
        markerImg: 'images/circle-cross1.png',
        markerSize: 128,
      },
    },
  ],
};

const curvesYZ: ICurves = {
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

const curvesZX: ICurves = {
  list: [
    {
      label: 'z-x Curve',
      x: x.slice(6, 11),
      y: y.slice(6, 11),
      z: z.slice(6, 11),
      style: {
        ...defaultCurveStyle,
        markerType: 'img',
        markerImg: 'images/star1.png',
        markerSize: 128,
      },
    },
  ],
};

const graphXY = new StaticGraph(argsXY, curvesXY, null, 'xyCanvas', 0.5, 0.5);

const graphYZ = new StaticGraph(argsYZ, curvesYZ, null, 'yzCanvas', 0.5, 0.5);

const graphZX = new StaticGraph(argsZX, curvesZX, null, 'zxCanvas', 0.5, 0.5);

(async () => {
  await graphXY.init();
  await graphYZ.init();
  await graphZX.init();
})();
