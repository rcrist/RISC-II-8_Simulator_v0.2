import Clock from '../modules/clock.js';
import PC from '../modules/pc.js';
import PCMux from '../modules/pc-mux.js';
import PM from '../modules/pm.js';
import IF_ID from '../modules/if-id.js';
import QuadRegisters from '../modules/quad-registers.js';

const clock = new Clock(1); // 1 Hz clock
const pc = new PC();
const pcMux = new PCMux();
const pm = new PM();
const if_id = new IF_ID();
const quadRegisters = new QuadRegisters();

await pm.loadDefaultHexFile();
if_id.we = true;
pcMux.sel = 0;
pc.connect(pcMux, 'input0');
pcMux.connect(pm, 'address');
pm.connect(if_id, 'd');
if_id.connectField('rs1En', quadRegisters, 'we1');
if_id.connectField('rs2En', quadRegisters, 'we2');
if_id.connectField('rdEn', quadRegisters, 'we3');

if_id.clk = true;
if_id.clk = false;

clock.connect(pc);
clock.connect(if_id);
clock.connect(quadRegisters);
clock.start();

export { clock, pc, pcMux, pm, if_id, quadRegisters };
