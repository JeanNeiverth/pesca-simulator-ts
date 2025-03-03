export function sigmoid(x: number, k = 1) {
  return 1 / (1 + Math.exp(-x * k));
}

export function quadraticConcave(x: number, p = 0.5, k = 2, c = 1) {
  return -k * (x - p) ** 2 + c;
}

export function relu(x: number) {
  return (x + Math.abs(x)) / 2;
}

export function counter_relu(x: number) {
  return -relu(x - 1);
}

export function saturation(x: number, v = 1) {
  if (v === 0) return 0;
  return v * (relu(x / v) + counter_relu(x / v));
}
