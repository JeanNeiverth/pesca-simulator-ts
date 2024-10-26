import Image from "next/image";
import backgroundImage from "../images/Porto Mendes - Trapiche3.png";
import { useResolveSteps } from "@/hooks/useResolveSteps";
import { FishingLine } from "@/components/FishingLine";
import { Rod } from "@/components/Rod";
import { Float } from "@/components/Float";
import { useMinigame } from "@/hooks/useMinigame";
import { MinigameDisplayer } from "./MinigameDisplayer";
import { FishedFrame } from "@/components/FishedFrame";
import { STATUS, STEPS } from "@/hooks/useRodStatus";
import throwingBarImage from "@/images/throwing-bar.png";
import { useThrowingDistance } from "@/hooks/useThrowingDistance";

const difficulty = 0.1;
const timeToFinish = 3000;

export function Game() {
  const {
    minigame,
    handleMouseUp: minigameMouseUp,
    handleMouseDown: minigameMouseDown,
  } = useMinigame({ difficulty, timeToFinish });

  const {
    inMinigame,
    start: startMinigame,
    pointerAngle,
    success,
    refreshSuccess,
  } = minigame;

  const {
    step,
    status,
    runTime,
    time,
    handleMouseUp,
    handleMouseDown,
    fishingLineParams,
    rodParams,
    floatParams,
  } = useResolveSteps({ startMinigame });

  const isSettingDistance =
    (step === STEPS.ARM_ROD && runTime) ||
    (status == STATUS.ARMED_ROD && !runTime);

  const { d } = useThrowingDistance({ isSettingDistance });

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
      {success && <FishedFrame refreshSuccess={refreshSuccess} />}
      {((step === STEPS.ARM_ROD && runTime) ||
        (status == STATUS.ARMED_ROD && !runTime)) && (
        <>
          <Image
            className="absolute top-[750px] left-[660px]"
            src={throwingBarImage}
            alt=""
          />
          <p className="absolute top-[450px] left-[660px]">d: {d}</p>
          <svg
            style={{
              position: "absolute",
              top: "755px",
              left: `${660 + (d ?? 0) * 585}px`,
            }}
            width="16"
            height="70"
            viewBox="0 0 12 70"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon points="0,20 6,0 12,20" className="fill-border" />
            <rect x="4" y="16" width="4" height="46" className="fill-border" />
            <polygon points="0,50 6,70 12,50" className="fill-border" />
          </svg>
        </>
      )}
    </>
  );
}
