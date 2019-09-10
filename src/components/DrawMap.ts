import { ICurves, IPlotArgs, ICoords, IListener } from '../types';
import { numFmt } from '../helpers';
import { getMousePos, getContext2d } from '../dom';
import { Markers } from './Markers';
import { Legend } from './Legend';
import { Metrics } from './Metrics';
import { Plotter } from './Plotter';
import { StatusBar } from './StatusBar';

export class DrawMap {
  // constants
  zoomFactor: number = 1.1; // must be greater than 1.0

  // canvas
  canvas: HTMLCanvasElement | null = null;

  // status bar
  statusBar: StatusBar | null = null;

  // metrics and plotter
  args: IPlotArgs | null = null;
  markers: Markers | null = null;
  legend: Legend | null = null;
  metrics: Metrics | null = null;
  plotter: Plotter | null = null;

  // cursor coords
  coordsAtMouseDown: ICoords = { x: 0, y: 0 };
  translate: ICoords = { x: 0, y: 0 };
  offset: ICoords = { x: 0, y: 0 };
  dragging: boolean = false;

  // buttons
  btnZoomIn: HTMLElement | null = null;
  btnZoomOut: HTMLElement | null = null;
  btnFocus: HTMLElement | null = null;
  btnRescale: HTMLElement | null = null;

  // listeners
  canvasListeners: IListener[] = [];
  zoomInListeners: IListener[] = [];
  zoomOutListeners: IListener[] = [];
  focusListeners: IListener[] = [];
  rescaleListeners: IListener[] = [];

  init(
    canvasDivId: string,
    stStatus: string,
    btnZoomIn: string,
    btnZoomOut: string,
    btnFocus: string,
    btnRescale: string,
    args: IPlotArgs,
    curves: ICurves,
  ) {
    // canvas and DC
    const { canvas, dc } = getContext2d(canvasDivId);
    this.canvas = canvas;

    // status bar
    this.statusBar = new StatusBar(stStatus);

    // args, markers and legend
    this.args = args;
    this.markers = new Markers(dc, args);
    this.legend = new Legend(dc, args, curves, this.markers);

    // metrics and plotter
    this.metrics = new Metrics(dc, args, curves, this.markers, this.legend);
    this.plotter = new Plotter(dc, args, curves, this.markers, this.metrics, this.legend);

    // TODO: remove next line
    this.metrics.resize(this.canvas.width, this.canvas.height);

    // buttons
    this.btnZoomIn = document.getElementById(btnZoomIn) as HTMLElement;
    this.btnZoomOut = document.getElementById(btnZoomOut) as HTMLElement;
    this.btnFocus = document.getElementById(btnFocus) as HTMLElement;
    this.btnRescale = document.getElementById(btnRescale) as HTMLElement;

    // add canvas listeners
    this.canvasListeners = [
      {
        kind: 'mousemove',
        obj: { handleEvent: this.handleMouseMove.bind(this) },
      },
      {
        kind: 'mousedown',
        obj: { handleEvent: this.handleMouseDown.bind(this) },
      },
      {
        kind: 'mouseup',
        obj: { handleEvent: this.handleMouseUp.bind(this) },
      },
      {
        kind: 'mouseover',
        obj: { handleEvent: this.handleMouseOver.bind(this) },
      },
      {
        kind: 'mouseout',
        obj: { handleEvent: this.handleMouseOut.bind(this) },
      },
      {
        kind: 'click',
        obj: { handleEvent: this.handleMouseClick.bind(this) },
      },
      {
        kind: 'wheel',
        obj: { handleEvent: this.handleMouseWheel.bind(this) },
      },
    ];
    this.canvasListeners.forEach(
      l => this.canvas && this.canvas.addEventListener(l.kind, l.obj, false),
    );

    // add button listeners
    this.zoomInListeners = [
      {
        kind: 'click',
        obj: { handleEvent: this.handleZoomIn.bind(this) },
      },
    ];
    this.zoomInListeners.forEach(
      l => this.btnZoomIn && this.btnZoomIn.addEventListener(l.kind, l.obj, false),
    );

    this.zoomOutListeners = [
      {
        kind: 'click',
        obj: { handleEvent: this.handleZoomOut.bind(this) },
      },
    ];
    this.zoomOutListeners.forEach(
      l => this.btnZoomOut && this.btnZoomOut.addEventListener(l.kind, l.obj, false),
    );

    this.focusListeners = [
      {
        kind: 'click',
        obj: { handleEvent: this.handleFocus.bind(this) },
      },
    ];
    this.focusListeners.forEach(
      l => this.btnFocus && this.btnFocus.addEventListener(l.kind, l.obj, false),
    );

    this.rescaleListeners = [
      {
        kind: 'click',
        obj: { handleEvent: this.handleRescale.bind(this) },
      },
    ];
    this.rescaleListeners.forEach(
      l => this.btnRescale && this.btnRescale.addEventListener(l.kind, l.obj, false),
    );

    // render
    this.render();
  }

