import PCMux from '../modules/pc-mux.js';

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}. Expected ${expected}, got ${actual}.`);
  }
}

function assertThrows(callback, message) {
  try {
    callback();
  } catch {
    return;
  }

  throw new Error(`${message}. Expected an error.`);
}

const mux = new PCMux();
const target = { address: 0 };

assertEqual(mux.dataOut, 0, 'PC mux should start with output 0');
mux.connect(target);

mux.input0 = 0x03;
mux.input1 = 0x11;
assertEqual(mux.dataOut, 0x03, 'PC mux should output input0 when sel is 0');
assertEqual(target.address, 0x03, 'PC mux should drive connected target address');

mux.sel = 1;
assertEqual(mux.dataOut, 0x11, 'PC mux should output input1 when sel is 1');
assertEqual(target.address, 0x11, 'PC mux should update connected target when select changes');

mux.input1 = 0x1f;
assertEqual(mux.dataOut, 0x1f, 'PC mux output should update when the selected input changes');

mux.sel = false;
assertEqual(mux.dataOut, 0x03, 'PC mux should accept false as select 0');

mux.sel = true;
assertEqual(mux.dataOut, 0x1f, 'PC mux should accept true as select 1');

mux.input0 = 0x00;
mux.input1 = 0x1f;
assertEqual(mux.input0, 0x00, 'PC mux input0 should accept the lowest 5-bit value');
assertEqual(mux.input1, 0x1f, 'PC mux input1 should accept the highest 5-bit value');

assertThrows(() => {
  mux.input0 = -1;
}, 'PC mux should reject negative inputs');

assertThrows(() => {
  mux.input1 = 0x20;
}, 'PC mux should reject inputs larger than 5 bits');

assertThrows(() => {
  mux.sel = 2;
}, 'PC mux should reject invalid select values');

console.log('PC mux tests passed');
