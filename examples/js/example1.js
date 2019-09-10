import { Resizer } from '../../dist/esm/index-all-in-one';
import { xyInit, xyResizeAndRender } from './xyRender';
import { yzInit, yzResizeAndRender } from './yzRender';
import { zxInit, zxResizeAndRender } from './zxRender';

const resizer = new Resizer();

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
  xyResizeAndRender();
  yzResizeAndRender();
  zxResizeAndRender();
}

(async () => {
  await xyInit();
  await yzInit();
  await zxInit();
  resizer.init(resizeCanvas);
})();
