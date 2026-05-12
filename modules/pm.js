/**
 * Program Memory Component
 * - Read Only Memory (ROM) that stores the program instructions 
 * - 5-bit addressable memory (32 instruction words)
 */

class PM {
  constructor() {
    this._memory = new Uint16Array(32); // 32 words of program memory
    this._address = 0; // 5-bit address (0-31)
    this._dataOut = 0; // Data output (current instruction) 
    this._oe = false; // Output enable
    this._clk = false;
    this._pc = null;

    this._listeners = [];
    this._connections = [];
  }

  get clk() {
    return this._clk;
  }

  set clk(nextClk) {
    const isLeadingEdge = !this._clk && nextClk;

    if (isLeadingEdge) {
      this.updateFromPC();
    }

    this._clk = nextClk;
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

  async loadDefaultHexFile() {
    await this.loadHexFile(new URL('../assets/PM_Add_Two.hex', import.meta.url));
  }

  async loadHexFile(path) {
    const hexText = await this.readHexFile(path);
    this.loadHex(hexText);
  }

  loadHex(hexText) {
    const words = this.parseHexWords(hexText);

    if (words.length > this._memory.length) {
      throw new Error(`HEX file contains ${words.length} words, but program memory only holds ${this._memory.length}.`);
    }

    this._memory.fill(0);

    for (let i = 0; i < words.length; i += 1) {
      this._memory[i] = words[i];
    }

    this.read();
    console.log(`[PM] Loaded HEX file with ${words.length} words.`);
  }

  parseHexWords(hexText) {
    const tokens = hexText
      .split(/\s+/)
      .map((token) => token.trim())
      .filter(Boolean);

    if (tokens[0] === 'v2.0' && tokens[1] === 'raw') {
      tokens.splice(0, 2);
    }

    return tokens.map((token) => {
      const word = Number.parseInt(token, 16);

      if (!/^[0-9a-fA-F]+$/.test(token) || !Number.isInteger(word) || word < 0 || word > 0xffff) {
        throw new Error(`Invalid instruction word in HEX file: ${token}`);
      }

      return word;
    });
  }

  async readHexFile(path) {
    const fileUrl = path instanceof URL ? path : new URL(path, import.meta.url);

    if (typeof fetch === 'function' && typeof window !== 'undefined') {
      const response = await fetch(fileUrl);

      if (!response.ok) {
        throw new Error(`Could not load HEX file: ${fileUrl}`);
      }

      return response.text();
    }

    const fs = await import('node:fs/promises');
    return fs.readFile(fileUrl, 'utf8');
  }

  connectPC(pc) {
    if (!pc || typeof pc !== 'object') {
      throw new Error('PM must connect to a PC object.');
    }

    this._pc = pc;
    this.updateFromPC();
  }

  updateFromPC() {
    if (!this._pc) {
      this.read();
      return;
    }

    this.address = this._pc.dataOut;
  }

  read(address = this._address) {
    this.validateAddress(address);
    this._dataOut = this._memory[address];
    this.updateOutputs();
    // console.log(`[PM] READ: Address 0x${address.toString(16).padStart(2, '0')} = 0x${this._dataOut.toString(16).padStart(4, '0')}`);
    return this._dataOut;
  }

  connect(component, pin = 'd') {
    if (!component || typeof component !== 'object') {
      throw new Error('PM connection target must be an object.');
    }

    this._connections.push({ component, pin });
    component[pin] = this._dataOut;
  }

  onUpdate(listener) {
    if (typeof listener !== 'function') {
      throw new Error('PM listener must be a function.');
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

  validateAddress(address) {
    if (!Number.isInteger(address) || address < 0 || address >= this._memory.length) {
      throw new Error(`Invalid address: ${address}. Address must be between 0 and ${this._memory.length - 1}.`);
    }
  }
}

export default PM;