  finish() {
    // remove canvas listeners
    this.canvasListeners.forEach(
      l => this.canvas && this.canvas.removeEventListener(l.kind, l.obj, false),
    );

    // remove button listeners
    this.zoomInListeners.forEach(
      l => this.btnZoomIn && this.btnZoomIn.removeEventListener(l.kind, l.obj, false),
    );

    this.zoomOutListeners.forEach(
      l => this.btnZoomOut && this.btnZoomOut.removeEventListener(l.kind, l.obj, false),
    );

    this.focusListeners.forEach(
      l => this.btnFocus && this.btnFocus.removeEventListener(l.kind, l.obj, false),
    );

    this.rescaleListeners.forEach(
      l => this.btnRescale && this.btnRescale.removeEventListener(l.kind, l.obj, false),
    );
  }

  render() {
    if (this.canvas && this.plotter) {
      const dc = this.canvas.getContext('2d') as CanvasRenderingContext2D;
      dc.save();
      this.plotter.render();
      dc.restore();
    }
  }

  scaleFromCurves() {
    if (this.canvas && this.metrics) {
      this.metrics.setScaleBasedOnCurves(this.canvas.width, this.canvas.height);
      this.render();
    }
  }

  scaleFromStartValues() {
    if (this.canvas && this.metrics) {
      this.metrics.setScaleFromStartValues(this.canvas.width, this.canvas.height);
      this.render();
    }
  }

  translateTo(x: number, y: number) {
    if (this.metrics) {
      this.metrics.translateTo(x, y);
      this.render();
    }
  }

  resize() {
    if (this.canvas && this.metrics) {
      this.metrics.resize(this.canvas.width, this.canvas.height);
      this.render();
    }
  }

  handleMouseMove(event: MouseEvent) {
    if (this.canvas) {
      const { x, y } = getMousePos(this.canvas, event);
      if (this.statusBar && this.statusBar.show && this.args && this.metrics) {
        const xreal = this.metrics.xReal(x);
        const yreal = this.metrics.yReal(y);
        const txr = numFmt(xreal, this.args.x.t.decDigits);
        const tyr = numFmt(yreal, this.args.x.t.decDigits);
        const txn = numFmt(xreal / 8, this.args.x.t.decDigits);
        const tyn = numFmt(yreal / 8, this.args.x.t.decDigits);
        const tworld = `WORLD ${this.args.x.coordName} = ${txr} : ${this.args.y.coordName} = ${tyr}`;
        const tnether = `NETHER ${this.args.x.coordName} = ${txn} : ${this.args.y.coordName} = ${tyn}`;
        this.statusBar.set(`${tworld} | ${tnether}`);
      }
      if (this.dragging) {
        event.preventDefault();
        event.stopPropagation();
        this.translate.x = x - this.offset.x;
        this.translate.y = y - this.offset.y;
        if (this.metrics) {
          const dxreal = this.metrics.dxReal(this.translate.x);
          const dyreal = this.metrics.dyReal(this.translate.y);
          this.metrics.translateLimitsRelativeToCopy(dxreal, dyreal);
          this.render();
        }
      }
    }
  }

  handleMouseDown(event: MouseEvent) {
    if (this.canvas) {
      event.preventDefault();
      const { x, y } = getMousePos(this.canvas, event);
      this.coordsAtMouseDown.x = x;
      this.coordsAtMouseDown.y = y;
      this.offset.x = x - this.translate.x;
      this.offset.y = y - this.translate.y;
      this.dragging = true;
      this.canvas.style.cursor = 'all-scroll';
    }
  }

  handleMouseUp(event: MouseEvent) {
    if (this.canvas && this.metrics) {
      event.preventDefault();
      this.metrics.copyLimits();
      this.translate.x = 0;
      this.translate.y = 0;
      this.dragging = false;
      this.canvas.style.cursor = 'crosshair';
    }
  }

  handleMouseOver(event: MouseEvent) {
    event.preventDefault();
    this.dragging = false;
  }

  handleMouseOut(event: MouseEvent) {
    event.preventDefault();
    this.dragging = false;
  }

  handleMouseClick(event: MouseEvent) {
    console.log('mouse clicked');
  }

  handleMouseWheel(event: WheelEvent) {
    if (event.shiftKey && this.metrics) {
      const factor = event.deltaY > 0 ? this.zoomFactor : 1.0 / this.zoomFactor;
      if (this.metrics.zoom(factor)) {
        event.preventDefault();
        this.render();
      }
    }
  }

  handleZoomIn() {
    if (this.metrics) {
      if (this.metrics.zoom(1.0 / this.zoomFactor)) {
        this.render();
      }
    }
  }

  handleZoomOut() {
    if (this.metrics) {
      if (this.metrics.zoom(this.zoomFactor)) {
        this.render();
      }
    }
  }

  handleFocus() {
    if (this.metrics) {
      this.scaleFromCurves();
    }
  }

  handleRescale() {
    if (this.metrics) {
      this.scaleFromStartValues();
    }
  }
}
