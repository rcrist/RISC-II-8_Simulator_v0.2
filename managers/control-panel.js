/**
 * Control Panel
 * - Monitors the CPU data and control signals 
 */

class ControlPanel {
  constructor() {
    // Fetch state variables for monitoring
    this._clk = false; // Clock signal
    this._pc = 0; // Program Counter
    this._pmAddr = 0; // PM Address
    this._inst = 0; // Current instruction

    // IF/ID state variables for monitoring
    this._control = 0;
    this._rs1En = false;
    this._rs2En = false;
    this._rdEn = false;
    this._imm = 0;
    this._imm4 = 0; // 4-bit immediate value for pc jump/branch instructions

    // Control Unit state variables for monitoring
    this._pcSel = 0;
    this._addrSel = 0;
    this._wbSel = 0;
    this._memRead = false;
    this._memWrite = false;
    this._halt = false;

    // Quad Registers state variables for monitoring
    this._rs1 = 0;
    this._rs2 = 0;
    this._rd = 0;

    // ALU state variables for monitoring
    this._aluResult = 0;

    // Address Mux variables for monitoring
    this._addressMuxOutput = 0;

    // RAM variables for monitoring
    this._ramDataOut = 0;

    // WB Mux variables for monitoring
    this._wbMuxOutput = 0;
  }

  set clk(value) {
    this._clk = value;
  }

  set pc(value) {
    this._pc = value;
    // process.stdout.write('\n');
    // process.stdout.write(` PC: 0x${this._pc.toString(16).padStart(2, '0')}`);
  }

  set pmAddr(value) {
    this._pmAddr = value;
    // process.stdout.write(` PM Address: 0x${this._pmAddr.toString(16).padStart(2, '0')}`);
  }

  set inst(value) {
    this._inst = value;
    // process.stdout.write(` Instruction: 0x${this._inst.toString(16).padStart(2, '0')}`);
    // process.stdout.write('\n');
  }

  set control(value) {
    this._control = value;
    // process.stdout.write(` Control: 0b${this._control.toString(2).padStart(5, '0')}`);
  }

  set rs1En(value) {
    this._rs1En = value;
    // process.stdout.write(` rs1En: ${this._rs1En}`);
  }

  set rs2En(value) {
    this._rs2En = value;
    // process.stdout.write(` rs2En: ${this._rs2En}`);
  }

  set rdEn(value) {
    this._rdEn = value;
    // process.stdout.write(` rdEn: ${this._rdEn}`);
  }

  set imm(value) {
    this._imm = value;
    // process.stdout.write(` Imm: 0x${this._imm.toString(16).padStart(2, '0')}`);
    // process.stdout.write('\n');
  }

  set imm4(value) {
    this._imm4 = value;
    // process.stdout.write(` Imm4: 0x${this._imm4.toString(16).padStart(1, '0')}`);
  }

  set pcSel(value) {
    this._pcSel = value;
    // process.stdout.write(` PC Sel: ${this._pcSel}`);
  }

  set addrSel(value) {
    this._addrSel = value;
    // process.stdout.write(` Addr Sel: ${this._addrSel}`);
  }

  set wbSel(value) {
    this._wbSel = value;
    // process.stdout.write(` WB Sel: ${this._wbSel}`);
  }

  set memRead(value) {
    this._memRead = value;
    // process.stdout.write(` Mem Read: ${this._memRead}`);
  }

  set memWrite(value) {
    this._memWrite = value;
    // process.stdout.write(` Mem Write: ${this._memWrite}`);
  }

  set halt(value) {
    this._halt = value;
    // process.stdout.write(` Halt: ${this._halt}`);
    // process.stdout.write('\n');
  }

  set rs1(value) {
    this._rs1 = value;
    // process.stdout.write(` RS1: 0x${this._rs1.toString(16).padStart(2, '0')}`);
  }

  set rs2(value) {
    this._rs2 = value;
    // process.stdout.write(` RS2: 0x${this._rs2.toString(16).padStart(2, '0')}`);
  }

  set rd(value) {
    this._rd = value;
    // process.stdout.write(` RD: 0x${this._rd.toString(16).padStart(2, '0')}`);
  }

  set aluResult(value) {
    this._aluResult = value;
    // process.stdout.write(` ALU Result: 0x${this._aluResult.toString(16).padStart(2, '0')}`);
    // process.stdout.write('\n');
  }

  set addressMuxOutput(value) {
    this._addressMuxOutput = value;
    // process.stdout.write(` Address Mux Output: 0x${this._addressMuxOutput.toString(16).padStart(2, '0')}`);
  }

  set ramDataOut(value) {
    this._ramDataOut = value;
    // process.stdout.write(` RAM Data Out: 0x${this._ramDataOut.toString(16).padStart(2, '0')}`);
  }

  set wbMuxOutput(value) {
    this._wbMuxOutput = value;
    // process.stdout.write(` WB Mux Output: 0x${this._wbMuxOutput.toString(16).padStart(2, '0')}`);
    // process.stdout.write('\n');
  }

  snapshot() {
    return {
      clk: this._clk,
      pc: this._pc,
      pmAddr: this._pmAddr,
      inst: this._inst,
      control: this._control,
      rs1En: this._rs1En,
      rs2En: this._rs2En,
      rdEn: this._rdEn,
      imm: this._imm,
      imm4: this._imm4,
      pcSel: this._pcSel,
      addrSel: this._addrSel,
      wbSel: this._wbSel,
      memRead: this._memRead,
      memWrite: this._memWrite,
      halt: this._halt,
      rs1: this._rs1,
      rs2: this._rs2,
      rd: this._rd,
      aluResult: this._aluResult,
      addressMuxOutput: this._addressMuxOutput,
      ramDataOut: this._ramDataOut,
      wbMuxOutput: this._wbMuxOutput,
    };
  }

}

export default ControlPanel;
