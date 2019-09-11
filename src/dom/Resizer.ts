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
    this.doResize();
  }

  stop() {
    if (this.listener) {
      window.removeEventListener(this.listener.kind, this.listener.obj, false);
    }
  }

  handleResize(event: Event) {
    this.doResize();
  }

  private doResize() {
    this.callbackFcn({
      width: document.documentElement.clientWidth * this.widthMultiplier,
      height: document.documentElement.clientHeight * this.heightMultiplier,
    });
  }
}
