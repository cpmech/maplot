const plt = require('../dist/cjs/index');

const canvas = document.getElementById('myCanvas');
if (!canvas) {
  throw new Error('Cannoot get "myCanvas"');
}

const dc = canvas.getContext('2d');

const args = {
  ...plt.defaultPlotArgs,
  // legendOn: true,
};

const curves = {
  list: [
    {
      label: 'First Curve',
      kind: 'Group A',
      x: [0.0, 0.0, 0.5, 1.0, 1.0, 0.0, 1.0, 0.3, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
      y: [0.0, 1.0, 1.0, 0.7, 0.3, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.8, 0.6, 0.4, 0.4],
      z: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.2, 0.5, 0.8, 1.0, 1.0, 0.5, 0.0, 0.0, 0.5, 1.0],
      style: {
        ...plt.defaultCurveStyle,
        lineColor: '#ff0000',
        lineStyle: '-',
        markerType: 'o',
        markerColor: '#00ff00',
      },
      tagFirstPoint: false,
    },
  ],
};

const metrics = new plt.Metrics(dc, args, curves);

metrics.resize(canvas.width, canvas.height);

const plotter = new plt.Plotter(dc, args, curves, metrics);

plotter.render();
