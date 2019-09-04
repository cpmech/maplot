export type IResizeFunction = (width: number, height: number) => void;

export interface IListener {
  kind: string; // e.g. mousemove, click
  obj: EventListenerObject; // listener *object*
}

export const zeroResizeFunction: IResizeFunction = (width: number, height: number) => {
  /*do nothing*/
};

export const zeroListener: IListener = {
  kind: '',
  obj: {
    handleEvent: (event: Event): void => {
      /* do nothing */
    },
  },
};

export class Resizer {
  callbackFcn: IResizeFunction = zeroResizeFunction;
  listener: IListener = zeroListener;

  init(callbackFcn: IResizeFunction) {
    this.callbackFcn = callbackFcn;
    this.listener = {
      kind: 'resize',
      obj: { handleEvent: this.handleResize.bind(this) },
    };
    window.addEventListener(this.listener.kind, this.listener.obj);
    this.callbackFcn(window.innerWidth, window.innerHeight);
  }

  finish() {
    window.removeEventListener(this.listener.kind, this.listener.obj, false);
  }

  handleResize(event: Event) {
    if (this.callbackFcn) {
      this.callbackFcn(window.innerWidth, window.innerHeight);
    }
  }
}
