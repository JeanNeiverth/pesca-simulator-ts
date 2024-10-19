import Image from "next/image";
import backgroundImage from "../images/Porto Mendes - Trapiche3.png";
import { useResolveSteps } from "@/hooks/useResolveSteps";
import { FishingLine } from "@/components/FishingLine";
import { Rod } from "@/components/Rod";
import { Float } from "@/components/Float";
import { useMinigame } from "@/hooks/useMinigame";
import { MinigameDisplayer } from "./MinigameDisplayer";

const difficulty = 0.1;
const timeToFinish = 3000;

export function Game() {
  const {
    minigame,
    handleMouseUp: minigameMouseUp,
    handleMouseDown: minigameMouseDown,
  } = useMinigame({ difficulty, timeToFinish });

  const { inMinigame, start: startMinigame, pointerAngle } = minigame;

  const {
    handleMouseUp,
    handleMouseDown,
    fishingLineParams,
    rodParams,
    floatParams,
  } = useResolveSteps({ startMinigame });

  return (
    <>
      <Image
        src={backgroundImage}
        alt=""
        style={{ objectFit: "contain" }}
        onClick={handleMouseUp}
        onMouseDown={handleMouseDown}
      />
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
    </>
  );
}
