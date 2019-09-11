import { LineStyle } from '../types';

export interface ITicksArgs {
  vertNums: boolean; // vertical scale numbers
  wholeNums: boolean; // use whole numbers only
  approxNumber: number; // approximate number of ticks
  maxNumber: number; // maximum number
  length: number; // length of tick lines
  decDigits: number; // number of decimal digits of ticks (-1 means all possible digits)
  color: string; // color
  alpha: number; // alpha
  lineWidth: number; // linewidth
  lineStyle: LineStyle; // line style
  gapValue: number; // gap between tick and its corresponding value
  gapLabel: number; // gap between tick line and label
}

export interface IAxisArgs {
  // options
  label: string; // label
  coordName: 'x' | 'y' | 'z'; // coordinate name in Curves' data
  labelVert: boolean; // label vertically
  invert: boolean; // invert scale

  // ticks
  t: ITicksArgs; // ticks

  // scale
  minStart: number; // start min
  maxStart: number; // start max
  minFix: number; // fixed minimum value (real coordinates)
  maxFix: number; // fixed maximum value (real coordinates)
  minFixOn: boolean; // use or not minFix
  maxFixOn: boolean; // use or not maxFix
}

export interface ILegendArgs {
  // options
  on: boolean; // legend is on
  atBottom: boolean; // legend at bottom
  centerH: boolean; // center within plot area (horizontally)
  centerV: boolean; // center within plot area (vertically)
  nCol: number; // number of columns
  lineLen: number; // length of line
  labelColor: string; // color of labels
  labelAtRight: boolean; // draw label @ right of marker/line
  drawIconFrame: boolean; // draw frame around icons

  // constants
  markerSize: number; // marker size
  gapH: number; // gap between border and line or label (horizontal)
  gapV: number; // gap between icon border and marker or text (vertical)
  gapEnd: number; // gap between marker and line end
  gapLabelH: number; // gap between line and label (horizontal)
  gapLabelV: number; // gap between line and label (vertical)
  gapIconsH: number; // gap between icons (horizonal)
  gapIconsV: number; // gap between icons (vertical)

  // styling
  frameFillColor: string; // color for frame
  frameEdgeColor: string; // color for edge of frame
}

export interface IPlotArgs {
  // options
  title: string; // Title
  equalScale: boolean; // equal scale factors
  clipOn: boolean; // clip outside lines

  // markers
  markerImgPaths: string[]; // image paths
  markerSizeAuto: boolean; // automatic resize markers
  markerSizeDefault: number; // default marker size. NOTE: also used as reference to auto-marker-size
  markerSizeMin: number; // min marker size
  markerSizeMax: number; // max marker size
  markerSizeRefProp: number; // reference proportion in screen coords e.g. 1/800

  // axes
  x: IAxisArgs;
  y: IAxisArgs;

  // legend
  l: ILegendArgs;

  // constants
  dH: number; // DH increment
  dV: number; // DV increment
  gLR: number; // gap for left-ruler
  gRR: number; // gap for right-ruler
  gBR: number; // gap for bottom-ruler
  gTR: number; // gap for top-ruler
  minTR: number; // minimum width of top-ruler
  minBR: number; // minimum width of bottom-ruler
  minLR: number; // minimum width of left-ruler
  minRR: number; // minimum width of right-ruler

  // fonts
  fnameTitle: string; // font name for title text
  fnameTicks: string; // font name for ticks text
  fnameLabels: string; // font name for x-y labels
  fnameMarkerLabel: string; // font name for x-y marker labels
  fnameLegend: string; // font name for legend text
  fsizeTitle: number; // font size of title text
  fsizeTicks: number; // font size of ticks text
  fsizeLabels: number; // font size of x-y labels
  fsizeMarkerLabel: number; // font size of marker labels
  fsizeLegend: number; // font size of legend text

  // colors
  colorPlotArea: string; // plot area
  colorBottomRuler: string; // bottom ruler
  colorLeftRuler: string; // left ruler
  colorTopRuler: string; // top ruler
  colorRightRuler: string; // right ruler
  colorMarkerLabel: string; // color for the marker label

