export interface IResizeDims {
  windowWidth: number;
  windowHeight: number;
  clientWidth: number;
  clientHeight: number;
}

export type IResizeFunction = (dims: IResizeDims) => void;

export interface IListener {
  kind: string; // e.g. mousemove, click
  obj: EventListenerObject; // listener *object*
}
