import { IPoint, IRect } from '../types';

// this function returns the outside (positive) distance from point to axis-aligned rectangle
// returns -1 if point is inside the rectangle
export const pointRectDist = (x: IPoint, r: IRect): number => {
  // point is @ left
  if (x[0] <= r.a[0]) {
    if (x[1] < r.a[1]) {
      // outside along downward diagonal to the left
      return Math.sqrt((x[0] - r.a[0]) * (x[0] - r.a[0]) + (x[1] - r.a[1]) * (x[1] - r.a[1]));
    }
    if (x[1] > r.b[1]) {
      // outside along upward diagonal to the left
      return Math.sqrt((x[0] - r.a[0]) * (x[0] - r.a[0]) + (x[1] - r.b[1]) * (x[1] - r.b[1]));
    }
    // outside to the left or on edge
    return r.a[0] - x[0]; // > 0 means outside
  }

  // point is @ right
  if (x[0] >= r.b[0]) {
    if (x[1] < r.a[1]) {
      // outside along downward diagonal to the right
      return Math.sqrt((x[0] - r.b[0]) * (x[0] - r.b[0]) + (x[1] - r.a[1]) * (x[1] - r.a[1]));
    }
    if (x[1] > r.b[1]) {
      // outside along upward diagonal to the right
      return Math.sqrt((x[0] - r.b[0]) * (x[0] - r.b[0]) + (x[1] - r.b[1]) * (x[1] - r.b[1]));
    }
    // outside to the right or on edge
    return x[0] - r.b[0]; // > 0 means outside
  }

  // lower
  if (x[1] < r.a[1]) {
    return r.a[1] - x[1]; // > 0 means outside
  }

  // upper
  if (x[1] > r.b[1]) {
    return x[1] - r.b[1]; // > 0 means outside
  }

  // on rectangle or inside
  return -1; // < 1 means inside
};
