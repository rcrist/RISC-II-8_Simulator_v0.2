/**
 * 4-to-1 Mux Component
 * - Selects one of four inputs
 * - Uses a 2-bit select signal (0-3)
 */

class Mux4 {
  constructor(bitWidth = 8) {
    this.validateBitWidth(bitWidth);

    this.bitWidth = bitWidth;
    this.maxValue = (2 ** bitWidth) - 1;
    this._input0 = 0;
    this._input1 = 0;
    this._input2 = 0;
    this._input3 = 0;
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

  get input2() {
    return this._input2;
  }

  set input2(nextInput) {
    this.validateInput(nextInput);
    this._input2 = nextInput;
    this.updateOutput();
  }

  get input3() {
    return this._input3;
  }

  set input3(nextInput) {
    this.validateInput(nextInput);
    this._input3 = nextInput;
    this.updateOutput();
  }

  get sel() {
    return this._sel;
  }

  set sel(nextSel) {
    this.validateSelect(nextSel);
    this._sel = Number(nextSel);
    this.updateOutput();
  }

  get dataOut() {
    return this._dataOut;
  }

  updateOutput() {
    const inputs = [this._input0, this._input1, this._input2, this._input3];
    this._dataOut = inputs[this._sel];

    for (const connection of this._connections) {
      connection.component[connection.pin] = this._dataOut;
    }

    for (const listener of this._listeners) {
      listener(this._dataOut);
    }

    console.log(`[Mux4] OUT: 0x${this._dataOut.toString(16).padStart(Math.ceil(this.bitWidth / 4), '0')}`);
    return this._dataOut;
  }

  connect(component, pin = 'dataIn') {
    if (!component || typeof component !== 'object') {
      throw new Error('Mux4 connection target must be an object.');
    }

    this._connections.push({ component, pin });
    component[pin] = this._dataOut;
  }

  onUpdate(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Mux4 listener must be a function.');
    }

    this._listeners.push(listener);
  }

  validateBitWidth(bitWidth) {
    if (!Number.isInteger(bitWidth) || bitWidth < 1 || bitWidth > 32) {
      throw new Error(`Invalid bit width: ${bitWidth}. Bit width must be between 1 and 32.`);
    }
  }

  validateInput(input) {
    if (!Number.isInteger(input) || input < 0 || input > this.maxValue) {
      throw new Error(`Invalid mux input: ${input}. Input must be a ${this.bitWidth}-bit value between 0 and ${this.maxValue}.`);
    }
  }

  validateSelect(sel) {
    if (sel !== false && sel !== true && (!Number.isInteger(sel) || sel < 0 || sel > 3)) {
      throw new Error(`Invalid select signal: ${sel}. Select must be a 2-bit value between 0 and 3.`);
    }
  }
}

export default Mux4;
