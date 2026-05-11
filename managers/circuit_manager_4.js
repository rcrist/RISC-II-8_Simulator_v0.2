import Clock from '../modules/clock.js';
import PC from '../modules/pc.js';
import PCMux from '../modules/pc-mux.js';
import PM from '../modules/pm.js';

const clock = new Clock(1); // 1 Hz clock
const pc = new PC();
const pcMux = new PCMux();
const pm = new PM();

await pm.loadDefaultHexFile();
pcMux.sel = 0;
pc.connect(pcMux, 'input0');
pcMux.connect(pm, 'address');

clock.connect(pc);
clock.start();

export { clock, pc, pcMux, pm };
