import { FishId, LocationId, LOCATIONS } from "@/fishes";
import { Fish } from "@/types";
import { FishingPoint } from "@/utils/fishingPoint";
import { gaussianRandom } from "@/utils/gaussian";
import imageSrc from "./image.png";

const fishChances = {
  [FishId.CORVINA]: 1,
  [FishId.LAMBARI]: 1,
  [FishId.BAGRE]: 1,
};

const fishWeights = {
  [FishId.CORVINA]: () => gaussianRandom(0.7, 0.1),
  [FishId.LAMBARI]: () => gaussianRandom(0.05, 0.005),
  [FishId.BAGRE]: () => gaussianRandom(0.8, 0.2),
};

const getProbabilities = () => {
  return {
    biteProbability1sec: 0.3,
    fishChances: fishChances,
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
