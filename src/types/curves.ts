export interface ICurveStyle {
  // lines
  lineColor: string; // color
  lineAlpha: number; // alpha (0, 1]. A<1e-14 => A=1.0
  lineStyle: string; // style '-'='', '--', ':'
  lineWidth: number; // width

  // markers
  markerType: string; // type, e.g. "o", "s", "+", "x", "img:filename.png"
  markerColor: string; // color
  markerAlpha: number; // alpha (0, 1]
  markerSize: number; // size; when using images, set markerSize=0 to use the image width
  markerEvery: number; // mark-every
  markerLineColor: string; // edge color
  markerLineWidth: number; // edge width
  markerLineStyle: string; // edge style: '-'='', '--', ':'
  markerIsVoid: boolean; // void marker (draw edge only)
}

export interface ICurve {
  label: string; // curve name or connection pair such as 'San Francisco -> Los Angeles'
  type: string; // e.g. connection, city, fortress, base, mine, ...
  x: number[]; // x-coordinates
  y: number[]; // y-coordinates
  z: number[]; // z-coordinates
  style: ICurveStyle; // line and marker arguments
  tagFirstPoint: boolean; // tag first point with label
}

export interface ICurves {
  list: ICurve[];
}
