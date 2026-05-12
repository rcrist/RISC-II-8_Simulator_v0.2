/**
 * Clock Component
 * - Configurable frequency in hertz
 * - Output is high for the first half-period and low for the second half-period
 */
class Clock {
  constructor(frequencyHz = 1) {
    this._clk = false;
    this._halt = false;
    this._timer = null;
    this._listeners = [];
    this._connections = [];

    this.setFrequency(frequencyHz);
  }

  get clk() {
    return this._clk;
  }

  get isRunning() {
    return this._timer !== null;
  }

  get halt() {
    return this._halt;
  }

  set halt(nextHalt) {
    this._halt = Boolean(nextHalt);

    if (this._halt) {
      this.stop();
    }
  }

  setFrequency(frequencyHz) {
    this.validateFrequency(frequencyHz);

    const wasRunning = this.isRunning;

    if (wasRunning) {
      this.stop();
    }

    this.frequencyHz = frequencyHz;
    this.periodMs = 1000 / frequencyHz;
    this.halfPeriodMs = this.periodMs / 2;

    if (wasRunning) {
      this.start();
    }
  }

  start() {
    if (this.isRunning || this._halt) {
      return;
    }

    this.setOutput(true);
    this._timer = setInterval(() => {
      this.toggle();
    }, this.halfPeriodMs);
  }

  stop() {
    if (!this.isRunning) {
      return;
    }

    clearInterval(this._timer);
    this._timer = null;
    this.setOutput(false);
  }

  toggle() {
    this.setOutput(!this._clk);
    return this._clk;
  }

  setOutput(nextClk) {
    this._clk = Boolean(nextClk);

    for (const connection of this._connections) {
      connection.component[connection.pin] = this._clk;
    }

    for (const listener of this._listeners) {
      listener(this._clk);
    }

    // console.log(`[Clock] ${this._clk ? 'HIGH' : 'LOW'}`);
  }

  connect(component, pin = 'clk') {
    if (!component || typeof component !== 'object') {
      throw new Error('Clock connection target must be an object.');
    }

    this._connections.push({ component, pin });
    component[pin] = this._clk;
  }

  onToggle(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Clock listener must be a function.');
    }

    this._listeners.push(listener);
  }

  validateFrequency(frequencyHz) {
    if (!Number.isFinite(frequencyHz) || frequencyHz <= 0) {
      throw new Error(`Invalid frequency: ${frequencyHz}. Frequency must be greater than 0 Hz.`);
    }
  }
}

export default Clock;
