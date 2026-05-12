import { cp } from './managers/circuit_manager.js';
import LedView from './component-views/led-view.js';

function formatHex(value, width) {
  return `0x${value.toString(16).toUpperCase().padStart(width, '0')}`;
}

function formatBinary(value, width) {
  return `0b${value.toString(2).padStart(width, '0')}`;
}

function drawModule(p, x, y, width, height, label) {
  p.push();
  p.fill('#18181b');
  p.stroke('#52525b');
  p.strokeWeight(1);
  p.rect(x, y, width, height, 6);

  p.noStroke();
  p.fill('#e5e7eb');
  p.textSize(13);
  p.textAlign(p.CENTER, p.CENTER);
  p.text(label, x + width / 2, y + height / 2);
  p.pop();
}

function drawConnection(p, points, color = '#71717a') {
  p.push();
  p.noFill();
  p.stroke(color);
  p.strokeWeight(1.5);

  for (let index = 0; index < points.length - 1; index += 1) {
    p.line(points[index].x, points[index].y, points[index + 1].x, points[index + 1].y);
  }

  const end = points[points.length - 1];
  p.fill(color);
  p.noStroke();
  p.circle(end.x, end.y, 5);
  p.pop();
}

new p5((p) => {
  let container;
  let clockLed;
  let invertedClockLed;

  p.setup = () => {
    container = document.getElementById('sketch-container');
    const canvas = p.createCanvas(container.clientWidth, container.clientHeight);
    canvas.parent(container);
    p.textFont('Arial');

    clockLed = new LedView(42, 346, 'CLK', { onColor: '#facc15' });
    invertedClockLed = new LedView(42, 382, 'CLK', { overbar: true, onColor: '#facc15' });
  };

  p.draw = () => {
    p.background(11, 13, 18);

    const state = cp.snapshot();
    clockLed.setValue(state.clk);
    invertedClockLed.setValue(!state.clk);

    drawConnection(p, [{ x: 126, y: 74 }, { x: 150, y: 74 }]);
    drawConnection(p, [{ x: 250, y: 74 }, { x: 278, y: 74 }]);
    drawConnection(p, [{ x: 378, y: 74 }, { x: 410, y: 74 }]);
    drawConnection(p, [{ x: 510, y: 74 }, { x: 542, y: 74 }]);
    drawConnection(p, [{ x: 642, y: 80 }, { x: 678, y: 112 }, { x: 720, y: 112 }]);
    drawConnection(p, [{ x: 820, y: 112 }, { x: 852, y: 112 }]);
    drawConnection(p, [{ x: 642, y: 146 }, { x: 678, y: 204 }, { x: 720, y: 204 }]);
    drawConnection(p, [{ x: 820, y: 204 }, { x: 852, y: 204 }]);
    drawConnection(p, [{ x: 902, y: 164 }, { x: 902, y: 228 }, { x: 180, y: 228 }, { x: 180, y: 100 }], '#a1a1aa');
    drawConnection(p, [{ x: 466, y: 100 }, { x: 466, y: 132 }], '#facc15');
    drawConnection(p, [{ x: 510, y: 152 }, { x: 560, y: 132 }, { x: 560, y: 104 }], '#facc15');

    drawModule(p, 52, 48, 74, 52, 'PC');
    drawModule(p, 150, 48, 100, 52, 'PC MUX');
    drawModule(p, 278, 48, 100, 52, 'PM');
    drawModule(p, 410, 48, 100, 52, 'IF/ID');
    drawModule(p, 542, 48, 100, 104, 'QUAD\nREGS');
    drawModule(p, 410, 132, 100, 52, 'CONTROL\nUNIT');
    drawModule(p, 720, 86, 100, 52, 'ALU');
    drawModule(p, 720, 178, 100, 52, 'ADDR MUX');
    drawModule(p, 852, 86, 100, 52, 'RAM');
    drawModule(p, 852, 178, 100, 52, 'WB MUX');

    p.push();
    p.noFill();
    p.stroke('#52525b');
    p.strokeWeight(1);
    p.rect(20, 282, 930, 280, 6);

    p.noStroke();
    p.fill('#e5e7eb');
    p.textSize(16);
    p.textAlign(p.CENTER, p.TOP);
    p.text('CPU Control Panel', 485, 292);
    p.pop();

    clockLed.draw(p);
    invertedClockLed.draw(p);

    p.push();
    p.noStroke();
    p.textSize(14);
    p.fill('#e5e7eb');
    p.text('PC', 162, 346);
    p.text('PC MUX', 162, 372);
    p.text('INST', 162, 398);
    p.text('CONTROL', 162, 442);
    p.text('RS1 EN', 162, 468);
    p.text('RS2 EN', 162, 494);
    p.text('RD EN', 162, 520);
    p.text('IMM', 162, 546);
    p.text('RS1 OUT', 362, 346);
    p.text('RS2 OUT', 362, 372);
    p.text('RD OUT', 362, 398);
    p.text('ALU Y', 362, 442);
    p.text('PC SEL', 560, 346);
    p.text('ADDR SEL', 560, 372);
    p.text('WB SEL', 560, 398);
    p.text('MEM READ', 560, 424);
    p.text('MEM WRITE', 560, 450);
    p.text('HALT', 560, 476);
    p.text('ADDR MUX OUT', 760, 346);
    p.text('WB MUX OUT', 760, 372);
    p.text('RAM DATA OUT', 760, 398);

    p.fill('#facc15');
    p.text(formatHex(state.pc, 2), 238, 346);
    p.text(formatHex(state.pmAddr, 2), 238, 372);
    p.text(formatHex(state.inst, 4), 238, 398);
    p.text(formatBinary(state.control, 5), 238, 442);
    p.text(String(state.rs1En), 238, 468);
    p.text(String(state.rs2En), 238, 494);
    p.text(String(state.rdEn), 238, 520);
    p.text(formatHex(state.imm, 2), 238, 546);
    p.text(formatHex(state.rs1, 2), 448, 346);
    p.text(formatHex(state.rs2, 2), 448, 372);
    p.text(formatHex(state.rd, 2), 448, 398);
    p.text(formatHex(state.aluResult, 2), 448, 442);
    p.text(String(state.pcSel), 646, 346);
    p.text(String(state.addrSel), 646, 372);
    p.text(String(state.wbSel), 646, 398);
    p.text(String(Boolean(state.memRead)), 646, 424);
    p.text(String(Boolean(state.memWrite)), 646, 450);
    p.text(String(state.halt), 646, 476);
    p.text(formatHex(state.addressMuxOutput, 2), 882, 346);
    p.text(formatHex(state.wbMuxOutput, 2), 882, 372);
    p.text(formatHex(state.ramDataOut, 2), 882, 398);
    p.pop();
  };

  p.windowResized = () => {
    if (!container) {
      return;
    }

    p.resizeCanvas(container.clientWidth, container.clientHeight);
  };
});
