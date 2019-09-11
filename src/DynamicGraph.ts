import { ICurves, IPlotArgs, ICoords, IListener, IPadding } from './types';
import { StatusBar } from './components';
import { StaticGraph } from './StaticGraph';
import { getContext2d, getElement, getMousePos } from './dom';
import { numFmt } from './helpers';

const ZOOM_FACTOR = 1.1; // must be greater than 1.0

export class DynamicGraph {
  // essential
  args: IPlotArgs;
  canvas: HTMLCanvasElement;
  graph: StaticGraph;
  statusBar: StatusBar;

  // buttons
  btnZoomIn: HTMLElement;
  btnZoomOut: HTMLElement;
  btnFocus: HTMLElement;
  btnRescale: HTMLElement;

  // listeners
  canvasListeners: IListener[] = [];
  zoomInListeners: IListener[] = [];
  zoomOutListeners: IListener[] = [];
  focusListeners: IListener[] = [];
  rescaleListeners: IListener[] = [];

  // cursor coords
  coordsAtMouseDown: ICoords = { x: 0, y: 0 };
  translate: ICoords = { x: 0, y: 0 };
  offset: ICoords = { x: 0, y: 0 };
  dragging: boolean = false;

  constructor(
    args: IPlotArgs,
    curves: ICurves,
    canvasDivId: string,
    statusDivId: string,
    btnZoomInDivId: string,
    btnZoomOutDivId: string,
    btnFocusDivId: string,
    btnRescaleDivId: string,
    canvasWidthMultiplier: number = 1,
    canvasHeightMultiplier: number = 1,
    canvasPadding?: IPadding,
  ) {
    // essential
    const { canvas } = getContext2d(canvasDivId);
    this.args = args;
    this.canvas = canvas;
    this.graph = new StaticGraph(
      args,
      curves,
      canvasDivId,
      canvasWidthMultiplier,
      canvasHeightMultiplier,
      canvasPadding,
    );

    // buttons
    this.btnZoomIn = getElement(btnZoomInDivId);
    this.btnZoomOut = getElement(btnZoomOutDivId);
    this.btnFocus = getElement(btnFocusDivId);
    this.btnRescale = getElement(btnRescaleDivId);

    // status bar
    this.statusBar = new StatusBar(statusDivId);

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
  }

  async init() {
    await this.graph.init();
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
    this.graph.plotter.render();
  }

  scaleFromCurves() {
    this.graph.metrics.setScaleBasedOnCurves(this.canvas.width, this.canvas.height);
    this.render();
  }

  scaleFromStartValues() {
    this.graph.metrics.setScaleFromStartValues(this.canvas.width, this.canvas.height);
    this.render();
  }

  translateTo(x: number, y: number) {
    this.graph.metrics.translateTo(x, y);
    this.render();
  }

  resize() {
    this.graph.metrics.resize(this.canvas.width, this.canvas.height);
    this.render();
  }

  handleMouseMove(event: MouseEvent) {
    const { x, y } = getMousePos(this.canvas, event);
    if (this.statusBar.show) {
      const xreal = this.graph.metrics.xReal(x);
      const yreal = this.graph.metrics.yReal(y);
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
      if (this.graph.metrics) {
        const dxreal = this.graph.metrics.dxReal(this.translate.x);
        const dyreal = this.graph.metrics.dyReal(this.translate.y);
        this.graph.metrics.translateLimitsRelativeToCopy(dxreal, dyreal);
        this.render();
      }
    }
  }

  handleMouseDown(event: MouseEvent) {
    event.preventDefault();
    const { x, y } = getMousePos(this.canvas, event);
    this.coordsAtMouseDown.x = x;
    this.coordsAtMouseDown.y = y;
    this.offset.x = x - this.translate.x;
    this.offset.y = y - this.translate.y;
    this.dragging = true;
    this.canvas.style.cursor = 'all-scroll';
  }

  handleMouseUp(event: MouseEvent) {
    event.preventDefault();
    this.graph.metrics.copyLimits();
    this.translate.x = 0;
    this.translate.y = 0;
    this.dragging = false;
    this.canvas.style.cursor = 'crosshair';
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
    if (event.shiftKey) {
      const factor = event.deltaY > 0 ? ZOOM_FACTOR : 1.0 / ZOOM_FACTOR;
      if (this.graph.metrics.zoom(factor)) {
        event.preventDefault();
        this.render();
      }
    }
  }

  handleZoomIn() {
    if (this.graph.metrics.zoom(1.0 / ZOOM_FACTOR)) {
      this.render();
    }
  }

  handleZoomOut() {
    if (this.graph.metrics.zoom(ZOOM_FACTOR)) {
      this.render();
    }
  }

  handleFocus() {
    this.scaleFromCurves();
  }

  handleRescale() {
    this.scaleFromStartValues();
  }
}
