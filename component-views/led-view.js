class LedView {
  constructor(x, y, label = '') {
    this.x = x;
    this.y = y;
    this.label = label;
    this.on = false;
  }

  setValue(value) {
    this.on = Boolean(value);
  }

  draw(p) {
    p.push();
    p.fill(this.on ? '#ef4444' : '#3f3f46');
    p.circle(this.x, this.y, 18);
    p.fill('#e5e7eb');
    p.text(this.label, this.x + 14, this.y + 4);
    p.pop();
  }
}

export default LedView;