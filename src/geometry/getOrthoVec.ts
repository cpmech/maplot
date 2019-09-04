import { IVec } from '../types';

export const getOrthoVec = (u: IVec): IVec => {
  const theta = Math.atan2(u[1], u[0]);
  return [-Math.sin(theta), Math.cos(theta)];
};
