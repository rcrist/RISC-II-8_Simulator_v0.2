/**
 * 8-Bit RAM Component
 * - 256 addresses (0-255)
 * - 8-bit data width (0-255)
 */
class RAM {
  constructor() {
    // Define memory size as 256 bytes (0-255 addresses) and initialize write enable (we) to false
    this.memory = new Uint8Array(256);
    this.we = false; // Write Enable
    this._clk = false; // Clock signal
    this.address = 0; // Address input
    this.dataIn = 0; // Data input
    this.dataOut = 0; // Data output
    this._listeners = [];
    this._connections = [];
  }

  get clk() {
    return this._clk;
  }

  set clk(nextClk) {
    const isLeadingEdge = !this._clk && nextClk;

    if (isLeadingEdge && this.we) {
      this.validateAddress(this.address);
      this.validateData(this.dataIn);
      this.memory[this.address] = this.dataIn;
      console.log(`[RAM] WRITE: Address 0x${this.address.toString(16).padStart(2, '0')} = 0x${this.dataIn.toString(16).padStart(2, '0')}`);
    }

    this._clk = nextClk;
  }

  read(address) {
    // Validate address
    this.validateAddress(address);

    // Read operation
    if (!this.we) {
      this.dataOut = this.memory[address];
      this.updateOutputs();
      console.log(`[RAM] READ:  Address 0x${address.toString(16).padStart(2, '0')} = 0x${this.dataOut.toString(16).padStart(2, '0')}`);
      return this.dataOut;
    }
  }

  connect(component, pin = 'dataIn') {
    if (!component || typeof component !== 'object') {
      throw new Error('RAM connection target must be an object.');
    }

    this._connections.push({ component, pin });
    component[pin] = this.dataOut;
  }

  onUpdate(listener) {
    if (typeof listener !== 'function') {
      throw new Error('RAM listener must be a function.');
    }

    this._listeners.push(listener);
  }

  updateOutputs() {
    for (const connection of this._connections) {
      connection.component[connection.pin] = this.dataOut;
    }

    for (const listener of this._listeners) {
      listener(this.dataOut);
    }
  }

  validateAddress(address) {
    if (address < 0 || address >= 256) {
      throw new Error(`Invalid address: ${address}. Address must be between 0 and 255.`);
    }
  }

  validateData(data) {
    if (data < 0 || data > 255) {
      throw new Error(`Invalid data: ${data}. Data must be between 0 and 255.`);
    }
  }

  clear() {
    this.memory.fill(0);
    console.log('[RAM] Memory cleared');
  }
}

export default RAM;
