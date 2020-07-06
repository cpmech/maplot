export type LineStyle = '-' | '--' | ':' | 'none';

export type MarkerType = 'o' | 's' | '+' | 'x' | 'img' | 'none';

export interface ICurveStyle {
  // lines
  lineColor: string; // color
  lineAlpha: number; // alpha (0, 1]. A<1e-14 => A=1.0
  lineStyle: LineStyle; // style
  lineWidth: number; // width

  // markers
  markerType: MarkerType; // type
  markerImg: string; // image filename
  markerColor: string; // color
  markerAlpha: number; // alpha (0, 1]
  markerSize: number; // size; when using images, set markerSize=0 to use the image width
  markerEvery: number; // mark-every
  markerLineColor: string; // edge color
  markerLineWidth: number; // edge width
  markerLineStyle: LineStyle; // edge style
  markerIsVoid: boolean; // void marker (draw edge only)
}

export interface ICurve {
  style: ICurveStyle; // line and marker arguments
  label: string; // curve name or connection pair such as 'San Francisco -> Los Angeles'
  x: number[]; // x-coordinates
  y: number[]; // y-coordinates
  z?: number[]; // z-coordinates
  kind?: string; // e.g. connection, city, fortress, base, mine, ...
  tagFirstPoint?: boolean; // tag first point with label
}

export interface ICurves {
  list: ICurve[];
}

export const defaultCurveStyle: ICurveStyle = {
  // lines
  lineColor: '#b33434',
  lineAlpha: 0.7,
  lineStyle: '-',
  lineWidth: 3,

  // markers
  markerType: 'o',
  markerImg: '',
  markerColor: '#4c4deb',
  markerAlpha: 1,
  markerSize: 0,
  markerEvery: 0,
  markerLineColor: '#ffffff',
  markerLineWidth: 2,
  markerLineStyle: 'none',
  markerIsVoid: false,
};

export const newZeroCurveStyle = (): ICurveStyle => ({
  lineColor: '',
  lineAlpha: 0,
  lineStyle: '-',
  lineWidth: 0,
  markerType: '+',
  markerImg: '',
  markerColor: '',
  markerAlpha: 0,
  markerSize: 0,
  markerEvery: 0,
  markerLineColor: '',
  markerLineWidth: 0,
  markerLineStyle: '-',
  markerIsVoid: false,
});

export const newZeroCurve = (): ICurve => ({
  style: newZeroCurveStyle(),
  label: '',
  x: [],
  y: [],
  z: [],
  kind: '',
  tagFirstPoint: false,
});
