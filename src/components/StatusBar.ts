import { displayIsOff } from '../dom/showAndHide';

export class StatusBar {
  show: boolean;
  element: HTMLElement;

  constructor(divId: string) {
    this.show = !displayIsOff(divId);
    this.element = document.getElementById(divId) as HTMLElement;
    this.element.style.display = this.show ? 'block' : 'none';
    // window.addEventListener('mousemove', this.handleMouseMove.bind(this), false);
  }

  set(message: string) {
    if (this.show) {
      this.element.innerHTML = '&ensp;' + message + '&ensp;';
    }
  }
}
