import {
  ICurves,
  IPlotArgs,
  IPadding,
  defaultPlotArgs,
  defaultCurveStyle,
  defaultLegendArgs,
  defaultAxisArgs,
  getColor,
  DynamicGraph,
  numFmt,
  ICoordsToString,
} from '../../src';

const colorScheme = 'medium2';

const args: IPlotArgs = {
  ...defaultPlotArgs,
  markerSizeAuto: false,
  frameShow: false,
  x: {
    ...defaultAxisArgs,
    label: 'x ►',
  },
  l: {
    ...defaultLegendArgs,
    on: true,
    atBottom: false,
  },
  title: 'Many Curves (interactive)',
};

const I = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const X = I.map(i => i / 20.0);
const OMX = X.map(x => 1 - x);
const ZP5 = X.map(x => 0.5);

const curves: ICurves = {
  list: [
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
  ],
};

const padding: IPadding = {
  top: 40,
  left: 0,
  right: 0,
  bottom: 32,
};

const statusString: ICoordsToString = (x: number, y: number): string => {
  return `(${numFmt(x, 3, 8)},${numFmt(y, 3, 8)})`;
};

const graph = new DynamicGraph(
  args,
  curves,
  'myCanvas',
  'statusBar',
  'btnZoomIn',
  'btnZoomOut',
  'btnFocus',
  'btnRescale',
  1,
  1,
  padding,
  statusString,
);

(async () => {
  await graph.init();
})();
