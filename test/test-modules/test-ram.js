import RAM from '../components/ram.js';

const ram = new RAM();
let value = 0;

ram.we = true; // Enable write mode
ram.dataIn = 0x55; // Set data input to 0x55
ram.address = 0xFF; // Set address to 0xFF
ram.clk = true; // Trigger write operation

ram.we = false; // Read mode
ram.dataIn = 0x77; // Set data input to 0x77
ram.address = 0xFF; // Set address to 0xFF
ram.clk = true; // Trigger write operation

value = ram.read(0xFF);
console.log(`0x${ram.dataOut.toString(16).padStart(2, '0')}`); // Should output 0x00

ram.clear();
value = ram.read(0xFF);
console.log(`0x${ram.dataOut.toString(16).padStart(2, '0')}`); // Should output 0x00
