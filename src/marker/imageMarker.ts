import { ICurveStyle } from '../types';
import { loadImages } from '../io';

export interface IImageMarkerDB {
  [markerType: string]: HTMLImageElement;
}

let imageMarkerFiles: string[] = [];

const imageMarkerDB: IImageMarkerDB = {};

export const setImageMarkerFiles = (paths: string[]) => {
  imageMarkerFiles = paths;
};

export const loadMarkerImages = async (): Promise<void> => {
  const imgs = await loadImages(imageMarkerFiles);
  imgs.forEach((img, index) => {
    const key = `img:${imageMarkerFiles[index]}`;
    imageMarkerDB[key] = img;
  });
};

export const imageMarker = (style: ICurveStyle): HTMLImageElement => {
  if (imageMarkerDB.hasOwnProperty(style.markerType)) {
    return imageMarkerDB[style.markerType];
  }
  throw new Error(`cannot find image named ${style.markerType}`);
};
