import PC from '../modules/pc.js';
import PM from '../modules/pm.js';

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}. Expected ${expected}, got ${actual}.`);
  }
}

const pc = new PC();
const pm = new PM();

await pm.loadDefaultHexFile();
pm.connectPC(pc);

assertEqual(pm.dataOut, 0x1208, 'PM should output the instruction at PC address 0');

pc.clk = true;
pm.clk = true;
assertEqual(pm.address, 1, 'PM address should follow PC after a rising edge');
assertEqual(pm.dataOut, 0x1808, 'PM should output the instruction at PC address 1');

pc.clk = false;
pm.clk = false;
pc.clk = true;
pm.clk = true;
assertEqual(pm.address, 2, 'PM address should follow the next PC address');
assertEqual(pm.dataOut, 0x0000, 'PM should output the instruction at PC address 2');

console.log('PM tests passed');
