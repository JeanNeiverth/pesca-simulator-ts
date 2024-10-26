import { useEffect, useState } from "react";
import { ANIMATION } from "@/constants";

export const useThrowingDistance = ({
  isSettingDistance,
}: {
  isSettingDistance: boolean;
}): { d: number | undefined } => {
  const [d, setD] = useState<number | undefined>(undefined);
  const [time, setTime] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [runTime, setRunTime] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!runTime) return;
      setTime(Date.now() - startTime);
    }, ANIMATION.UPDATE_TIME_MS);
    return () => clearInterval(interval);
  }, [startTime, runTime]);

  useEffect(() => {
    if (isSettingDistance) {
      console.log("setting runtime to true");
      setStartTime(Date.now());
      setRunTime(true);
    } else {
      console.log("setting runtime to false");
      setRunTime(false);
    }
  }, [isSettingDistance]);

  useEffect(() => {
    if (isSettingDistance) {
      console.log("setting distance");
      setD(1 - Math.abs(Math.cos(0.001 * time)));
    }
  }, [isSettingDistance, time]);

  return { d };
};
