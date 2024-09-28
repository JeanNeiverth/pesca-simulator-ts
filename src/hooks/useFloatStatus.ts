import { ANIMATION } from "@/constants";
import { useEffect, useState } from "react";
import { PositionEncoder } from "./PositionEncoder";
import { AnimationStatusType, AnimationStepType } from "./useRodStatus";

const FLOAT_STATES = [
  {
    id: 1,
    x: 1340,
    y: 900,
    angle: 0,
    timeToAchieveMs: 2000,
  },
  {
    id: 2,
    x: 2400,
    y: 1100,
    angle: 0,
    timeToAchieveMs: 800,
  },
  {
    id: 3,
    x: 1800,
    y: -150,
    angle: 0,
    timeToAchieveMs: 300,
  },
  {
    id: 4,
    x: 1100,
    y: -50,
    angle: 0,
    timeToAchieveMs: 600,
  },
  {
    id: 5,
    x: 500,
    y: 500,
    angle: 0,
    timeToAchieveMs: 1000,
  },
  {
    id: 6,
    x: 500,
    y: 500,
    angle: 0,
    timeToAchieveMs: 300,
  },
  {
    id: 7,
    x: 500,
    y: 500,
    angle: 0,
    timeToAchieveMs: 800,
  },
];

type StepMappingType = {
  id: number;
  x: PositionEncoder;
  y: PositionEncoder;
  angle: PositionEncoder;
};

const stepMapping: StepMappingType[] = FLOAT_STATES.map((state) => {
  const nextState = FLOAT_STATES.filter(
    (_nextState) => _nextState.id === state.id + 1
  )[0];
  if (nextState) {
    return {
      id: state.id,
      x: new PositionEncoder(state.x, nextState.x, nextState.timeToAchieveMs),
      y: new PositionEncoder(state.y, nextState.y, nextState.timeToAchieveMs),
      angle: new PositionEncoder(
        state.angle,
        nextState.angle,
        nextState.timeToAchieveMs
      ),
    };
  } else {
    const state1 = FLOAT_STATES[0];
    return {
      id: state.id,
      x: new PositionEncoder(state.x, state1.x, state1.timeToAchieveMs),
      y: new PositionEncoder(state.y, state1.y, state1.timeToAchieveMs),
      angle: new PositionEncoder(
        state.angle,
        state1.angle,
        state1.timeToAchieveMs
      ),
    };
  }
});

function computeXYAngle(
  step: number,
  t: number
): { x: number; y: number; angle: number } {
  const positionMapper = stepMapping.filter(
    (position) => position.id === step
  )[0];
  const x = positionMapper.x.computePosition(t);
  const y = positionMapper.y.computePosition(t);
  const angle = positionMapper.angle.computePosition(t);
  return { x, y, angle };
}

function computeBlur(floatAngleDiff: number): number {
  return ANIMATION.ROD_BLUR_COEFFICIENT * Math.abs(floatAngleDiff);
}

export const useFloatStatus = ({
  step,
  time,
  runTime,
}: {
  step: AnimationStepType;
  time: number;
  runTime: boolean;
}): {
  floatX: number;
  floatY: number;
  floatAngle: number;
  floatBlur: number;
  timeToEnd: number;
} => {
  const [floatX, setRodX] = useState(FLOAT_STATES[0].x);
  const [floatY, setRodY] = useState(FLOAT_STATES[0].y);
  const [floatAngle, setRodAngle] = useState(FLOAT_STATES[0].angle);
  const [floatBlur, setRodBlur] = useState(0);
  const [timeToEnd, setTimeToEnd] = useState(0);

  useEffect(() => {
    if (!runTime) return;
    const { x: newX, y: newY, angle: newAngle } = computeXYAngle(step, time);
    const newBlur = computeBlur(newAngle - floatAngle);

    setRodX(newX);
    setRodY(newY);
    setRodAngle(newAngle);
    setRodBlur(newBlur);
  }, [step, time, floatAngle, runTime]);

  useEffect(() => {
    setTimeToEnd(FLOAT_STATES[step].timeToAchieveMs - time);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  return { floatX, floatY, floatAngle, floatBlur, timeToEnd };
};
