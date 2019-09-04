export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`cannot load image named ${src}`));
    img.src = src;
  });
};

export const loadImages = async (srcs: string[]): Promise<HTMLImageElement[]> => {
  const fcns = srcs.map(async src => {
    const img = await loadImage(src);
    return img;
  });
  const results = await Promise.all(fcns);
  return results;
};
