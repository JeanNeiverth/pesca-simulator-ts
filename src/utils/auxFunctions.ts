export function sigmoid(x: number, k = 1) {
  return 1 / (1 + Math.exp(-x * k));
}

export function quadraticConcave(x: number, p = 0.5, k = 2, c = 1) {
  return -k * (x - p) ** 2 + c;
}
