import { hideElement, hideElementIfClicked, showElement } from '../showAndHide';

let okButton: HTMLElement;
let resetButton: HTMLElement;

beforeEach(() => {
  document.body.innerHTML = `
    <div>
      <button id="okButton" />
      <button id="resetButton" />
    </div>`;
  const ok = document.getElementById('okButton');
  const reset = document.getElementById('resetButton');
  if (ok && reset) {
    okButton = ok;
    resetButton = reset;
  } else {
    fail('internal error');
  }
});

describe('hideElement', () => {
  it('throws due to missing element', () => {
    expect(() => hideElement('__inexistent__')).toThrowError(
      'cannot find element "__inexistent__"',
    );
  });

  it('works', () => {
    hideElement('okButton');
    expect(okButton.style.display).toBe('none');
  });
});

describe('hideElementIfClicked', () => {
  it('throws due to missing element', () => {
    expect(() => hideElementIfClicked('__inexistent__', resetButton)).toThrowError(
      'cannot find element "__inexistent__"',
    );
  });

  it('style changes ', () => {
    hideElementIfClicked('okButton', okButton);
    expect(okButton.style.display).toBe('none');
  });

  it('style does not change ', () => {
    hideElementIfClicked('okButton', resetButton);
    expect(okButton.style.display).toBe('');
  });
});

describe('showElement', () => {
  it('throws due to missing element', () => {
    expect(() => showElement('__inexistent__')).toThrowError(
      'cannot find element "__inexistent__"',
    );
  });

  it('works', () => {
    showElement('okButton');
    expect(okButton.style.display).toBe('block');
  });
});
