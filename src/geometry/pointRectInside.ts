import { IPoint, IRect, ILimits } from '../types';

// pointRectInside returns wether a point is inside a rectangle or not
export const pointRectInside = (p: IPoint, r: IRect, tol: number = 0.0001): boolean => {
  if (p[0] < r.a[0] - tol) {
    return false;
  }
  if (p[0] > r.b[0] + tol) {
    return false;
  }
  if (p[1] < r.a[1] - tol) {
    return false;
  }
  if (p[1] > r.b[1] + tol) {
    return false;
  }
  return true;
};

// pointRectInsideL returns wether a point is inside a rectangle or not (limits version)
export const pointRectInsideL = (
  x: number,
  y: number,
  limits: ILimits,
  tol: number = 0.0001,
): boolean => {
  if (x < limits.xmin - tol) {
    return false;
  }
  if (x > limits.xmax + tol) {
    return false;
  }
  if (y < limits.ymin - tol) {
    return false;
  }
  if (y > limits.ymax + tol) {
    return false;
  }
  return true;
};
