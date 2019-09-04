import { ICurves, IPlotArgs, ICoords } from '../types';
import { numFmt } from '../helpers';
import { getMousePos, IListener } from '../dom';
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
    cvCanvas: string,
    stStatus: string,
    btnZoomIn: string,
    btnZoomOut: string,
    btnFocus: string,
    btnRescale: string,
    args: IPlotArgs,
    curves: ICurves,
  ) {
    // check
    if (!args) {
      throw new Error(`DrawMap: args = ${args} is invalid`);
    }
    if (!curves) {
      throw new Error(`DrawMap: curves = ${curves} is invalid`);
    }

    // canvas
    const eleCanvas = document.getElementById(cvCanvas) as HTMLCanvasElement;
    if (!eleCanvas) {
      throw new Error('cannot find canvas element');
    }
    this.canvas = eleCanvas;

    // status bar
    this.statusBar = new StatusBar(stStatus);

    // metrics and plotter
    this.args = args;
    const dc = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.metrics = new Metrics(dc, args, curves);
    this.plotter = new Plotter(dc, args, curves, this.metrics);
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
        const txr = numFmt(this.args.xTicksFormat, this.args.xTicksDecDigits, xreal);
        const tyr = numFmt(this.args.yTicksFormat, this.args.xTicksDecDigits, yreal);
        const txn = numFmt(this.args.xTicksFormat, this.args.xTicksDecDigits, xreal / 8);
        const tyn = numFmt(this.args.yTicksFormat, this.args.xTicksDecDigits, yreal / 8);
        const tworld = `WORLD ${this.args.xIs} = ${txr} : ${this.args.yIs} = ${tyr}`;
        const tnether = `NETHER ${this.args.xIs} = ${txn} : ${this.args.yIs} = ${tyn}`;
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
