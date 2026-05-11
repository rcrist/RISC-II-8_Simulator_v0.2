import Mux4 from '../modules/mux-4.js';

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

const mux = new Mux4();
const target = {};
const updates = [];

mux.connect(target, 'value');
mux.onUpdate((dataOut) => updates.push(dataOut));

assertEqual(mux.dataOut, 0x00, 'Mux4 should start with output 0');
assertEqual(target.value, 0x00, 'Mux4 should initialize connected output');

mux.input0 = 0x11;
mux.input1 = 0x22;
mux.input2 = 0x33;
mux.input3 = 0x44;

mux.sel = 0;
assertEqual(mux.dataOut, 0x11, 'Mux4 should select input0 when sel is 0');
assertEqual(target.value, 0x11, 'Mux4 should drive connected output from input0');

mux.sel = 1;
assertEqual(mux.dataOut, 0x22, 'Mux4 should select input1 when sel is 1');

mux.sel = 2;
assertEqual(mux.dataOut, 0x33, 'Mux4 should select input2 when sel is 2');

mux.sel = 3;
assertEqual(mux.dataOut, 0x44, 'Mux4 should select input3 when sel is 3');
assertEqual(target.value, 0x44, 'Mux4 should update connected output when select changes');

mux.input3 = 0xaa;
assertEqual(mux.dataOut, 0xaa, 'Mux4 should update output when selected input changes');
assertEqual(updates.at(-1), 0xaa, 'Mux4 should notify listeners when output changes');

const mux5 = new Mux4(5);
mux5.input0 = 0x1f;
mux5.sel = 0;
assertEqual(mux5.dataOut, 0x1f, 'Mux4 should support 5-bit mode');

assertThrows(() => {
  mux5.input1 = 0x20;
}, 'Mux4 should reject values larger than the configured bit width');

assertThrows(() => {
  mux.sel = 4;
}, 'Mux4 should reject select values outside 2 bits');

assertThrows(() => {
  new Mux4(0);
}, 'Mux4 should reject invalid bit widths');

console.log('Mux4 tests passed');
