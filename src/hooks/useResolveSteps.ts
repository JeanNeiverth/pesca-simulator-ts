import { useEffect, useState } from "react";
import rod from "../images/vara.png";
import { ANIMATION } from "@/constants";
import { STATUS, STEPS } from "@/hooks/useRodStatus";

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
    step,
    time,
    runTime,
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
        console.log(
          "Triggered 1 second after status change to STATUS.SUNK_FLOAT"
        );
        setStartTime(Date.now());
        setTime(0);
        setRunTime(true);
      }, 1000); // 1 second delay

      // Cleanup the timeout if the component unmounts or the status changes
      return () => clearTimeout(timeoutId);
    }
  }, [status]);

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
      setStatus(STATUS.SUNK_FLOAT);
      setStep(STEPS.FISH_PULL_HALF);
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
      setRunTime(true);
    }
    if (step === STEPS.ARM_ROD) {
      setStartTime(Date.now());
      setTime(0);
      setStatus(STATUS.ARMED_ROD);
      setStep(STEPS.THROW_ROD_HALF);
    }

    console.log("mouseup");
  }

  function handleMouseDown() {
    // Hook fish
    if (Object([STEPS.FISH_PULL_HALF, STEPS.FISH_PULL]).includes(step)) {
      setStartTime(Date.now());
      setTime(0);
      setStatus(STATUS.FISH_PULLED);
      setStep(STEPS.PULL_ROD_HALF);
    }

    console.log("mousedown");
    setRunTime(true);
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
