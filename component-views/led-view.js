class LedView {
  constructor(x, y, label = '', options = {}) {
    this.x = x;
    this.y = y;
    this.label = label;
    this.overbar = Boolean(options.overbar);
    this.onColor = options.onColor || '#ef4444';
    this.offColor = options.offColor || '#3f3f46';
    this.on = false;
  }

  setValue(value) {
    this.on = Boolean(value);
  }

  draw(p) {
    p.push();
    p.fill(this.on ? this.onColor : this.offColor);
    p.circle(this.x, this.y, 18);
    p.fill('#e5e7eb');
    const labelX = this.x + 14;
    const labelY = this.y + 4;
    p.text(this.label, labelX, labelY);

    if (this.overbar) {
      const labelWidth = p.textWidth(this.label);
      p.stroke('#e5e7eb');
      p.strokeWeight(1);
      p.line(labelX, labelY - 12, labelX + labelWidth, labelY - 12);
    }

    p.pop();
  }
}

export default LedView;
