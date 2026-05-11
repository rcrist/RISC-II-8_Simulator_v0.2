import Clock from '../modules/clock.js';
import PC from '../modules/pc.js';
import PCMux from '../modules/pc-mux.js';
import PM from '../modules/pm.js';
import IF_ID from '../modules/if-id.js';

const clock = new Clock(1); // 1 Hz clock
const pc = new PC();
const pcMux = new PCMux();
const pm = new PM();
const if_id = new IF_ID();

await pm.loadDefaultHexFile();
if_id.we = true;
pcMux.sel = 0;
pc.connect(pcMux, 'input0');
pcMux.connect(pm, 'address');
pm.connect(if_id, 'd');

if_id.clk = true;
if_id.clk = false;

clock.connect(pc);
clock.connect(if_id);
clock.start();

export { clock, pc, pcMux, pm, if_id };
