import { MinigameProps } from "@/hooks/useMinigame";
import type { Fish, Location } from "@/types";
import { Bait, BaitMap, FishKindId } from "@/types";
import { randomOccurrenceTime } from "@/utils/getEventOccuranceTime";
import { weightedRandomChoice } from "./weightedRandomChoice";
import { FISHES, FishId } from "@/fishes";
import { StaticImageData } from "next/image";

export interface GetProbabilitiesReturn {
  biteProbability1sec: number;
  fishChances: Partial<Record<FishKindId, number>>;
  fishWeights: Partial<Record<FishKindId, () => number>>;
}

export interface GetProbabilitiesArgs {
  d?: number;
  bait?: Bait;
}

export interface GenerateFishReturn {
  fishToGet: Fish;
  waitingTime: number;
  minigameInput: MinigameProps;
}

export class FishingPoint {
  constructor(
    public location: Location,
    public imageSrc: StaticImageData,
    public getProbabilities: (
      args?: GetProbabilitiesArgs
    ) => GetProbabilitiesReturn,
    public minigameInputMap: Record<
      Partial<FishId>,
      (fish: Fish) => { difficulty: number; timeToFinish: number }
    >
  ) {}

  generateFish(args?: GetProbabilitiesArgs): GenerateFishReturn {
    const probabilities = args
      ? this.getProbabilities(args)
      : this.getProbabilities();

    const { biteProbability1sec, fishChances, fishWeights } = probabilities;

    // fishToGet
    const fishId = weightedRandomChoice(
      fishChances
    ) as keyof typeof fishChances;
    const fishKind = FISHES[fishId];
    const weight = fishWeights[fishId]!();
    const price = fishKind.pricePerKg * weight;
    const fish = { ...fishKind, weight, price };

    //waitingTime
    const waitingTime = 1000 * randomOccurrenceTime(biteProbability1sec);

    //minigameInput
    const minigameInput: MinigameProps = this.minigameInputMap[fishId]!(fish);

    console.log("computed fish");
    console.log("waitingTime:", waitingTime);
    console.log("fishToGet:", fish.name);
    console.log(
      "minigameInput:",
      minigameInput.difficulty,
      " | ",
      minigameInput.timeToFinish
    );

    return {
      waitingTime,
      fishToGet: fish,
      minigameInput,
    } as GenerateFishReturn;
  }
}
