/**
 * Program Counter Mux Component
 * - Selects one of two 5-bit inputs
 */

class PCMux {
  constructor() {
    this._input0 = 0;
    this._input1 = 0;
    this._sel = 0;
    this._dataOut = 0;
    this._listeners = [];
    this._connections = [];
  }

  get input0() {
    return this._input0;
  }

  set input0(nextInput) {
    this.validateInput(nextInput);
    this._input0 = nextInput;
    this.updateOutput();
  }

  get input1() {
    return this._input1;
  }

  set input1(nextInput) {
    this.validateInput(nextInput);
    this._input1 = nextInput;
    this.updateOutput();
  }

  get sel() {
    return this._sel;
  }

  set sel(nextSel) {
    if (nextSel !== 0 && nextSel !== 1 && nextSel !== false && nextSel !== true) {
      throw new Error(`Invalid select signal: ${nextSel}. Select must be 0 or 1.`);
    }

    this._sel = Number(nextSel);
    this.updateOutput();
  }

  get dataOut() {
    return this._dataOut;
  }

  updateOutput() {
    this._dataOut = this._sel === 0 ? this._input0 : this._input1;

    for (const connection of this._connections) {
      connection.component[connection.pin] = this._dataOut;
    }

    for (const listener of this._listeners) {
      listener(this._dataOut);
    }

    console.log(`[PCMux] OUT: 0x${this._dataOut.toString(16).padStart(2, '0')}`);
    return this._dataOut;
  }

  connect(component, pin = 'address') {
    if (!component || typeof component !== 'object') {
      throw new Error('PCMux connection target must be an object.');
    }

    this._connections.push({ component, pin });
    component[pin] = this._dataOut;
  }

  onUpdate(listener) {
    if (typeof listener !== 'function') {
      throw new Error('PCMux listener must be a function.');
    }

    this._listeners.push(listener);
  }

  validateInput(input) {
    if (!Number.isInteger(input) || input < 0 || input > 0x1f) {
      throw new Error(`Invalid mux input: ${input}. Input must be a 5-bit value between 0 and 31.`);
    }
  }
}

export default PCMux;
