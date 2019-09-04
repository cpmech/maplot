import { IPlotArgs, ICurves, defaultPlotArgs, defaultCurveStyle } from '../../types';
import { Metrics } from '../Metrics';
import { Plotter } from '../Plotter';

let canvas: HTMLCanvasElement;
let dc: CanvasRenderingContext2D;

beforeAll(() => {
  canvas = document.createElement('canvas');
  const theDC = canvas.getContext('2d');
  if (theDC) {
    dc = theDC;
    return;
  }
  fail('internal error');
});

const args: IPlotArgs = { ...defaultPlotArgs };

const curves: ICurves = {
  list: [
    {
      label: 'First Curve',
      kind: 'Group A',
      x: [0.0, 0.0, 0.5, 1.0, 1.0, 0.0, 1.0, 0.3, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
      y: [0.0, 1.0, 1.0, 0.7, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.8, 0.6, 0.4, 0.4],
      z: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.2, 0.5, 0.8, 1.0, 1.0, 0.5, 0.0, 0.0, 0.5, 1.0],
      style: { ...defaultCurveStyle },
      tagFirstPoint: false,
    },
  ],
};

describe('Plotter', () => {
  it('constructor works', () => {
    const metrics = new Metrics(dc, args, curves);
    const plt = new Plotter(dc, args, curves, metrics);
    expect(plt.curves.list.length).toBe(1);
  });

  it('default render works', () => {
    const metrics = new Metrics(dc, args, curves);
    const plt = new Plotter(dc, args, curves, metrics);
    plt.render();
    expect(dc).toMatchSnapshot();
  });
});
