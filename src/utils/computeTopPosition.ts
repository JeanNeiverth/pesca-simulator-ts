export function computeTopPosition(
  x1: number,
  y1: number,
  height: number,
  width: number,
  angle1: number = 0
) {
  const xc = x1 + width / 2;
  const yc = y1 + height / 2;

  const angleRad = (Math.PI * angle1) / 180;

  const xTop = xc + (Math.sin(angleRad) * height) / 2; // = xc + Math.round((Math.sin(angle) * rodHeight) / 2);
  const yTop = yc - (Math.cos(angleRad) * height) / 2;

  return { xTop, yTop };
}
