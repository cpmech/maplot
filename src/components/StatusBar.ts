import { displayIsOff } from '../dom/showAndHide';
import { ICoordsToString } from '../types';

export class StatusBar {
  show: boolean;
  element: HTMLElement;
  coordsString?: ICoordsToString;

  constructor(divId: string, coordsString?: ICoordsToString) {
    this.show = !displayIsOff(divId);
    this.element = document.getElementById(divId) as HTMLElement;
    this.element.style.display = this.show ? 'block' : 'none';
    this.coordsString = coordsString;
  }

  set(message: string, x?: number, y?: number, xScreen?: number, yScreen?: number) {
    if (this.show) {
      this.element.innerHTML = message;
      if (x && y && this.coordsString) {
        this.element.innerHTML += this.coordsString(x, y, xScreen, yScreen);
      }
    }
  }
}
