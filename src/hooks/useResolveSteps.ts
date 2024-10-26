import { useEffect, useState } from "react";
import rod from "../images/vara.png";
import { ANIMATION } from "@/constants";
import { STATUS, STEPS } from "@/hooks/useRodStatus";
import useSound from "use-sound";

import {
  AnimationStatusType,
  AnimationStepType,
  useRodStatus,
} from "@/hooks/useRodStatus";
import { useFloatStatus } from "@/hooks/useFloatStatus";

import { computeTopPosition } from "@/utils/computeTopPosition";

export const useResolveSteps = ({
  startMinigame,
}: {
  startMinigame: () => void;
}) => {
  const [time, setTime] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [runTime, setRunTime] = useState(false);

  const [status, setStatus] = useState<AnimationStatusType>(STATUS.INITIAL);
  const [step, setStep] = useState<AnimationStepType>(STEPS.ARM_ROD);
  const { rodX, rodY, rodAngle, rodBlur, timeToEnd } = useRodStatus({
    step,
    time,
    runTime,
  });

  const { floatX, floatY, croppedPct } = useFloatStatus({
    status,
    step,
    time,
    runTime,
  });

  const [playSoundThrowRod] = useSound("/sounds/throw-rod.mp3", {
    volume: 0.1,
  });
  const [playSoundHookFish] = useSound("/sounds/hook-fish.mp3", {
    volume: 0.1,
  });
  const [playSoundWaterSplash] = useSound("/sounds/water-splash.mp3", {
    volume: 0.1,
  });
  const [playSoundWaterDrop] = useSound("/sounds/water-drop.mp3", {
    volume: 0.1,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (!runTime) return;
      setTime(Date.now() - startTime);
    }, ANIMATION.UPDATE_TIME_MS);
    return () => clearInterval(interval);
  }, [startTime, runTime]);

  useEffect(() => {
    if (status === STATUS.SUNK_FLOAT) {
      const timeoutId = setTimeout(() => {
        setStep(STEPS.FISH_PULL_HALF);
        playSoundWaterSplash();
        setStartTime(Date.now());
        setTime(0);
        setRunTime(true);
      }, 1000); // 1 second delay

      // Cleanup the timeout if the component unmounts or the status changes
      return () => clearTimeout(timeoutId);
    }
  }, [status, playSoundWaterSplash]);

  function resolveSteps() {
    if (timeToEnd < 0 && step === STEPS.ARM_ROD) {
      setRunTime(false);
      setStatus(STATUS.ARMED_ROD);
      setStep(STEPS.THROW_ROD_HALF);
      return;
    }
    if (timeToEnd < 0 && step === STEPS.THROW_ROD_HALF) {
      setStartTime(Date.now());
      setTime(0);
      setStatus(STATUS.THROWN_ROD_HALF);
      setStep(STEPS.THROW_ROD);
      return;
    }
    if (timeToEnd < 0 && step === STEPS.THROW_ROD) {
      setStartTime(Date.now());
      setTime(0);
      setStatus(STATUS.THROWN_ROD);
      setStep(STEPS.THROW_FLOAT);
      return;
    }
    if (timeToEnd < 0 && step === STEPS.THROW_FLOAT) {
      setRunTime(false);
      playSoundWaterDrop();
      setStatus(STATUS.SUNK_FLOAT);
      return;
    }
    if (timeToEnd < 0 && step === STEPS.FISH_PULL_HALF) {
      setStartTime(Date.now());
      setTime(0);
      setStatus(STATUS.FISH_PULLED_HALF);
      setStep(STEPS.FISH_PULL);
      return;
    }
    if (timeToEnd < 0 && step === STEPS.FISH_PULL) {
      setRunTime(false);
      setStatus(STATUS.INITIAL);
      setStep(STEPS.ARM_ROD);
      return;
    }
    if (timeToEnd < 0 && step === STEPS.PULL_ROD_HALF) {
      setStartTime(Date.now());
      setTime(0);
      startMinigame();
      setStatus(STATUS.PULLED_ROD_HALF);
      setStep(STEPS.PULL_ROD);
      return;
    }
    if (timeToEnd < 0 && step === STEPS.PULL_ROD) {
      setStatus(STATUS.INITIAL);
      setStep(STEPS.ARM_ROD);
      setRunTime(false);
      return;
    }
  }

  useEffect(() => {
    if (runTime) {
      setStartTime(Date.now());
      setTime(0);
    }
  }, [runTime]);

  useEffect(() => {
    resolveSteps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeToEnd]);

  function handleMouseUp() {
    if (status === STATUS.ARMED_ROD) {
      playSoundThrowRod();
      setRunTime(true);
    }
    if (step === STEPS.ARM_ROD) {
      setStartTime(Date.now());
      setTime(0);
      playSoundThrowRod();
      setStatus(STATUS.ARMED_ROD);
      setStep(STEPS.THROW_ROD_HALF);
    }

    console.log("mouseup");
  }

  function handleMouseDown() {
    // Hook fish
    if (Object([STEPS.FISH_PULL, STEPS.FISH_PULL_HALF]).includes(step)) {
      setStartTime(Date.now());
      setTime(0);
      playSoundHookFish();
      setStatus(STATUS.FISH_PULLED);
      setStep(STEPS.PULL_ROD_HALF);
      setRunTime(true);
    }

    if (step === STEPS.ARM_ROD) {
      setRunTime(true);
    }

    console.log("mousedown");
  }

  const { xTop: xTopRod, yTop: yTopRod } = computeTopPosition(
    rodX,
    rodY,
    rod.height,
    rod.width,
    rodAngle
  );

  const { xTop: xTopFloat, yTop: yTopFloat } = computeTopPosition(
    floatX,
    floatY,
    40,
    40
  );

  const fishingLineParams = {
    x1: xTopRod,
    y1: yTopRod,
    x2: xTopFloat,
    y2: yTopFloat,
  };

  const rodParams = {
    x: rodX,
    y: rodY,
    angle: rodAngle,
    blur: rodBlur,
  };

  const floatParams = {
    x: floatX,
    y: floatY,
    blur: rodBlur,
    croppedPct,
  };

  return {
    handleMouseUp,
    handleMouseDown,
    fishingLineParams,
    rodParams,
    floatParams,
  };
};
