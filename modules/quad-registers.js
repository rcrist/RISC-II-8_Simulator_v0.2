/**
 * Quad 8-Bit Registers Component
 * - 4 registers with 8-bit data width (0-255)
 * - Requires the non-inverted clock to capture data on the rising edge
 * - Reg0 stores a constant value of 0x00
 * - Reg1 = Rs1, Reg2 = Rs2, Reg3 = Rd
 */

import Register8 from './register-8.js';

class QuadRegisters {
  constructor() {
    this.reg0 = new Register8();  // Rs0 - always 0x00
    this.reg1 = new Register8();  // Rs1
    this.reg2 = new Register8();  // Rs2
    this.reg3 = new Register8();  // Rd

    this._clk = false;
    this.d0 = 0x00;
    this.d1 = 0x00;
    this.d2 = 0x00;
    this.d3 = 0x00;
    this.we0 = false;
    this.we1 = true;
    this.we2 = true;
    this.we3 = true;
    this.q0 = 0x00;
    this.q1 = 0x00;
    this.q2 = 0x00;
    this.q3 = 0x00;
    this._outputConnections = [];

    this.updateOutputs();
  }

  get clk() {
    return this._clk;
  }

  set clk(nextClk) {
    const isLeadingEdge = !this._clk && nextClk;

    if (isLeadingEdge) {
      this.writeRegisters();
      this.updateOutputs();
    }

    this._clk = nextClk;
  }

  writeRegisters() {
    console.log(`[QuadRegisters] WE: rs1=${this.we1} rs2=${this.we2} rd=${this.we3}`);
    this.writeRegister(this.reg0, 0x00, false);
    this.writeRegister(this.reg1, this.d1, this.we1);
    this.writeRegister(this.reg2, this.d2, this.we2);
    this.writeRegister(this.reg3, this.d3, this.we3);
  }

  writeRegister(register, data, writeEnable) {
    register.we = writeEnable;
    register.d = data;
    register.clk = false;
    register.clk = true;
  }

  updateOutputs() {
    this.q0 = 0x00;
    this.q1 = this.reg1.q;
    this.q2 = this.reg2.q;
    this.q3 = this.reg3.q;

    for (const connection of this._outputConnections) {
      connection.component[connection.pin] = this[connection.field];
    }
  }

  connectOutput(field, component, pin = field) {
    if (!component || typeof component !== 'object') {
      throw new Error('QuadRegisters connection target must be an object.');
    }

    if (!(field in this)) {
      throw new Error(`Invalid QuadRegisters output field: ${field}.`);
    }

    this._outputConnections.push({ field, component, pin });
    component[pin] = this[field];
  }
}

export default QuadRegisters;
