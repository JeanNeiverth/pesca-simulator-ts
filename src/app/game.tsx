import Image from "next/image";
import { useResolveSteps } from "@/hooks/useResolveSteps";
import { FishingLine } from "@/components/FishingLine";
import { Rod } from "@/components/Rod";
import { Float } from "@/components/Float";
import { useMinigame } from "@/hooks/useMinigame";
import { MinigameDisplayer } from "./MinigameDisplayer";
import { FishedFrame } from "@/components/FishedFrame";
import { STATUS, STEPS } from "@/hooks/useRodStatus";
import { useThrowingDistance } from "@/hooks/useThrowingDistance";
import { useGlobalVariables } from "@/context/GlobalVariables";
import { ThrowingBar } from "@/components/ThrowingBar";
import { BaitSelector } from "@/components/BaitSelector";
import type { FishingPoint } from "@/utils/fishingPoint";

export function Game({ fishingPoint }: { fishingPoint: FishingPoint }) {
  const { step, status, runTime } = useGlobalVariables();

  const {
    minigame,
    handleMouseUp: minigameMouseUp,
    handleMouseDown: minigameMouseDown,
  } = useMinigame();

  const {
    inMinigame,
    start: startMinigame,
    pointerAngle,
    success,
    refreshSuccess,
  } = minigame;

  const {
    handleMouseUp,
    handleMouseDown,
    fishingLineParams,
    rodParams,
    floatParams,
  } = useResolveSteps({
    startMinigame,
    generateFish: () => {
      return fishingPoint.generateFish();
    },
  });

  const { d } = useThrowingDistance();

  return (
    <>
      <Image
        src={fishingPoint.imageSrc}
        alt=""
        style={{ objectFit: "contain" }}
        onClick={handleMouseUp}
        onMouseDown={handleMouseDown}
      />
      <BaitSelector />
      <FishingLine params={fishingLineParams} />
      <Rod params={rodParams} />
      <Float params={floatParams} />
      {inMinigame && (
        <MinigameDisplayer
          pointerAngle={pointerAngle}
          minigameMouseDown={minigameMouseDown}
          minigameMouseUp={minigameMouseUp}
        />
      )}
      {success && <FishedFrame refreshSuccess={refreshSuccess} />}
      {((step === STEPS.ARM_ROD && runTime) ||
        (status == STATUS.ARMED_ROD && !runTime)) && <ThrowingBar d={d} />}
    </>
  );
}
