/**
 * 16-Bit Register Component
 * - 16-bit data width (0-65535)
 */

class Register16 {
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
      // console.log(`[Register16] WRITE: 0x${this.value.toString(16).padStart(4, '0')}`);
    }

    this._clk = nextClk;
  }

  validateData(data) {
    if (data < 0 || data > 65535) {
      throw new Error(`Invalid data: ${data}. Data must be between 0 and 65535.`);
    }
  }

  clear() {
    this.value = 0;
    this.q = 0;
    // console.log('[Register16] Register cleared');
  }
}

export default Register16;
