import { useEffect, useState } from "react";
import { ANIMATION } from "@/constants";
import { STATUS, STEPS } from "./useRodStatus";
import { useGlobalVariables } from "@/context/GlobalVariables";

export const useThrowingDistance = (): { d: number | undefined } => {
  const [d, setD] = useState<number | undefined>(undefined);
  const [time, setTime] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [runTime, setRunTime] = useState(false);

  const { status, step, runTime: globalRunTime } = useGlobalVariables();

  const isSettingDistance =
    (step === STEPS.ARM_ROD && globalRunTime) ||
    (status == STATUS.ARMED_ROD && !globalRunTime);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!runTime) return;
      setTime(Date.now() - startTime);
    }, ANIMATION.UPDATE_TIME_MS);
    return () => clearInterval(interval);
  }, [startTime, runTime]);

  useEffect(() => {
    if (isSettingDistance) {
      setStartTime(Date.now());
      setRunTime(true);
    } else {
      setRunTime(false);
    }
  }, [isSettingDistance]);

  useEffect(() => {
    if (isSettingDistance) {
      setD(1 - Math.abs(Math.cos(0.001 * time)) ** 0.9);
    }
  }, [isSettingDistance, time]);

  return { d };
};
