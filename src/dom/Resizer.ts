import { IResizeFunction, IListener } from '../types';

export class Resizer {
  callbackFcn: IResizeFunction;
  widthMultiplier: number;
  heightMultiplier: number;
  listener?: IListener;

  constructor(
    callbackFunction: IResizeFunction,
    widthMultiplier: number = 1,
    heightMultiplier: number = 1,
  ) {
    this.callbackFcn = callbackFunction;
    this.widthMultiplier = widthMultiplier;
    this.heightMultiplier = heightMultiplier;
  }

  start() {
    this.listener = {
      kind: 'resize',
      obj: { handleEvent: this.handleResize.bind(this) },
    };
    window.addEventListener(this.listener.kind, this.listener.obj);
    this.callbackFcn({
      windowWidth: window.innerWidth * this.widthMultiplier,
      windowHeight: window.innerHeight * this.heightMultiplier,
      clientWidth: document.documentElement.clientWidth * this.widthMultiplier,
      clientHeight: document.documentElement.clientHeight * this.heightMultiplier,
    });
  }

  stop() {
    if (this.listener) {
      window.removeEventListener(this.listener.kind, this.listener.obj, false);
    }
  }

  handleResize(event: Event) {
    this.callbackFcn({
      windowWidth: window.innerWidth * this.widthMultiplier,
      windowHeight: window.innerHeight * this.heightMultiplier,
      clientWidth: document.documentElement.clientWidth * this.widthMultiplier,
      clientHeight: document.documentElement.clientHeight * this.heightMultiplier,
    });
  }
}
