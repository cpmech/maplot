import { displayIsOff } from '../dom/showAndHide';
import { prettyNum } from '../helpers';

export default class CursorStatus {
  show: boolean;
  element: HTMLElement;
  gapX: number = 5;
  gapY: number = 25;
  flipH: boolean = false;
  flipV: boolean = false;
  constructor() {
    this.show = !displayIsOff('cursorStatus');
    this.element = document.getElementById('cursorStatus') as HTMLElement;
    this.element.style.display = this.show ? 'block' : 'none';
    window.addEventListener('mousemove', this.handleMouseMove.bind(this), false);
  }

  enable(show: boolean = true) {
    this.show = show;
    this.element.style.display = this.show ? 'block' : 'none';
  }

  toggle() {
    this.enable(!this.show);
  }

  handleMouseMove(event: MouseEvent) {
    if (this.show) {
      let x = event.clientX + this.gapX;
      let y = event.clientY - this.gapY;
      if (this.flipH && this.flipV) {
        const w = this.element.clientWidth;
        x = event.clientX - this.gapX - w;
        y = event.clientY + this.gapY / 2;
      } else if (this.flipH) {
        const w = this.element.clientWidth;
        x = event.clientX - this.gapX - w;
        y = event.clientY - this.gapY;
      } else if (this.flipV) {
        y = event.clientY + this.gapY / 2;
      }
      this.element.style.left = `${x}px`;
      this.element.style.top = `${y}px`;
    }
  }

  set(message: string) {
    if (this.show) {
      this.element.innerHTML = '&ensp;' + message + '&ensp;';
    }
  }

  append(message: string) {
    this.element.innerHTML += '&ensp;' + message + '&ensp;';
  }

  appendVec2(name: string, vx: number, vy: number, digits = 3) {
    this.append(name + ' = ' + prettyNum(vx, digits) + ', ' + prettyNum(vy, digits));
  }

  clear() {
    if (this.show) {
      this.element.innerHTML = '';
    }
  }
}
