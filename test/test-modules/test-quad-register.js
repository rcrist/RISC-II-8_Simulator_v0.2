import QuadRegisters from '../../modules/quad-registers.js';

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

regs.writeData = 0x12;

regs.clk = true;
assertEqual(regs.q0, 0x00, 'Reg0 should remain hardwired to 0');
assertEqual(regs.q1, 0x12, 'Reg1 should capture writeData on rising edge');
assertEqual(regs.q2, 0x12, 'Reg2 should capture writeData on rising edge');
assertEqual(regs.q3, 0x12, 'Reg3 should capture writeData on rising edge');

regs.writeData = 0xaa;
regs.clk = true;
assertEqual(regs.q1, 0x12, 'Reg1 should not capture while clock remains high');
assertEqual(regs.q2, 0x12, 'Reg2 should not capture while clock remains high');
assertEqual(regs.q3, 0x12, 'Reg3 should not capture while clock remains high');

regs.clk = false;
assertEqual(regs.q1, 0x12, 'Reg1 should not capture on falling edge');
assertEqual(regs.q2, 0x12, 'Reg2 should not capture on falling edge');
assertEqual(regs.q3, 0x12, 'Reg3 should not capture on falling edge');

regs.we2 = false;
regs.clk = true;
assertEqual(regs.q1, 0xaa, 'Reg1 should capture the next writeData on the next rising edge');
assertEqual(regs.q2, 0x12, 'Reg2 should hold value when write enable is false');
assertEqual(regs.q3, 0xaa, 'Reg3 should capture the next writeData on the next rising edge');

console.log('Quad register tests passed');
