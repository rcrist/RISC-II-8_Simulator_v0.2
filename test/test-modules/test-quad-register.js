import QuadRegisters from '../modules/quad-registers.js';

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}. Expected ${expected}, got ${actual}.`);
  }
}

const regs = new QuadRegisters();

assertEqual(regs.q0, 0x00, 'Reg0 should start at 0');
assertEqual(regs.q1, 0x00, 'Reg1 should start at 0');
assertEqual(regs.q2, 0x00, 'Reg2 should start at 0');
assertEqual(regs.q3, 0x00, 'Reg3 should start at 0');

regs.d0 = 0xff;
regs.d1 = 0x12;
regs.d2 = 0x34;
regs.d3 = 0x56;

regs.clk = true;
assertEqual(regs.q0, 0x00, 'Reg0 should remain hardwired to 0');
assertEqual(regs.q1, 0x12, 'Reg1 should capture d1 on rising edge');
assertEqual(regs.q2, 0x34, 'Reg2 should capture d2 on rising edge');
assertEqual(regs.q3, 0x56, 'Reg3 should capture d3 on rising edge');

regs.d1 = 0xaa;
regs.d2 = 0xbb;
regs.d3 = 0xcc;
regs.clk = true;
assertEqual(regs.q1, 0x12, 'Reg1 should not capture while clock remains high');
assertEqual(regs.q2, 0x34, 'Reg2 should not capture while clock remains high');
assertEqual(regs.q3, 0x56, 'Reg3 should not capture while clock remains high');

regs.clk = false;
assertEqual(regs.q1, 0x12, 'Reg1 should not capture on falling edge');
assertEqual(regs.q2, 0x34, 'Reg2 should not capture on falling edge');
assertEqual(regs.q3, 0x56, 'Reg3 should not capture on falling edge');

regs.we2 = false;
regs.clk = true;
assertEqual(regs.q1, 0xaa, 'Reg1 should capture the next d1 on the next rising edge');
assertEqual(regs.q2, 0x34, 'Reg2 should hold value when write enable is false');
assertEqual(regs.q3, 0xcc, 'Reg3 should capture the next d3 on the next rising edge');

console.log('Quad register tests passed');
