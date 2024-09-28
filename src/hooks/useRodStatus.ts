import { ANIMATION } from "@/constants";
import { useEffect, useState } from "react";
import { PositionEncoder } from "./PositionEncoder";

export type AnimationStatusType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type AnimationStepType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export const STATUS = {
  INITIAL: 0,
  ARMED_ROD: 1,
  THROWN_ROD_HALF: 2,
  THROWN_ROD: 3,
  THROWN_FLOAT: 4,
  FISH_PULLED_HALF: 5,
  FISH_PULLED: 6,
  PULLED_ROD_HALF: 7,
  PULLED_ROD: 8,
} as const;

export const STEPS = {
  ARM_ROD: 1,
  THROW_ROD_HALF: 2,
  THROW_ROD: 3,
  THROW_FLOAT: 4,
  FISH_PULL_HALF: 5,
  FISH_PULL: 6,
  PULL_ROD_HALF: 7,
  PULL_ROD: 8,
} as const;

const ROD_STATES = [
  {
    id: STATUS.INITIAL,
    x: 1400,
    y: 300,
    angle: -10,
    timeToAchieveMs: 2000,
  },
  {
    id: STATUS.ARMED_ROD,
    x: 2400,
    y: 450,
    angle: 60,
    timeToAchieveMs: 800,
  },
  {
    id: STATUS.THROWN_ROD_HALF,
    x: 1000,
    y: 500,
    angle: -50,
    timeToAchieveMs: 300,
  },
  {
    id: STATUS.THROWN_ROD,
    x: 1400,
    y: 300,
    angle: -10,
    timeToAchieveMs: 600,
  },
  {
    id: STATUS.THROWN_FLOAT,
    x: 1400,
    y: 300,
    angle: -10,
    timeToAchieveMs: 1000,
  },
  {
    id: STATUS.FISH_PULLED_HALF,
    x: 1397,
    y: 300,
    angle: -10.1,
    timeToAchieveMs: 300,
  },
  {
    id: STATUS.FISH_PULLED,
    x: 1400,
    y: 300,
    angle: -10,
    timeToAchieveMs: 300,
  },
  {
    id: STATUS.PULLED_ROD_HALF,
    x: 2400,
    y: 450,
    angle: 60,
    timeToAchieveMs: 300,
  },
  {
    id: STATUS.PULLED_ROD,
    x: 1400,
    y: 300,
    angle: -10,
    timeToAchieveMs: 800,
  },
];

type StepMappingType = {
  id: number;
  x: PositionEncoder;
  y: PositionEncoder;
  angle: PositionEncoder;
};

const stepMapping: StepMappingType[] = ROD_STATES.map((state) => {
  const nextState = ROD_STATES.filter(
    (_nextState) => _nextState.id === state.id + 1
  )[0];
  if (nextState) {
    return {
      id: state.id + 1,
      x: new PositionEncoder(state.x, nextState.x, nextState.timeToAchieveMs),
      y: new PositionEncoder(state.y, nextState.y, nextState.timeToAchieveMs),
      angle: new PositionEncoder(
        state.angle,
        nextState.angle,
        nextState.timeToAchieveMs
      ),
    };
  } else {
    const state1 = ROD_STATES[0];
    return {
      id: state.id + 1,
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

function computeBlur(rodAngleDiff: number): number {
  return ANIMATION.ROD_BLUR_COEFFICIENT * Math.abs(rodAngleDiff);
}

export const useRodStatus = ({
  step,
  time,
  runTime,
}: {
  step: AnimationStepType;
  time: number;
  runTime: boolean;
}): {
  rodX: number;
  rodY: number;
  rodAngle: number;
  rodBlur: number;
  timeToEnd: number;
} => {
  const [rodX, setRodX] = useState(ROD_STATES[0].x);
  const [rodY, setRodY] = useState(ROD_STATES[0].y);
  const [rodAngle, setRodAngle] = useState(ROD_STATES[0].angle);
  const [rodBlur, setRodBlur] = useState(0);
  const [timeToEnd, setTimeToEnd] = useState(0);

  useEffect(() => {
    if (!runTime) {
      setRodX(ROD_STATES[step - 1].x);
      setRodY(ROD_STATES[step - 1].y);
      setRodAngle(ROD_STATES[step - 1].angle);
      setRodBlur(0);
      return;
    }
    const { x: newX, y: newY, angle: newAngle } = computeXYAngle(step, time);
    const newBlur = computeBlur(newAngle - rodAngle);

    setRodX(newX);
    setRodY(newY);
    setRodAngle(newAngle);
    setRodBlur(newBlur);
  }, [step, time, rodAngle, runTime]);

  useEffect(() => {
    setTimeToEnd(ROD_STATES[step].timeToAchieveMs - time);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  return { rodX, rodY, rodAngle, rodBlur, timeToEnd };
};
