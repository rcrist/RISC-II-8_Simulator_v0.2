import Clock from '../modules/clock.js';
import PC from '../modules/pc.js';
import PM from '../modules/pm.js';

const clock = new Clock(1); // 1 Hz clock
const pc = new PC();
const pm = new PM();

await pm.loadDefaultHexFile();
pm.connectPC(pc);
clock.connect(pc);
clock.connect(pm);
clock.start();

export { clock, pc, pm };
