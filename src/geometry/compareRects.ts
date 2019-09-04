import { IRect } from '../types';

export interface ICompareRects {
  xminus: boolean;
  xplus: boolean;
  yminus: boolean;
  yplus: boolean;
  intersected: boolean;
}

// compareRects compares vertical/horizontal positions of rectangles
export const compareRects = (reference: IRect, target: IRect): ICompareRects => {
  const res = {
    xminus: false,
    xplus: false,
    yminus: false,
    yplus: false,
    intersected: false,
  };
  res.xminus = target.b[0] < reference.a[0];
  res.xplus = target.a[0] > reference.b[0];
  res.yminus = target.b[1] < reference.a[1];
  res.yplus = target.a[1] > reference.b[1];
  res.intersected = !res.xminus && !res.xplus && !res.yminus && !res.yplus;
  return res;
};
