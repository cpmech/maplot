import { DynamicGraph } from '../DynamicGraph';
import { IPlotArgs, defaultPlotArgs, ICurves, defaultCurveStyle } from '../types';

beforeEach(() => {
  document.body.innerHTML = `
    <div>
      <canvas id="myCanvas"></canvas>
      <div id="myStatus"></div>
      <button id="zoomIn"></button>
      <button id="zoomOut"></button>
      <button id="focus"></button>
      <button id="rescale"></button>
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

describe('DynamicGraph', () => {
  it('works', () => {
    const g = new DynamicGraph(
      args,
      curves,
      'myCanvas',
      'myStatus',
      'zoomIn',
      'zoomOut',
      'focus',
      'rescale',
    );
  });
});
