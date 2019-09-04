export type IPoint = number[]; // two values

export interface IRect {
  a: IPoint;
  b: IPoint;
}

export type IVec = number[]; // two components

export interface ICoords {
  x: number;
  y: number;
}

export interface ILimits {
  xmin: number; // minimum x value
  ymin: number; // minimum y value
  xmax: number; // maximum x value
  ymax: number; // maximum y value
}
