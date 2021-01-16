import { StaticGraph } from '../StaticGraph';
import { IPlotArgs, defaultPlotArgs, ICurves, defaultCurveStyle } from '../types';

beforeEach(() => {
  document.body.innerHTML = `
    <div>
      <canvas id="myCanvas"></canvas>
    </div>`;
});

const args: IPlotArgs = {
  ...defaultPlotArgs,
  title: 'My Graph',
  markerImgPaths: ['images/blue-hrect.png', 'images/road-sign1.png'],
};

const curves: ICurves = {
  list: [
    {
      label: 'Curve 1',
      x: [0],
      y: [0],
      style: {
        ...defaultCurveStyle,
        markerType: 'img',
        markerImg: 'images/road-sign1.png',
      },
    },
    {
      label: 'Curve 2',
      x: [1],
      y: [1],
      style: {
        ...defaultCurveStyle,
        markerType: 'img',
        markerImg: 'images/blue-hrect.png',
      },
    },
  ],
};

describe('StaticGraph', () => {
  it('works', async () => {
    const g = new StaticGraph(
      args,
      curves,
      'myCanvasParent',
      'myCanvas',
      0.25,
      0.33);
  });
});
