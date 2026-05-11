import Register8 from '../modules/register-8.js';

const reg = new Register8();

reg.we = true; // Enable write mode
reg.d = 0x37; // Set data input to 0x37

reg.clk = true;
console.log(`0x${reg.q.toString(16).padStart(2, '0')}`); // Should output 0x37

reg.we = false; // Disable write mode
reg.d = 0xFF; // Change data input to 0xFF
reg.clk = false;
reg.clk = true;
console.log(`0x${reg.q.toString(16).padStart(2, '0')}`); // Should output 0x37

reg.clear();
console.log(`0x${reg.q.toString(16).padStart(2, '0')}`); // Should output 0x00
