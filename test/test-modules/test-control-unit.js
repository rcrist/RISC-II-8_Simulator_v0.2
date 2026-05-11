import ControlUnit from '../modules/control-unit.js';

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

const controlUnit = new ControlUnit();
const target = {};
const updates = [];

controlUnit.connect(target, 'rawControl');
controlUnit.connectSignal('pcSel', target, 'pcSel');
controlUnit.connectSignal('addrSel', target, 'addrSel');
controlUnit.connectSignal('aluSel', target, 'aluSel');
controlUnit.connectSignal('wbSel', target, 'wbSel');
controlUnit.connectSignal('memRead', target, 'memRead');
controlUnit.connectSignal('memWrite', target, 'memWrite');
controlUnit.connectSignal('halt', target, 'halt');
controlUnit.onUpdate((dataOut) => updates.push(dataOut));

controlUnit.loadHex(`
v2.0 raw
# exercise comments and repeat syntax
2*00
ff
`);

assertEqual(controlUnit.dataOut, 0x00, 'Control unit should read address 0 after loading');
assertEqual(target.rawControl, 0x00, 'Control unit should drive connected raw output');

controlUnit.address = 2;
assertEqual(controlUnit.dataOut, 0xff, 'Control unit should read custom control word');
assertEqual(controlUnit.pcSel, true, 'pcSel should decode bit 7');
assertEqual(controlUnit.addrSel, 0x03, 'addrSel should decode bits 6:5');
assertEqual(controlUnit.addrSel1, true, 'addrSel1 should decode bit 6');
assertEqual(controlUnit.addrSel0, true, 'addrSel0 should decode bit 5');
assertEqual(controlUnit.aluSel, true, 'aluSel should decode bit 4');
assertEqual(controlUnit.wbSel, true, 'wbSel should decode bit 3');
assertEqual(controlUnit.memRead, true, 'memRead should decode bit 2');
assertEqual(controlUnit.memWrite, true, 'memWrite should decode bit 1');
assertEqual(controlUnit.halt, true, 'halt should decode bit 0');
assertEqual(target.addrSel, 0x03, 'Control unit should drive connected decoded signal');
assertEqual(updates.at(-1), 0xff, 'Control unit should notify listeners after reads');

await controlUnit.loadDefaultHexFile();
assertEqual(controlUnit.dataOut, 0x00, 'Default ROM should read address 0 after loading');

controlUnit.address = 0x10;
assertEqual(controlUnit.dataOut, 0x14, 'Default ROM address 0x10 should contain 0x14');
assertEqual(controlUnit.aluSel, true, '0x14 should assert aluSel');
assertEqual(controlUnit.memRead, true, '0x14 should assert memRead');
assertEqual(controlUnit.memWrite, false, '0x14 should not assert memWrite');
assertEqual(controlUnit.halt, false, '0x14 should not assert halt');

controlUnit.address = 0x1b;
assertEqual(controlUnit.dataOut, 0x01, 'Default ROM address 0x1b should contain halt');
assertEqual(controlUnit.halt, true, '0x01 should assert halt');

assertThrows(() => {
  controlUnit.address = 0x20;
}, 'Control unit should reject addresses outside 5 bits');

assertThrows(() => {
  controlUnit.loadHex('v2.0 raw\n100\n');
}, 'Control unit should reject control words larger than 8 bits');

assertThrows(() => {
  controlUnit.connectSignal('regWrite', {}, 'regWrite');
}, 'Control unit should reject removed or invalid signals');

console.log('Control unit tests passed');
