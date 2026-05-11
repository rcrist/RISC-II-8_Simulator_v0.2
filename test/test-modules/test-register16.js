import Register16 from '../modules/register-16.js';

const reg = new Register16();

reg.we = true; // Enable write mode
reg.d = 0x1237; // Set data input to 0x1237

reg.clk = true;
console.log(`0x${reg.q.toString(16).padStart(4, '0')}`); // Should output 0x1237

reg.we = false; // Disable write mode
reg.d = 0xFFFF; // Change data input to 0xFFFF
reg.clk = false;
reg.clk = true;
console.log(`0x${reg.q.toString(16).padStart(4, '0')}`); // Should output 0x1237

reg.clear();
console.log(`0x${reg.q.toString(16).padStart(4, '0')}`); // Should output 0x0000
