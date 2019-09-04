import { inputClearValue } from '../inputElements';

let nameField: HTMLInputElement;

beforeEach(() => {
  document.body.innerHTML = `
    <form action="#">
      Name: <input type="text" id="nameField" name="name" value="Name"><br>
      Email: <input type="text" id="emailField" name="email" value="email@here.com"><br>
      <input type="submit" value="Submit">
    </form>`;

  const name = document.getElementById('nameField');
  const email = document.getElementById('emailField');
  if (name && email) {
    nameField = name as HTMLInputElement;
  } else {
    fail('internal error');
  }
});

describe('inputClearValue', () => {
  it('throws due to missing element', () => {
    expect(() => inputClearValue('__inexistent__')).toThrowError(
      'cannot find element "__inexistent__"',
    );
  });

  it('works', () => {
    inputClearValue('nameField');
    expect(nameField.value).toBe('');
  });
});
