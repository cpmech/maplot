import { IPalettes } from '../types';

export const palettes: IPalettes = {
  standard: ['blue', 'green', 'magenta', 'orange', 'red', 'cyan', 'black'],
  combo1: [
    '#de9700',
    '#89009d',
    '#7ad473',
    '#737ad4',
    '#d473ce',
    '#7e6322',
    '#462222',
    '#98ac9d',
    '#37a3e8',
  ],
  light1: ['#003fff', '#35b052', '#e8000b', '#8a2be2', '#ffc400', '#00d7ff'],
  light2: ['#4c72b0', '#55a868', '#c44e52', '#8172b2', '#ccb974', '#64b5cd'],
  light3: ['#9b59b6', '#3498db', '#95a5a6', '#e74c3c', '#34495e', '#2ecc71'],
  medium1: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33'],
  medium2: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17'],
  medium3: ['#001c7f', '#017517', '#8c0900', '#7600a1', '#b8860b', '#006374'],
  dark1: ['#0072b2', '#009e73', '#d55e00', '#cc79a7', '#f0e442', '#56b4e9'],
  dark2: ['#4878cf', '#6acc65', '#d65f5f', '#b47cc7', '#c4ad66', '#77bedb'],
  dark3: ['#92c6ff', '#97f0aa', '#ff9f9a', '#d0bbff', '#fffea3', '#b0e0e6'],
};

export let defaultPalette = 'standard';

// get returns a color
export const getColor = (index: number, palette: string = 'standard'): string => {
  if (palette === '') {
    palette = defaultPalette;
  }
  const colors = palettes[palette];
  return colors[index % colors.length];
};

export const twelveColors = [
  'rgb(0,75,185)',
  'rgb(85,10,85)',
  'rgb(85,80,0)',
  'rgb(65,85,85)',
  'rgb(0,170,150)',
  'rgb(17,0,170)',
  'rgb(170,250,0)',
  'rgb(170,70,170)',
  'rgb(0,123,255)',
  'rgb(255,0,255)',
  'rgb(255,255,0)',
  'rgb(255,100,255)',
];
