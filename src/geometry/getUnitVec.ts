import { IVec } from '../types';

export const getUnitVec = (u: IVec): IVec => {
  const length = Math.sqrt(u[0] * u[0] + u[1] * u[1]);
  if (length > 0) {
    return [u[0] / length, u[1] / length];
  } else {
    return [u[0], u[1]];
  }
};
