/**
 * Control Unit Component
 * - Read Only Memory (ROM) that generates control signals based on the current instruction 
 * - 5-bit addressable memory (32 control words)
 * - 8-bit data width contains the decoded control signals
 * - Address is the 5-bit control signal from IF/ID
 */

class ControlUnit {
  constructor() {
    this._memory = new Uint16Array(32);
    this._address = 0;
    this._dataOut = 0;
    this._listeners = [];
    this._connections = [];
    this._signalConnections = [];

    this.parseControlSignals();
  }

  get address() {
    return this._address;
  }

  set address(nextAddress) {
    this.validateAddress(nextAddress);
    this._address = nextAddress;
    this.read();
  }

  get dataOut() {
    return this._dataOut;
  }

  get pcSel() {
    return Boolean((this._dataOut >> 7) & 0x01);
  }

  get addrSel() {
    return (this._dataOut >> 5) & 0x03;
  }

  get addrSel1() {
    return Boolean((this._dataOut >> 6) & 0x01);
  }

  get addrSel0() {
    return Boolean((this._dataOut >> 5) & 0x01);
  }

  get aluSel() {
    return Boolean((this._dataOut >> 4) & 0x01);
  }

  get wbSel() {
    return Boolean((this._dataOut >> 3) & 0x01);
  }

  get memRead() {
    return Boolean((this._dataOut >> 2) & 0x01);
  }

  get memWrite() {
    return Boolean((this._dataOut >> 1) & 0x01);
  }

  get halt() {
    return Boolean(this._dataOut & 0x01);
  }

  async loadDefaultHexFile() {
    await this.loadHexFile('../assets/Control_Unit_Rom.hex');
  }

  async loadHexFile(path) {
    const hexText = await this.readHexFile(path);
    this.loadHex(hexText);
  }

  loadHex(hexText) {
    const words = this.parseHexWords(hexText);

    if (words.length > this._memory.length) {
      throw new Error(`HEX file contains ${words.length} words, but control memory only holds ${this._memory.length}.`);
    }

    this._memory.fill(0);

    for (let i = 0; i < words.length; i += 1) {
      this._memory[i] = words[i];
    }

    this.read();
  }

  parseHexWords(hexText) {
    const tokens = hexText
      .split(/\r?\n/)
      .flatMap((line) => line.split('#')[0].split(/\s+/))
      .map((token) => token.trim())
      .filter(Boolean);

    if (tokens[0] === 'v2.0' && tokens[1] === 'raw') {
      tokens.splice(0, 2);
    }

    return tokens.flatMap((token) => {
      const repeatMatch = token.match(/^(\d+)\*([0-9a-fA-F]+)$/);

      if (repeatMatch) {
        const count = Number.parseInt(repeatMatch[1], 10);
        const word = this.parseControlWord(repeatMatch[2]);
        return Array(count).fill(word);
      }

      return [this.parseControlWord(token)];
    });
  }

  parseControlWord(token) {
    const word = Number.parseInt(token, 16);

    if (!/^[0-9a-fA-F]+$/.test(token) || !Number.isInteger(word) || word < 0 || word > 0xff) {
      throw new Error(`Invalid control word in HEX file: ${token}`);
    }

    return word;
  }

  async readHexFile(path) {
    if (typeof fetch === 'function' && typeof window !== 'undefined') {
      const response = await fetch(path);

      if (!response.ok) {
        throw new Error(`Could not load HEX file: ${path}`);
      }

      return response.text();
    }

    const fs = await import('node:fs/promises');
    const fileUrl = new URL(path, import.meta.url);
    return fs.readFile(fileUrl, 'utf8');
  }

  read(address = this._address) {
    this.validateAddress(address);
    this._dataOut = this._memory[address];
    this.parseControlSignals();
    this.updateOutputs();
    console.log(`[ControlUnit] READ: Address 0x${address.toString(16).padStart(2, '0')} = 0x${this._dataOut.toString(16).padStart(2, '0')}`);
    this.logControlSignals();
    return this._dataOut;
  }

  parseControlSignals() {
    this.pc_sel = this.pcSel;
    this.addr_sel = this.addrSel;
    this.addr_sel1 = this.addrSel1;
    this.addr_sel0 = this.addrSel0;
    this.alu_sel = this.aluSel;
    this.wb_sel = this.wbSel;
    this.mem_read = this.memRead;
    this.mem_write = this.memWrite;
    this.halt_signal = this.halt;
  }

  logControlSignals() {
    console.log(`[ControlUnit] PINS: pcSel=${this.pcSel} addrSel=${this.addrSel.toString(2).padStart(2, '0')} aluSel=${this.aluSel} wbSel=${this.wbSel} memRead=${this.memRead} memWrite=${this.memWrite} halt=${this.halt}`);
  }

  connect(component, pin = 'dataOut') {
    if (!component || typeof component !== 'object') {
      throw new Error('ControlUnit connection target must be an object.');
    }

    this._connections.push({ component, pin });
    component[pin] = this._dataOut;
  }

  connectSignal(signal, component, pin = signal) {
    if (!component || typeof component !== 'object') {
      throw new Error('ControlUnit signal connection target must be an object.');
    }

    if (!(signal in this)) {
      throw new Error(`Invalid control signal: ${signal}.`);
    }

    this._signalConnections.push({ signal, component, pin });
    component[pin] = this[signal];
  }

  onUpdate(listener) {
    if (typeof listener !== 'function') {
      throw new Error('ControlUnit listener must be a function.');
    }

    this._listeners.push(listener);
  }

  updateOutputs() {
    for (const connection of this._connections) {
      connection.component[connection.pin] = this._dataOut;
    }

    for (const connection of this._signalConnections) {
      connection.component[connection.pin] = this[connection.signal];
    }

    for (const listener of this._listeners) {
      listener(this._dataOut);
    }
  }

  validateAddress(address) {
    if (!Number.isInteger(address) || address < 0 || address >= this._memory.length) {
      throw new Error(`Invalid address: ${address}. Address must be between 0 and ${this._memory.length - 1}.`);
    }
  }
}

export default ControlUnit;