  // grid
  gridShow: boolean; // draw grid
  gridColor: string; // color of grid
  gridAlpha: number; // alpha of grid
  gridLineWidth: number; // line width of grid
  gridLineStyle: LineStyle; // line style of grid

  // border and frame
  borderShow: boolean; // draw (inner) borders
  borderColor: string; // color of (inner) border
  borderAlpha: number; // alpha of (inner) border
  borderLineWidth: number; // line width of (inner) border
  borderLineStyle: LineStyle; // line style of (inner) border
  frameShow: boolean; // draw (external) frame
  frameColor: string; // color of frame
  frameAlpha: number; // alpha of frame
  frameLineWidth: number; // line width of frame
  frameLineStyle: LineStyle; // line style of frame
}

export const defaultTicksArgs: ITicksArgs = {
  vertNums: false,
  wholeNums: false,
  approxNumber: 8,
  maxNumber: 100,
  length: 8,
  decDigits: -1,
  color: '#414141',
  alpha: 1.0,
  lineWidth: 2,
  lineStyle: '-',
  gapValue: 3,
  gapLabel: 6,
};

export const defaultAxisArgs: IAxisArgs = {
  // options
  label: '',
  coordName: 'x',
  labelVert: false,
  invert: false,

  // ticks
  t: { ...defaultTicksArgs },

  // scale
  minStart: -10000,
  maxStart: +10000,
  minFix: 0,
  maxFix: 0,
  minFixOn: false,
  maxFixOn: false,
};

export const defaultLegendArgs: ILegendArgs = {
  // options
  on: true,
  atBottom: false,
  centerH: true,
  centerV: true,
  nCol: 0,
  lineLen: 50,
  labelColor: '#414141',
  labelAtRight: false,
  drawIconFrame: true,

  // constants
  markerSize: 12,
  gapH: 8,
  gapV: 8,
  gapEnd: 12,
  gapLabelH: 8,
  gapLabelV: 8,
  gapIconsH: 8,
  gapIconsV: 8,

  // styling
  frameFillColor: '#ffffff',
  frameEdgeColor: '#ffffff',
};

export const defaultPlotArgs: IPlotArgs = {
  // options
  title: 'XY Plot',
  equalScale: false,
  clipOn: false,

  // markers
  markerImgPaths: [],
  markerSizeAuto: true,
  markerSizeDefault: 10,
  markerSizeMin: 1,
  markerSizeMax: 1000,
  markerSizeRefProp: 1 / 800,

  // axes
  x: {
    ...defaultAxisArgs,
    t: {
      ...defaultTicksArgs,
      vertNums: true,
    },
    label: 'x ►',
    coordName: 'x',
  },
  y: {
    ...defaultAxisArgs,
    t: {
      ...defaultTicksArgs,
      vertNums: false,
    },
    label: 'y ►',
    coordName: 'y',
    labelVert: true,
  },

  // legend
  l: { ...defaultLegendArgs },

  // constants
  dH: 8,
  dV: 8,
  gLR: 6,
  gRR: 6,
  gBR: 6,
  gTR: 6,
  minTR: 6,
  minBR: 6,
  minLR: 6,
  minRR: 6,

  // fonts
  fnameTitle: 'Arial',
  fnameTicks: 'Arial',
  fnameLabels: 'Arial',
  fnameMarkerLabel: 'Arial',
  fnameLegend: 'Arial',
  fsizeTitle: 14,
  fsizeTicks: 10,
  fsizeLabels: 12,
  fsizeMarkerLabel: 12,
  fsizeLegend: 12,

  // colors
  colorPlotArea: 'white',
  colorBottomRuler: '#ececec',
  colorLeftRuler: '#ececec',
  colorTopRuler: '#ececec',
  colorRightRuler: '#ececec',
  colorMarkerLabel: '#562c76',

  // grid
  gridShow: true,
  gridColor: '#ececec',
  gridAlpha: 1.0,
  gridLineWidth: 1.0,
  gridLineStyle: '-',

  // border and frame
  borderShow: true,
  borderColor: '#b7b7b7',
  borderAlpha: 1.0,
  borderLineWidth: 1.0,
  borderLineStyle: '-',
  frameShow: false,
  frameColor: '#000000',
  frameAlpha: 1.0,
  frameLineWidth: 2.0,
  frameLineStyle: '-',
};
