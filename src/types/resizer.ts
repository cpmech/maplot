export interface IResizeDims {
  width: number;
  height: number;
}

export type IResizeFunction = (dims: IResizeDims) => void;

export interface IListener {
  kind: string; // e.g. mousemove, click
  obj: EventListenerObject; // listener *object*
}
