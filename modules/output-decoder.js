/**
 * Output Decoder
 * - Converts an 8-bit value into four decimal 7-segment display outputs
 * - Segment bit order is abcdefg, with bit 6 = a and bit 0 = g
 */

class OutputDecoder {
  constructor() {
    this._dataIn = 0;
    this.onesDigit = 0;
    this.tensDigit = 0;
    this.hundredsDigit = 0;
    this.thousandsDigit = 0;
    this.ones = 0;
    this.tens = 0;
    this.hundreds = 0;
    this.thousands = 0;
    this._listeners = [];
    this._connections = [];

    this.updateOutputs();
  }

  static SEGMENTS = [
    0b1111110, // 0
    0b0110000, // 1
    0b1101101, // 2
    0b1111001, // 3
    0b0110011, // 4
    0b1011011, // 5
    0b1011111, // 6
    0b1110000, // 7
    0b1111111, // 8
    0b1111011, // 9
  ];

  get dataIn() {
    return this._dataIn;
  }

  set dataIn(nextData) {
    this.validateData(nextData);
    this._dataIn = nextData;
    this.updateOutputs();
  }

  updateOutputs() {
    this.onesDigit = this._dataIn % 10;
    this.tensDigit = Math.floor(this._dataIn / 10) % 10;
    this.hundredsDigit = Math.floor(this._dataIn / 100) % 10;
    this.thousandsDigit = Math.floor(this._dataIn / 1000) % 10;

    this.ones = this.decodeDigit(this.onesDigit);
    this.tens = this.decodeDigit(this.tensDigit);
    this.hundreds = this.decodeDigit(this.hundredsDigit);
    this.thousands = this.decodeDigit(this.thousandsDigit);

    for (const connection of this._connections) {
      connection.component[connection.pin] = this[connection.output];
    }

    for (const listener of this._listeners) {
      listener(this.outputs);
    }

    // console.log(`[OutputDecoder] ${this._dataIn} -> thousands=${this.formatSegments(this.thousands)} hundreds=${this.formatSegments(this.hundreds)} tens=${this.formatSegments(this.tens)} ones=${this.formatSegments(this.ones)}`);
  }

  get outputs() {
    return {
      thousands: this.thousands,
      hundreds: this.hundreds,
      tens: this.tens,
      ones: this.ones,
      thousandsDigit: this.thousandsDigit,
      hundredsDigit: this.hundredsDigit,
      tensDigit: this.tensDigit,
      onesDigit: this.onesDigit,
    };
  }

  decodeDigit(digit) {
    return OutputDecoder.SEGMENTS[digit];
  }

  connectOutput(output, component, pin = output) {
    if (!component || typeof component !== 'object') {
      throw new Error('OutputDecoder connection target must be an object.');
    }

    if (!(output in this.outputs)) {
      throw new Error(`Invalid OutputDecoder output: ${output}.`);
    }

    this._connections.push({ output, component, pin });
    component[pin] = this[output];
  }

  onUpdate(listener) {
    if (typeof listener !== 'function') {
      throw new Error('OutputDecoder listener must be a function.');
    }

    this._listeners.push(listener);
  }

  formatSegments(segments) {
    return segments.toString(2).padStart(7, '0');
  }

  validateData(data) {
    if (!Number.isInteger(data) || data < 0 || data > 0xff) {
      throw new Error(`Invalid output decoder input: ${data}. Input must be an 8-bit value between 0 and 255.`);
    }
  }
}

export default OutputDecoder;
