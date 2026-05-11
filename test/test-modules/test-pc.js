import PC from '../modules/pc.js';

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}. Expected ${expected}, got ${actual}.`);
  }
}

const pc = new PC();

assertEqual(pc.count, 0, 'PC should start at 0');
assertEqual(pc.dataOut, 0, 'PC dataOut should start at 0');

pc.clk = true;
assertEqual(pc.count, 1, 'PC should increment on first rising edge');
assertEqual(pc.dataOut, 1, 'PC dataOut should match count after increment');

pc.clk = true;
assertEqual(pc.count, 1, 'PC should not increment while clock stays high');

pc.clk = false;
assertEqual(pc.count, 1, 'PC should not increment on falling edge');

pc.clk = true;
assertEqual(pc.count, 2, 'PC should increment on the next rising edge');

for (let i = 0; i < 30; i += 1) {
  pc.clk = false;
  pc.clk = true;
}

assertEqual(pc.count, 0, 'PC should wrap to 0 after 32 counts');
assertEqual(pc.dataOut, 0, 'PC dataOut should match wrapped count');

pc.clear();
assertEqual(pc.count, 0, 'PC clear should reset count');
assertEqual(pc.dataOut, 0, 'PC clear should reset dataOut');

console.log('PC tests passed');
