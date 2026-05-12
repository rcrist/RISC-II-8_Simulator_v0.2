/**
 * 8-Bit Register Component
 * - 8-bit data width (0-255)
 */

class Register {
  constructor() {
    this.value = 0;
    this.we = false; // Write Enable
    this._clk = false; // Clock signal
    this.d = 0; // Data input
    this.q = 0; // Data output

    this.clear();
  }

  get clk() {
    return this._clk;
  }

  set clk(nextClk) {
    const isLeadingEdge = !this._clk && nextClk;

    if (isLeadingEdge && this.we) {
      this.validateData(this.d);
      this.value = this.d;
      this.q = this.value;
      // console.log(`[Register] WRITE: 0x${this.value.toString(16).padStart(2, '0')}`);
    }

    this._clk = nextClk;
  }

  validateData(data) {
    if (data < 0 || data > 255) {
      throw new Error(`Invalid data: ${data}. Data must be between 0 and 255.`);
    }
  }

  clear() {
    this.value = 0;
    this.q = 0;
    // console.log('[Register] Register cleared');
  }
}

export default Register;
