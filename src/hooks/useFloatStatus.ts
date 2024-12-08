import { ANIMATION } from "@/constants";
import { useEffect, useState } from "react";
import { PositionEncoder } from "./PositionEncoder";
import {
  STATUS,
  STEPS,
  AnimationStatusType,
  AnimationStepType,
} from "./useRodStatus";

const FLOAT_STATES = [
  {
    id: STATUS.INITIAL,
    x: 1340,
    y: 900,
    croppedPct: 0,
    timeToAchieveMs: 2000,
  },
  {
    id: STATUS.ARMED_ROD,
    x: 2400,
    y: 1100,
    croppedPct: 0,
    timeToAchieveMs: 800,
  },
  {
    id: STATUS.THROWN_ROD_HALF,
    x: 1800,
    y: -150,
    croppedPct: 0,
    timeToAchieveMs: 300,
  },
  {
    id: STATUS.THROWN_ROD,
    x: 1100,
    y: -50,
    croppedPct: 0,
    timeToAchieveMs: 600,
  },
  {
    id: STATUS.THROWN_FLOAT,
    x: 500,
    y: 500,
    croppedPct: 0,
    timeToAchieveMs: 1000,
  },
  {
    id: STATUS.SUNK_FLOAT,
    x: 500,
    y: 500,
    croppedPct: 40,
    timeToAchieveMs: 0,
  },
  {
    id: STATUS.FISH_PULLED_HALF,
    x: 500,
    y: 520,
    croppedPct: 80,
    timeToAchieveMs: 400,
  },
  {
    id: STATUS.FISH_PULLED,
    x: 500,
    y: 500,
    croppedPct: 40,
    timeToAchieveMs: 400,
  },
  {
    id: STATUS.PULLED_ROD_HALF,
    x: 500,
    y: 500,
    croppedPct: 30,
    timeToAchieveMs: 300,
  },
  {
    id: STATUS.PULLED_ROD,
    x: 500,
    y: 500,
    croppedPct: 30,
    timeToAchieveMs: 800,
  },
];

type StepMappingType = {
  id: number;
  x: PositionEncoder;
  y: PositionEncoder;
  croppedPct: PositionEncoder;
};

const stepMapping: StepMappingType[] = FLOAT_STATES.map((state) => {
  const nextState = FLOAT_STATES.filter(
    (_nextState) => _nextState.id === state.id + 1
  )[0];
  if (nextState) {
    return {
      id: state.id + 1,
      x: new PositionEncoder(state.x, nextState.x, nextState.timeToAchieveMs),
      y: new PositionEncoder(state.y, nextState.y, nextState.timeToAchieveMs),
      croppedPct: new PositionEncoder(
        state.croppedPct,
        nextState.croppedPct,
        nextState.timeToAchieveMs
      ),
    };
  } else {
    const state1 = FLOAT_STATES[0];
    return {
      id: state.id + 1,
      x: new PositionEncoder(state.x, state1.x, state1.timeToAchieveMs),
      y: new PositionEncoder(state.y, state1.y, state1.timeToAchieveMs),
      croppedPct: new PositionEncoder(
        state.croppedPct,
        state1.croppedPct,
        state1.timeToAchieveMs
      ),
    };
  }
});

function computeState(
  step: AnimationStepType,
  t: number
): { x: number; y: number; croppedPct: number } {
  const positionMapper = stepMapping.filter(
    (position) => position.id === step
  )[0];
  const x = positionMapper.x.computePosition(t);
  const y = positionMapper.y.computePosition(t);
  const croppedPct = positionMapper.croppedPct.computePosition(t);

  return { x, y, croppedPct };
}

export const useFloatStatus = ({
  status,
  step,
  time,
  runTime,
}: {
  status: AnimationStatusType;
  step: AnimationStepType;
  time: number;
  runTime: boolean;
}): {
  floatX: number;
  floatY: number;
  croppedPct: number;
  timeToEnd: number;
} => {
  const [floatX, setFloatX] = useState(FLOAT_STATES[0].x);
  const [floatY, setFloatY] = useState(FLOAT_STATES[0].y);
  const [croppedPct, setCroppedPct] = useState(FLOAT_STATES[0].croppedPct);
  const [timeToEnd, setTimeToEnd] = useState(0);

  useEffect(() => {
    if (!runTime) {
      setFloatX(FLOAT_STATES[status].x);
      setFloatY(FLOAT_STATES[status].y);
      setCroppedPct(FLOAT_STATES[status].croppedPct);
      return;
    }
    const {
      x: newX,
      y: newY,
      croppedPct: newCroppedPct,
    } = computeState(step, time);

    setFloatX(newX);
    setFloatY(newY);
    setCroppedPct(newCroppedPct);
  }, [status, step, time, runTime]);

  useEffect(() => {
    setTimeToEnd(FLOAT_STATES[step].timeToAchieveMs - time);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  return { floatX, floatY, croppedPct, timeToEnd };
};
