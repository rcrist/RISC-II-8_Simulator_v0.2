/**
 * 8-Bit ALU Component
 * - Performs math/logic operations selected by the 5-bit [op][funct3] control
 */

class ALU {
  constructor() {
    this._a = 0;
    this._b = 0;
    this._sel = 0;
    this._dataOut = 0;
    this._listeners = [];
    this._connections = [];
  }

  get a() {
    return this._a;
  }

  set a(nextA) {
    this.validateByte(nextA, 'A');
    this._a = nextA;
    this.updateOutput();
  }

  get b() {
    return this._b;
  }

  set b(nextB) {
    this.validateByte(nextB, 'B');
    this._b = nextB;
    this.updateOutput();
  }

  get sel() {
    return this._sel;
  }

  set sel(nextSel) {
    this.validateSelect(nextSel);
    this._sel = nextSel;
    this.updateOutput();
  }

  get dataOut() {
    return this._dataOut;
  }

  updateOutput() {
    this._dataOut = this.execute(this._sel);

    for (const connection of this._connections) {
      connection.component[connection.pin] = this._dataOut;
    }

    for (const listener of this._listeners) {
      listener(this._dataOut);
    }

    // console.log(`[ALU] ${this.operationName(this._sel)}: 0x${this._a.toString(16).padStart(2, '0')}, 0x${this._b.toString(16).padStart(2, '0')} -> 0x${this._dataOut.toString(16).padStart(2, '0')}`);
    return this._dataOut;
  }

  execute(sel) {
    switch (sel) {
      case 0:
      case 10:
        return (this._a + this._b) & 0xff;
      case 1:
      case 11:
        return (this._a - this._b) & 0xff;
      case 2:
      case 12:
        return this._a & this._b;
      case 3:
      case 13:
        return this._a | this._b;
      case 4:
      case 14:
        return (~this._a) & 0xff;
      case 5:
      case 15:
        return (this._a << (this._b & 0x07)) & 0xff;
      case 6:
      case 16:
        return (this._a >>> (this._b & 0x07)) & 0xff;
      default:
        throw new Error(`Unsupported ALU selector: ${sel}.`);
    }
  }

  operationName(sel) {
    const names = {
      0: 'ADD',
      1: 'SUB',
      2: 'AND',
      3: 'OR',
      4: 'NOT',
      5: 'SLL',
      6: 'SRL',
      10: 'ADDI',
      11: 'SUBI',
      12: 'ANDI',
      13: 'ORI',
      14: 'NOTI',
      15: 'SLLI',
      16: 'SRLI',
    };

    return names[sel] ?? 'UNKNOWN';
  }

  connect(component, pin = 'dataIn') {
    if (!component || typeof component !== 'object') {
      throw new Error('ALU connection target must be an object.');
    }

    this._connections.push({ component, pin });
    component[pin] = this._dataOut;
  }

  onUpdate(listener) {
    if (typeof listener !== 'function') {
      throw new Error('ALU listener must be a function.');
    }

    this._listeners.push(listener);
  }

  validateByte(value, label) {
    if (!Number.isInteger(value) || value < 0 || value > 0xff) {
      throw new Error(`Invalid ALU ${label} input: ${value}. Input must be an 8-bit value between 0 and 255.`);
    }
  }

  validateSelect(sel) {
    if (!Number.isInteger(sel) || sel < 0 || sel > 0x1f) {
      throw new Error(`Invalid ALU selector: ${sel}. Selector must be a 5-bit value between 0 and 31.`);
    }
  }
}

export default ALU;
