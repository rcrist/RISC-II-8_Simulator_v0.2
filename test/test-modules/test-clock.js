import Clock from '../components/clock.js';
import Register from '../components/register.js';

const clock = new Clock(1);
const reg = new Register();
const transitions = [];

clock.onToggle((clk) => transitions.push(clk));
clock.connect(reg);

console.log(`${clock.frequencyHz} Hz`); // Should output 1 Hz
console.log(`${clock.periodMs} ms`); // Should output 1000 ms
console.log(`${clock.halfPeriodMs} ms`); // Should output 500 ms

reg.we = true;
reg.d = 0x42;

clock.toggle();
console.log(`0x${reg.q.toString(16).padStart(2, '0')}`); // Should output 0x42

reg.d = 0x99;
clock.toggle();
console.log(`0x${reg.q.toString(16).padStart(2, '0')}`); // Should output 0x42

clock.setFrequency(2);
console.log(`${clock.periodMs} ms`); // Should output 500 ms
console.log(`${clock.halfPeriodMs} ms`); // Should output 250 ms

console.log(transitions.join(',')); // Should output true,false
