export class Linalg {
  /**
   * Multiply two matrices represented as arrays of arrays.
   *
   * @param a First matrix
   * @param b Second matrix
   * @returns Resulting matrix
   * @throws Error If matrices cannot be multiplied due to incompatible dimensions
   */
  static matmul(a: number[][], b: number[][]): number[][] {
    // Get dimensions
    const a_rows = a.length;
    const a_cols = a[0].length;
    const b_rows = b.length;
    const b_cols = b[0].length;

    // Check if multiplication is possible
    if (a_cols !== b_rows) {
      throw new Error(
        `Cannot multiply matrices of dimensions (${a_rows}x${a_cols}) and (${b_rows}x${b_cols})`
      );
    }

    // Initialize result matrix with zeros
    const result: number[][] = Array(a_rows)
      .fill(0)
      .map(() => Array(b_cols).fill(0));

    // Perform matrix multiplication
    for (let i = 0; i < a_rows; i++) {
      for (let j = 0; j < b_cols; j++) {
        for (let k = 0; k < a_cols; k++) {
          result[i][j] += a[i][k] * b[k][j];
        }
      }
    }

    return result;
  }
}

export class CardinalSpline {
  private matrix: number[][];
  private points: number[];
  private times: number[];
  private n_steps: number;

  constructor(points: number[], times: number[], s: number = 0.5) {
    if (points.length < 2) {
      throw new Error("there must be at least 2 points");
    }
    if (times.length !== points.length - 1) {
      throw new Error("len(times) must be equal len(points) - 1");
    }

    this.matrix = [
      [0, 1, 0, 0],
      [-s, 0, s, 0],
      [2 * s, s - 3, 3 - 2 * s, -s],
      [-s, 2 - s, s - 2, s],
    ];

    this.points = [...points]; // Create a copy of points array
    this.points.unshift(2 * points[0] - points[1]); // Insert at beginning
    this.points.push(2 * points[points.length - 1] - points[points.length - 2]);
    this.times = times;
    this.n_steps = times.length;
  }

  private get_step(t: number): number {
    let step = 0;
    let i_previous = -1;
    let i_next = 0;

    while (true) {
      if (i_next >= this.n_steps - 1) {
        return step;
      }
      if (i_previous === -1) {
        if (0 <= t && t < this.times[i_next]) {
          return step;
        }
      } else {
        if (this.times[i_previous] <= t && t < this.times[i_next]) {
          return step;
        }
      }
      i_previous += 1;
      i_next += 1;
      step += 1;
    }
  }

  compute(t: number): number {
    if (t < 0) {
      return this.points[1];
    }
    if (t > this.times[this.times.length - 1]) {
      return this.points[this.points.length - 2];
    }

    const step = this.get_step(t);
    const time_so_far = step > 0 ? this.times[step - 1] : 0;
    const duration = this.times[step] - time_so_far;

    // relative time for that step (between 0 and 1)
    const tr = (t - time_so_far) / duration;

    const T = [[1, tr, tr ** 2, tr ** 3]];
    const P: number[][] = this.points.slice(step, step + 4).map((p) => [p]);

    return Linalg.matmul(Linalg.matmul(T, this.matrix), P)[0][0];
  }

  compute_many(t: number[]): number[] {
    return t.map((ti) => this.compute(ti));
  }
}
