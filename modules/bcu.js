/**
 * Branch Control Unit
 * - Compares two 8-bit inputs and generates branch flags
 */

class BCU {
  constructor() {
    this._a = 0;
    this._b = 0;
    this.zf = true;
    this.beqf = true;
    this.bnef = false;
    this.bltf = false;
    this.bgef = true;
    this._listeners = [];
    this._flagConnections = [];

    this.updateFlags();
  }

  get a() {
    return this._a;
  }

  set a(nextA) {
    this.validateByte(nextA, 'A');
    this._a = nextA;
    this.updateFlags();
  }

  get b() {
    return this._b;
  }

  set b(nextB) {
    this.validateByte(nextB, 'B');
    this._b = nextB;
    this.updateFlags();
  }

  updateFlags() {
    this.zf = this._a === 0;
    this.beqf = this._a === this._b;
    this.bnef = this._a !== this._b;
    this.bltf = this._a < this._b;
    this.bgef = this._a >= this._b;

    for (const connection of this._flagConnections) {
      connection.component[connection.pin] = this[connection.flag];
    }

    for (const listener of this._listeners) {
      listener(this.flags);
    }

    console.log(`[BCU] A=0x${this._a.toString(16).padStart(2, '0')} B=0x${this._b.toString(16).padStart(2, '0')} ZF=${this.zf} BEQF=${this.beqf} BNEF=${this.bnef} BLTF=${this.bltf} BGEF=${this.bgef}`);
  }

  get flags() {
    return {
      zf: this.zf,
      beqf: this.beqf,
      bnef: this.bnef,
      bltf: this.bltf,
      bgef: this.bgef,
    };
  }

  connectFlag(flag, component, pin = flag) {
    if (!component || typeof component !== 'object') {
      throw new Error('BCU connection target must be an object.');
    }

    if (!(flag in this.flags)) {
      throw new Error(`Invalid BCU flag: ${flag}.`);
    }

    this._flagConnections.push({ flag, component, pin });
    component[pin] = this[flag];
  }

  onUpdate(listener) {
    if (typeof listener !== 'function') {
      throw new Error('BCU listener must be a function.');
    }

    this._listeners.push(listener);
  }

  validateByte(value, label) {
    if (!Number.isInteger(value) || value < 0 || value > 0xff) {
      throw new Error(`Invalid BCU ${label} input: ${value}. Input must be an 8-bit value between 0 and 255.`);
    }
  }
}

export default BCU;
