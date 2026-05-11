/**
 * 16-Bit Register Component
 * - decodes 16-bit instruction from program memory
 * - uses inverted clock to capture instruction on falling clock edge
 * - outputs parsed instruction fields (Control-[Op][Func3], Rs1En, Rs2En, RdEn, Imm, Imm[4:0])
 */

import Register16 from '../modules/register-16.js';

class IF_ID extends Register16 {
  constructor() {
    super();
    this._fieldConnections = [];
  }

  get imm() {
    return (this.q >> 8) & 0xff;
  }

  get imm5() {
    return (this.q >> 8) & 0x1f;
  }

  get rs1En() {
    return Boolean((this.q >> 7) & 0x01);
  }

  get rs2En() {
    return Boolean((this.q >> 6) & 0x01);
  }

  get rdEn() {
    return Boolean((this.q >> 5) & 0x01);
  }

  get control() {
    return this.q & 0x1f;
  }

  set clk(nextClk) {
    const isFallingEdge = this._clk && !nextClk;

    if (isFallingEdge && this.we) {
      this.validateData(this.d);
      this.value = this.d;
      this.q = this.value;
      this.updateFieldOutputs();
      console.log(`[IF_ID] WRITE: 0x${this.value.toString(16).padStart(4, '0')}`);
    }

    this._clk = nextClk;
  }

  connectField(field, component, pin = field) {
    if (!component || typeof component !== 'object') {
      throw new Error('IF_ID connection target must be an object.');
    }

    if (!(field in this)) {
      throw new Error(`Invalid IF_ID field: ${field}.`);
    }

    this._fieldConnections.push({ field, component, pin });
    component[pin] = this[field];
  }

  updateFieldOutputs() {
    for (const connection of this._fieldConnections) {
      connection.component[connection.pin] = this[connection.field];
    }
  }
}

export default IF_ID;
