"use client";

import { useWindowSize } from "@react-hook/window-size";
const WIDTH = 1920;
const HEIGHT = 1080;

import { useEffect, useState } from "react";
import { ANIMATION } from "@/constants";
import backgroundImage from "../images/Porto Mendes - Trapiche3.png";
import rod from "../images/vara.png";
import Image from "next/image";
import {
  AnimationStatusType,
  AnimationStepType,
  useRodStatus,
} from "@/hooks/useRodStatus";

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

export default function Home() {
  const [time, setTime] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [runTime, setRunTime] = useState(false);
  const [scale, setScale] = useState(1);
  const [windowWidth, windowHeight] = useWindowSize();
  const [status, setStatus] = useState<AnimationStatusType>(0);
  const [step, setStep] = useState<AnimationStepType>(1);
  const { rodX, rodY, rodAngle, rodBlur, timeToEnd } = useRodStatus({
    step,
    time,
    runTime,
  });

  useEffect(() => {
    const screenProportion = windowWidth / windowHeight;
    const scaleValue =
      screenProportion < WIDTH / HEIGHT
        ? windowWidth / WIDTH
        : windowHeight / HEIGHT;
    setScale(scaleValue);
  }, [windowWidth, windowHeight]);

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
      setRunTime(false);
      setStatus(3);
      setStep(4);
      return;
    }
    if (timeToEnd < 0 && step === 4) {
      setStartTime(Date.now());
      setTime(0);
      setStatus(4);
      setStep(5);
      return;
    }
    if (timeToEnd < 0 && step === 5) {
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

  return (
    <main className="overflow-hidden w-screen h-screen bg-black flex items-center justify-center">
      <div
        style={{
          width: WIDTH,
          minWidth: WIDTH,
          height: HEIGHT,
          minHeight: HEIGHT,
          transform: `scale(${scale})`,
          overflow: "hidden",
        }}
      >
        <Image
          src={backgroundImage}
          alt=""
          objectFit="contain"
          onClick={handleMouseUp}
          onMouseDown={handleMouseDown}
        />
        <FishingLine x1={rodX} y1={rodY} x2={500} y2={500} />
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
      </div>
    </main>
  );
}
