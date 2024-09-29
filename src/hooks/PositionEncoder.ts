export class PositionEncoder {
  from: number;
  to: number;
  totalTime: number;

  constructor(from: number, to: number, totalTime: number) {
    this.from = from;
    (this.to = to), (this.totalTime = totalTime);
  }

  computePosition(time: number) {
    if (time > this.totalTime) return this.to;
    return (
      this.from * ((-time + this.totalTime) / this.totalTime) +
      this.to * (time / this.totalTime)
    );
  }
}
