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
import OutputDecoder from '../modules/output-decoder.js';
import ControlPanel from './control-panel.js';

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
const outputDecoder = new OutputDecoder();
const cp = new ControlPanel();

await load_hex_files();
connect_modules();
clock.start();

function connect_modules() {
    connect_pc();
    connect_pc_mux();
    connect_pm();
    connect_if_id();
    connect_control_unit();
    connect_quad_registers();
    connect_alu();
    connect_ram();
    connect_addr_mux();
    connect_wb_mux();
    init_if_id();
    connect_clk();
}

async function load_hex_files() {
    await Promise.all([
        pm.loadDefaultHexFile(),
        controlUnit.loadDefaultHexFile(),
    ]);
}

function connect_pc() {
    pc.connect(cp, 'pc');
    pc.connect(pcMux, 'input0');
}

function connect_pc_mux() {
    pcMux.sel = 0;
    pcMux.connect(cp, 'pmAddr');
    pcMux.connect(pm, 'address');
}

function connect_pm() {
    pm.connect(if_id, 'd');
    pm.connect(cp, 'inst');
}

function connect_if_id() {
    if_id.we = true;

    if_id.connectField('control', cp, 'control');
    if_id.connectField('rs1En', cp, 'rs1En');
    if_id.connectField('rs2En', cp, 'rs2En');
    if_id.connectField('rdEn', cp, 'rdEn');
    if_id.connectField('imm', cp, 'imm');

    if_id.connectField('rs1En', quadRegisters, 'we1');
    if_id.connectField('rs2En', quadRegisters, 'we2');
    if_id.connectField('rdEn', quadRegisters, 'we3');
    if_id.connectField('control', controlUnit, 'address');
    if_id.connectField('imm', addrMux, 'input2');
    if_id.connectField('imm', wbMux, 'input2');
}

function connect_control_unit() {
    controlUnit.connectSignal('pcSel', cp, 'pcSel');
    controlUnit.connectSignal('addrSel', cp, 'addrSel');
    controlUnit.connectSignal('wbSel', cp, 'wbSel');
    controlUnit.connectSignal('memRead', cp, 'memRead');
    controlUnit.connectSignal('memWrite', cp, 'memWrite');
    controlUnit.connectSignal('halt', cp, 'halt');

    controlUnit.connectSignal('addrSel', addrMux, 'sel');
    controlUnit.connectSignal('wbSel', wbMux, 'sel');
    controlUnit.connectSignal('memWrite', ram, 'we');
    controlUnit.connectSignal('memRead', ram, 're');
    controlUnit.connectSignal('halt', clock, 'halt');
}

function connect_quad_registers() {
    quadRegisters.connectOutput('q1', cp, 'rs1');
    quadRegisters.connectOutput('q2', cp, 'rs2');
    quadRegisters.connectOutput('q3', cp, 'rd');

    quadRegisters.connectOutput('q1', addrMux, 'input0');
    quadRegisters.connectOutput('q1', alu, 'a');
    quadRegisters.connectOutput('q2', alu, 'b');
    quadRegisters.connectOutput('q1', bcu, 'a');
    quadRegisters.connectOutput('q2', bcu, 'b');
}

function connect_alu() {
    alu.connect(cp, 'aluResult');
    alu.connect(addrMux, 'input1');
    alu.connect(wbMux, 'input0');
    alu.connect(ram, 'dataIn');
}

function connect_ram() {
    ram.connect(cp, 'ramDataOut');
    ram.connect(wbMux, 'input1');
}

function connect_addr_mux() {
    addrMux.input3 = 0;
    addrMux.connect(cp, 'addrSel');
    addrMux.connect(ram, 'address');
}

function connect_wb_mux() {
    wbMux.input3 = 0;
    wbMux.connect(cp, 'wbMuxOutput');
    wbMux.connect(quadRegisters, 'writeData');
    wbMux.connect(outputDecoder, 'dataIn');
}

function init_if_id() {
    if_id.clk = true;
    if_id.clk = false;
}

function connect_clk() {
    clock.connect(pc);
    clock.connect(if_id);
    clock.connect(quadRegisters);
    clock.connect(cp);
}

export { clock, pc, pcMux, pm, if_id, quadRegisters, controlUnit, addrMux, ram, wbMux, alu, bcu, outputDecoder, cp };
