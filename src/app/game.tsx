import { useEffect, useState } from "react";
import backgroundImage from "../images/Porto Mendes - Trapiche3.png";
import rod from "../images/vara.png";
import float from "../images/float.png";
import Image from "next/image";
import { ANIMATION } from "@/constants";

import {
  AnimationStatusType,
  AnimationStepType,
  useRodStatus,
} from "@/hooks/useRodStatus";
import { useFloatStatus } from "@/hooks/useFloatStatus";

function computeTopPosition(
  x1: number,
  y1: number,
  height: number,
  width: number,
  angle1: number = 0
) {
  const xc = x1 + width / 2;
  const yc = y1 + height / 2;

  const angleRad = (Math.PI * angle1) / 180;

  const xTop = xc + (Math.sin(angleRad) * height) / 2; // = xc + Math.round((Math.sin(angle) * rodHeight) / 2);
  const yTop = yc - (Math.cos(angleRad) * height) / 2;

  return { xTop, yTop };
}

const FishingLine = ({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) => {
  return (
    <svg
      className="absolute left-0 top-0 pointer-events-none"
      width="1920"
      height="1080"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1={`${x1}`}
        y1={`${y1}`}
        x2={`${x2}`}
        y2={`${y2}`}
        stroke="gray"
        strokeWidth="1"
      />
    </svg>
  );
};

export function Game() {
  const [time, setTime] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [runTime, setRunTime] = useState(false);

  const [status, setStatus] = useState<AnimationStatusType>(0);
  const [step, setStep] = useState<AnimationStepType>(1);
  const { rodX, rodY, rodAngle, rodBlur, timeToEnd } = useRodStatus({
    step,
    time,
    runTime,
  });

  const { floatX, floatY } = useFloatStatus({
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

  function resolveSteps() {
    if (timeToEnd < 0 && step === 1) {
      setRunTime(false);
      setStatus(1);
      setStep(2);

      return;
    }
    if (timeToEnd < 0 && step === 2) {
      setStartTime(Date.now());
      setTime(0);
      setStatus(2);
      setStep(3);
      return;
    }
    if (timeToEnd < 0 && step === 3) {
      setStartTime(Date.now());
      setTime(0);
      setStatus(3);
      setStep(4);
      return;
    }
    if (timeToEnd < 0 && step === 4) {
      setRunTime(false);
      setStatus(4);
      setStep(5);
      return;
    }
    if (timeToEnd < 0 && step === 5) {
      setStartTime(Date.now());
      setTime(0);
      setStatus(5);
      setStep(6);
      return;
    }
    if (timeToEnd < 0 && step === 6) {
      setRunTime(false);
      setStatus(0);
      setStep(1);
      return;
    }
  }

  useEffect(() => {
    console.log("step", step);
    // console.log("time", time);
  }, [step]);

  useEffect(() => {
    if (runTime) {
      setStartTime(Date.now());
      setTime(0);
    }
  }, [runTime]);

  // useEffect(() => {
  //   console.log(time);
  // }, [time]);

  useEffect(() => {
    resolveSteps();
    //console.log(timeToEnd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeToEnd]);

  function handleMouseUp() {
    if (status === 1) {
      setRunTime(true);
    }
    if (step === 1) {
      setStartTime(Date.now());
      setTime(0);
      setStatus(1);
      setStep(2);
    }

    console.log("mouseup");
    //setRunTime(false);
  }

  function handleMouseDown() {
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

  return (
    <>
      <Image
        src={backgroundImage}
        alt=""
        objectFit="contain"
        onClick={handleMouseUp}
        onMouseDown={handleMouseDown}
      />
      <FishingLine x1={xTopRod} y1={yTopRod} x2={xTopFloat} y2={yTopFloat} />
      <Image
        src={rod}
        alt=""
        className="absolute"
        style={{
          left: `${rodX}px`,
          top: `${rodY}px`,
          transform: `rotate(${rodAngle}deg)`,
          filter: `blur(${rodBlur}px)`,
        }}
      />
      <Image
        src={float}
        alt=""
        width="40"
        height="40"
        className="absolute"
        style={{
          left: `${floatX}px`,
          top: `${floatY}px`,
          filter: `blur(${rodBlur}px)`,
        }}
      />
    </>
  );
}
