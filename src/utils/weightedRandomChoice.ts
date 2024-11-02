export function weightedRandomChoice(record: Record<string, number>): string {
  // Calculate the total sum of all chances
  const totalChance = Object.values(record).reduce(
    (sum, chance) => sum + chance,
    0
  );

  // Generate a random number between 0 and totalChance
  let random = Math.random() * totalChance;

  // Iterate over the record to find the weighted choice
  for (const id in record) {
    if (record.hasOwnProperty(id)) {
      random -= record[id];
      if (random <= 0) {
        return id;
      }
    }
  }

  // Fallback in case of any error, though it should never reach here
  throw new Error("Failed to make a weighted random choice");
}
