export interface IPlotArgs {
  // title and labels
  title: string; // Title
  xLabel: string; // XLabel
  yLabel: string; // YLabel
  yLabelVert: boolean; // draw y-label vertically

  // options
  xIs: string; // x-axis is 'x', for example
  yIs: string; // y-axis is 'z', for example
  equalScale: boolean; // equal scale factors
  invertYscale: boolean; // invert y-scale
  clipOn: boolean; // clip outside lines
  deltaH: number; // DH increment
  deltaV: number; // DV increment
  markerSizeMin: number; // min marker size
  markerSizeMax: number; // max marker size

  // legend
  legendOn: boolean; // legend is on
  legAtBottom: boolean; // legend at bottom
  legLineLen: number; // length of legend line indicator
  legGap: number; // legend: gap between icons
  legTxtGap: number; // legend: gap between line and text
  legNrow: number; // legend: number of rows

  // constants
  padTitle: number; // padding for title drawing
  padLines: number; // padding between lines
  padXlabel: number; // padding between x-label and scale nubmers
  padYlabel: number; // padding between y-label and scale nubmers
  padLegRR: number; // padding between legend and plot area in right-ruler
  padSmall: number; // small padding
  minWidthLR: number; // minimum width of left ruler
  minHeightBR: number; // minimum height of bottom ruler
  minWidthRR: number; // minimum width of right ruler

  // ticks
  xTicksVert: boolean; // draw x ticks vertically
  xTicksNumber: number; // number of x-ticks
  yTicksNumber: number; // number of y-ticks
  xTicksWholeNums: boolean; // use whole numbers only
  yTicksWholeNums: boolean; // use whole numbers only
  xTicksLength: number; // length of tick lines
  yTicksLength: number; // length of tick lines
  xTicksFormat: string; // sprintf format for digits of x-ticks
  yTicksFormat: string; // sprintf format for digits of y-ticks
  xTicksDecDigits: number; // number of decimal digits of x-ticks (-1 means all possible digits)
  yTicksDecDigits: number; // number of decimal digits of y-ticks (-1 means all possible digits)
  xTicksColor: string; // color
  yTicksColor: string; // color
  xTicksAlpha: number; // alpha
  yTicksAlpha: number; // alpha
  xTicksLineWidth: number; // linewidth
  yTicksLineWidth: number; // linewidth
  xTicksLineStyle: string; // line style
  yTicksLineStyle: string; // line style

  // scale
  xminStart: number; // start x-min
  xmaxStart: number; // start x-max
  yminStart: number; // start y-min
  ymaxStart: number; // start y-max
  xminFix: number; // fixed minimum x value (real coordinates)
  xmaxFix: number; // fixed maximum x value (real coordinates)
  yminFix: number; // fixed minimum y value (real coordinates)
  ymaxFix: number; // fixed maximum y value (real coordinates)
  xminFixOn: boolean; // use or not xminFix
  xmaxFixOn: boolean; // use or not xmaxFix
  yminFixOn: boolean; // use or not yminFix
  ymaxFixOn: boolean; // use or not ymaxFix

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
  gridLineStyle: string; // line style of grid

  // border and frame
  borderShow: boolean; // draw (inner) borders
  borderColor: string; // color of (inner) border
  borderAlpha: number; // alpha of (inner) border
  borderLineWidth: number; // line width of (inner) border
  borderLineStyle: string; // line style of (inner) border
  frameShow: boolean; // draw (external) frame
  frameColor: string; // color of frame
  frameAlpha: number; // alpha of frame
  frameLineWidth: number; // line width of frame
  frameLineStyle: string; // line style of frame
}

export const zeroPlotArgs: IPlotArgs = {
  // title and labels
  title: 'XY Plot',
  xLabel: 'x ►',
  yLabel: '◄ y',
  yLabelVert: true,

  // options
  xIs: 'x',
  yIs: 'z',
  equalScale: true,
  invertYscale: true,
  clipOn: false,
  deltaH: 8,
  deltaV: 8,
  markerSizeMin: 10,
  markerSizeMax: 200,

  // legend
  legendOn: false,
  legAtBottom: false,
  legLineLen: 30,
  legGap: 20,
  legTxtGap: 4,
  legNrow: 1,

  // constants
  padTitle: 20,
  padLines: 2,
  padXlabel: 8,
  padYlabel: 8,
  padLegRR: 20,
  padSmall: 2,
  minWidthLR: 70,
  minHeightBR: 70,
  minWidthRR: 0,

  // ticks
  xTicksVert: true,
  xTicksNumber: 8,
  yTicksNumber: 8,
  xTicksWholeNums: true,
  yTicksWholeNums: true,
  xTicksLength: 6,
  yTicksLength: 6,
  xTicksFormat: '%g',
  yTicksFormat: '%g',
  xTicksDecDigits: 0,
  yTicksDecDigits: 0,
  xTicksColor: '#414141',
  yTicksColor: '#414141',
  xTicksAlpha: 1.0,
  yTicksAlpha: 1.0,
  xTicksLineWidth: 1.0,
  yTicksLineWidth: 1.0,
  xTicksLineStyle: '-',
  yTicksLineStyle: '-',

  // scale
  xminStart: -10000,
  xmaxStart: +10000,
  yminStart: -10000,
  ymaxStart: +10000,
  xminFix: 0,
  xmaxFix: 0,
  yminFix: 0,
  ymaxFix: 0,
  xminFixOn: false,
  xmaxFixOn: false,
  yminFixOn: false,
  ymaxFixOn: false,

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
