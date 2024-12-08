import { FishId, BaitId, LocationId, LOCATIONS } from "@/fishes";
import { Bait, Fish } from "@/types";
import { FishingPoint, GetProbabilitiesFn } from "@/utils/fishingPoint";
import { gaussianRandom } from "@/utils/gaussian";
import imageSrc from "./image.png";
import { quadraticConcave, sigmoid } from "@/utils/auxFunctions";

const fishChances = {
  [FishId.CORVINA]: 1,
  [FishId.LAMBARI]: 10,
  [FishId.BAGRE]: 1.5,
};

const baitInfluence = {
  [BaitId.LAMBARI]: {
    [FishId.CORVINA]: 1,
    [FishId.BAGRE]: 1,
  },
  [BaitId.MINHOCA]: {
    [FishId.CORVINA]: 0.25,
    [FishId.BAGRE]: 1,
  },
  [BaitId.RACAO]: {
    [FishId.LAMBARI]: 1,
    [FishId.CORVINA]: 0.1,
    [FishId.BAGRE]: 0.1,
  },
} as const;

const applyBaitInlfuence = (
  fishChances: Record<string, number>,
  baitInfluence: Record<string, number> | undefined
) => {
  const updatedChances: Record<string, number> = {};
  for (const fishId in fishChances) {
    if (baitInfluence && baitInfluence[fishId] !== undefined) {
      updatedChances[fishId] = fishChances[fishId] * baitInfluence[fishId];
    } else {
      updatedChances[fishId] = 0;
    }
  }
  return updatedChances;
};

const distanceInfluence = {
  [FishId.CORVINA]: (d: number) => sigmoid(d, 20),
  [FishId.BAGRE]: (d: number) => quadraticConcave(d),
  [FishId.LAMBARI]: (d: number) => Math.exp(-3 * d),
} as const;

const applyDistanceInfluence = (
  fishChances: Record<string, number>,
  d: number
) => {
  const updatedChances: Record<string, number> = {};
  for (const fishId in fishChances) {
    updatedChances[fishId] =
      fishChances[fishId] * distanceInfluence[fishId as FishId](d);
  }
  return updatedChances;
};

const fishWeights = {
  [FishId.CORVINA]: () => gaussianRandom(0.7, 0.1),
  [FishId.LAMBARI]: () => gaussianRandom(0.05, 0.005),
  [FishId.BAGRE]: () => gaussianRandom(0.8, 0.2),
};

const getProbabilities = ({
  d,
  bait,
}: {
  d: number;
  bait: Bait | undefined;
}) => {
  // 1. Apply bait influence
  const baitInfluencedChances = applyBaitInlfuence(
    fishChances,
    bait && baitInfluence[bait.id]
  );

  // 2. Compute distance influence
  const distanceInfluencedChances = applyDistanceInfluence(
    baitInfluencedChances,
    d
  );

  // 3. Compute bite probability
  const baseBiteProbability = 0.5;
  let sumOfChances = 0;
  let baseSumOfChances = 0;
  for (const key in distanceInfluencedChances) {
    sumOfChances += distanceInfluencedChances[key];
    baseSumOfChances += key in fishChances ? fishChances[key as FishId] : 0;
  }
  const biteProbability1sec =
    (baseBiteProbability * sumOfChances) / baseSumOfChances;

  console.log({
    biteProbability1sec,
    fishChances: distanceInfluencedChances,
    fishWeights: fishWeights,
  });

  return {
    biteProbability1sec,
    fishChances: distanceInfluencedChances,
    fishWeights: fishWeights,
  };
};

const minigameInputMap = {
  [FishId.CORVINA]: (fish: Fish) => {
    return {
      difficulty: 0.1,
      timeToFinish: 10000 * fish.weight,
    };
  },
  [FishId.LAMBARI]: (fish: Fish) => {
    return {
      difficulty: 0.1,
      timeToFinish: 20000 * fish.weight,
    };
  },
  [FishId.BAGRE]: (fish: Fish) => {
    return {
      difficulty: 0.1,
      timeToFinish: 5000 * fish.weight,
    };
  },
};

const portoMendes = LOCATIONS[LocationId.PORTO_MENDES];

export const portoMendesTrapiche = new FishingPoint(
  portoMendes,
  imageSrc,
  getProbabilities,
  minigameInputMap
);
