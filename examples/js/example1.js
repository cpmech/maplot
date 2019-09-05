import { Resizer } from '../../dist/index-esm';
import { xyRender } from './xyRender';
import { yzRender } from './yzRender';
import { zxRender } from './zxRender';

function resizeCanvas() {
  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;
  const cc = ['xyCanvas', 'yzCanvas', 'zxCanvas'];
  cc.forEach(c => {
    const canvas = document.getElementById(c);
    if (canvas) {
      canvas.width = width / 2;
      canvas.height = height / 2;
    }
  });
  xyRender();
  yzRender();
  zxRender();
}

const resizer = new Resizer();

resizer.init(resizeCanvas);

resizeCanvas();
