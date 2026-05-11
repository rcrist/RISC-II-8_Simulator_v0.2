import Clock from '../modules/clock.js';
import PC from '../modules/pc.js';

const clock = new Clock(1); // 1 Hz clock
const pc = new PC();

pm.connectPC(pc);
clock.connect(pc);
clock.start();

export { clock, pc };
