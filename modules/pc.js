/**
 * Program Counter Component
 * - 5-bit counter that increments on each clock cycle
 */

class PC {
  constructor() {
    this._count = 0; // 5-bit count (0-31)
    this._clk = false;
    this._en = true; // Enable counting
    this._load = false; // Load value instead of incrementing
    this._dataIn = 0; // Data input for loading
    this._dataOut = 0; // Data output (current count)

    this._listeners = [];
    this._connections = [];

    this.clear();
  }

  get clk() {
    return this._clk;
  }

  get count() {
    return this._count;
  }

  get dataOut() {
    return this._dataOut;
  }

  set clk(nextClk) {
    const isLeadingEdge = !this._clk && nextClk;

    if (isLeadingEdge && this._en) {
      this._count = (this._count + 1) & 0x1f;
      this._dataOut = this._count;
      this.updateOutputs();
      console.log(`[PC] COUNT: 0x${this._count.toString(16).padStart(2, '0')}`);
    }

    this._clk = nextClk;
  }

  clear() {
    this._count = 0;
    this._dataOut = 0;
    this.updateOutputs();
    console.log('[PC] Counter cleared');
  }

  connect(component, pin = 'input0') {
    if (!component || typeof component !== 'object') {
      throw new Error('PC connection target must be an object.');
    }

    this._connections.push({ component, pin });
    component[pin] = this._dataOut;
  }

  onUpdate(listener) {
    if (typeof listener !== 'function') {
      throw new Error('PC listener must be a function.');
    }

    this._listeners.push(listener);
  }

  updateOutputs() {
    for (const connection of this._connections) {
      connection.component[connection.pin] = this._dataOut;
    }

    for (const listener of this._listeners) {
      listener(this._dataOut);
    }
  }
}

export default PC;
