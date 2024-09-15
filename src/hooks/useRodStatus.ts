import { ANIMATION } from "@/constants";
import { useEffect, useState } from "react";

export type AnimationStatusType = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type AnimationStepType = 0 | 1 | 2 | 3 | 4 | 5;

class PositionEncoder {
  from: number;
  to: number;
  totalTime: number;

  constructor(from: number, to: number, totalTime: number) {
    this.from = from;
    (this.to = to), (this.totalTime = totalTime);
  }

  computePosition(time: number) {
    if (time > this.totalTime) return this.to;
    return (
      this.from * ((-time + this.totalTime) / this.totalTime) +
      this.to * (time / this.totalTime)
    );
  }
}

const ROD_STATES = [
  {
    id: 1,
    x: 1400,
    y: 300,
    angle: -10,
    timeToAchieveMs: 2000,
  },
  {
    id: 2,
    x: 2400,
    y: 450,
    angle: 60,
    timeToAchieveMs: 800,
  },
  {
    id: 3,
    x: 1000,
    y: 500,
    angle: -50,
    timeToAchieveMs: 300,
  },
  {
    id: 4,
    x: 1400,
    y: 300,
    angle: -10,
    timeToAchieveMs: 600,
  },
  {
    id: 5,
    x: 2400,
    y: 450,
    angle: 60,
    timeToAchieveMs: 300,
  },
  {
    id: 6,
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
    const state1 = ROD_STATES[0];
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
    if (!runTime) return;
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
