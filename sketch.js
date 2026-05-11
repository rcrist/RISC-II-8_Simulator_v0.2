import LedView from './component-views/led-view.js';

new p5((p) => {
  let container;
  let clockLed;
  let statusLeds;

  p.setup = () => {
    container = document.getElementById('sketch-container');
    const canvas = p.createCanvas(container.clientWidth, container.clientHeight);
    canvas.parent(container);
    p.textFont('Arial');

    clockLed = new LedView(42, 96, 'CLK');
    statusLeds = [
      new LedView(42, 132, 'ZF'),
      new LedView(42, 168, 'BEQF'),
      new LedView(42, 204, 'HALT'),
    ];
  };

  p.draw = () => {
    p.background(11, 13, 18);

    p.noStroke();
    p.fill(238, 242, 247);
    p.textSize(18);
    p.text('RISC-II 8 visual simulator', 24, 34);

    p.fill(170, 179, 194);
    p.textSize(13);
    p.text('p5.js canvas is running. Component views can mount here next.', 24, 58);

    clockLed.setValue(Math.floor(p.frameCount / 30) % 2 === 0);
    statusLeds[0].setValue(true);
    statusLeds[1].setValue(false);
    statusLeds[2].setValue(false);

    clockLed.draw(p);
    for (const led of statusLeds) {
      led.draw(p);
    }
  };

  p.windowResized = () => {
    if (!container) {
      return;
    }

    p.resizeCanvas(container.clientWidth, container.clientHeight);
  };
});
