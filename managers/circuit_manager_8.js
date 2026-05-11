import Clock from '../modules/clock.js';
import PC from '../modules/pc.js';
import PCMux from '../modules/pc-mux.js';
import PM from '../modules/pm.js';
import IF_ID from '../modules/if-id.js';
import QuadRegisters from '../modules/quad-registers.js';
import ControlUnit from '../modules/control-unit.js';
import MUX4 from '../modules/mux-4.js';
import RAM from '../modules/ram.js';
import ALU from '../modules/alu.js';
import BCU from '../modules/bcu.js';

const clock = new Clock(1); // 1 Hz clock
const pc = new PC();
const pcMux = new PCMux();
const pm = new PM();
const if_id = new IF_ID();
const quadRegisters = new QuadRegisters();
const controlUnit = new ControlUnit();
const addrMux = new MUX4(8); // 8-bit address mux
const ram = new RAM(256); // 256 bytes of RAM
const wbMux = new MUX4(8); // 8-bit write-back mux
const alu = new ALU();
const bcu = new BCU();

await pm.loadDefaultHexFile();
await controlUnit.loadDefaultHexFile();
if_id.we = true;
pcMux.sel = 0;
pc.connect(pcMux, 'input0');
pcMux.connect(pm, 'address');
pm.connect(if_id, 'd');
if_id.connectField('rs1En', quadRegisters, 'we1');
if_id.connectField('rs2En', quadRegisters, 'we2');
if_id.connectField('rdEn', quadRegisters, 'we3');
if_id.connectField('control', controlUnit, 'address');
if_id.connectField('imm', addrMux, 'input2');
if_id.connectField('imm', wbMux, 'input2');
controlUnit.connectSignal('addrSel', addrMux, 'sel');
controlUnit.connectSignal('wbSel', wbMux, 'sel');
controlUnit.connectSignal('memWrite', ram, 'we');
quadRegisters.connectOutput('q1', addrMux, 'input0');
quadRegisters.connectOutput('q1', alu, 'a');
quadRegisters.connectOutput('q2', alu, 'b');
quadRegisters.connectOutput('q1', bcu, 'a');
quadRegisters.connectOutput('q2', bcu, 'b');
alu.connect(addrMux, 'input1');
alu.connect(wbMux, 'input0');
alu.connect(ram, 'dataIn');
ram.connect(wbMux, 'input1');
addrMux.input3 = 0;
wbMux.input3 = 0;
wbMux.connect(quadRegisters, 'd3');

if_id.clk = true;
if_id.clk = false;

clock.connect(pc);
clock.connect(if_id);
clock.connect(quadRegisters);
clock.start();

export { clock, pc, pcMux, pm, if_id, quadRegisters, controlUnit, addrMux, ram, wbMux, alu, bcu };
