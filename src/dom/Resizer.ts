import { IResizeFunction, IListener } from '../types';

export class Resizer {
  callbackFcn: IResizeFunction;
  widthMultiplier: number;
  heightMultiplier: number;
  listener?: IListener;
  parent?: HTMLDivElement | null;

  constructor(
    callbackFunction: IResizeFunction,
    widthMultiplier: number = 1,
    heightMultiplier: number = 1,
    parentDivIdOrElem: string | HTMLDivElement | null = null,
  ) {
    this.callbackFcn = callbackFunction;
    this.widthMultiplier = widthMultiplier;
    this.heightMultiplier = heightMultiplier;
    if (parentDivIdOrElem) {
      if (typeof parentDivIdOrElem === 'string') {
        this.parent = document.getElementById(parentDivIdOrElem) as HTMLDivElement;
      } else {
        this.parent = parentDivIdOrElem;
      }
    }
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
    if (this.parent) {
      console.log(this.parent.clientWidth, this.parent.clientHeight);
      this.callbackFcn({
        width: this.parent.clientWidth * this.widthMultiplier,
        height: this.parent.clientHeight * this.heightMultiplier,
      });
    } else {
      this.callbackFcn({
        width: document.documentElement.clientWidth * this.widthMultiplier,
        height: document.documentElement.clientHeight * this.heightMultiplier,
      });
    }
  }
}
