export function randomOccurrenceTime(p: number): number {
  // Generate a random occurrence time based on the probability
  // p (i.e., the probability that the event happens within one second)

  if (p < 0 || p >= 1) {
    throw new Error("p must be between 0 and 1 (exclusive)");
  }

  if (p === 0) return 9254740; // a very long time...

  // Calculate the rate parameter lambda
  const lambdaRate = -Math.log(1 - p);

  // Generate a random occurrence time based on the exponential distribution
  const occurrenceTime = -Math.log(Math.random()) / lambdaRate;

  return occurrenceTime;
}
