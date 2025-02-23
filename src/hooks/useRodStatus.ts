import { ANIMATION } from "@/constants";
import { useEffect, useState } from "react";
import { CardinalSpline } from "@/libs/cardinal-spline";
import Papa from "papaparse";

export type AnimationStatusType = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type AnimationStepType = 1 | 2 | 3 | 4 | 5 | 6;

export const STATUS = {
  INITIAL: 0,
  ARMED_ROD: 1,
  THROWN_ROD: 2,
  THROWN_FLOAT: 3,
  SUNK_FLOAT: 4,
  FISH_PULLED: 5,
  PULLED_ROD: 6,
} as const;

export const STEPS = {
  ARM_ROD: 1,
  THROW_ROD: 2,
  THROW_FLOAT: 3,
  SINK_FLOAT: 4,
  FISH_PULL: 5,
  PULL_ROD: 6,
} as const;

type AnimationDataRow = {
  status: AnimationStatusType;
  step: AnimationStepType;
  rodX: number;
  rodY: number;
  rodAngle: number;
  floatX: number;
  floatY: number;
  floatCroppedPct: number;
  durationMs: number;
};

type StepMappingType = {
  step: number;
  rodX: CardinalSpline;
  rodY: CardinalSpline;
  rodAngle: CardinalSpline;
  floatX: CardinalSpline;
  floatY: CardinalSpline;
  floatCroppedPct: CardinalSpline;
};

const stepMappingTypeKeys = [
  "rodX",
  "rodY",
  "rodAngle",
  "floatX",
  "floatY",
  "floatCroppedPct",
] as const;

const animationData = `status,step,rodX,rodY,rodAngle,floatX,floatY,floatCroppedPct,durationMs
0,1,1400,300,-10,1340,900,0,800
,1,2400,450,60,2400,1100,0,800
1,2,2400,450,60,2400,1100,0,900
,2,1000,500,-50,1800,-1000,0,500
,2,1400,300,-10,1200,-50,0,900
2,3,1400,300,-10,1200,-50,0,600
,3,1400,300,-10,800,500,0,600
3,4,1400,300,-10,800,500,0,1000
,4,1400,300,-10,800,500,40,1000
4,5,1400,300,-10,800,500,40,800
,5,1397,300,-10.1,800,520,80,400
,5,1400,300,-10,800,500,40,800
5,6,1400,300,-10,800,500,40,1100
,6,2400,450,60,800,500,30,300
,6,1400,300,-10,800,500,30,1100`;

const parsedData = Papa.parse<AnimationDataRow>(animationData, {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
}).data;

function parseAnimationStatus(): Omit<AnimationDataRow, "step">[] {
  // Filter only rows where status is not empty/null
  const mainStates = parsedData.filter((row: any) => {
    return row.status !== null && row.status !== "";
  });

  // Convert to animation states format
  const animationStatus = mainStates.map((row: AnimationDataRow) => ({
    status: row.status,
    rodX: row.rodX,
    rodY: row.rodY,
    rodAngle: row.rodAngle,
    floatX: row.floatX,
    floatY: row.floatY,
    floatCroppedPct: row.floatCroppedPct,
    durationMs: row.durationMs,
  }));

  return animationStatus;
}

function parseAnimationSteps(): StepMappingType[] {
  const numberOfSteps = parsedData.at(-1)!.step;

  let animationSteps = [] as StepMappingType[];
  let i = 1;
  while (i <= numberOfSteps) {
    const splineSteps = parsedData.filter((row) => row.step === i);

    let animationStep = {} as StepMappingType;
    animationStep.step = i;
    for (const key of stepMappingTypeKeys) {
      const points = [] as number[];
      const times = [] as number[];
      for (let k = 0; k < splineSteps.length; k++) {
        points.push(splineSteps[k][key]);
        if (k != 0) times.push(splineSteps[k].durationMs);
      }
      animationStep[key] = new CardinalSpline(points, times);
    }
    animationSteps.push(animationStep);
    i = i + 1;
  }

  return animationSteps;
}

const animationStatus = parseAnimationStatus();
const animationSteps = parseAnimationSteps();

console.log({ animationStatus, animationSteps });

function computeSplineOutputs(
  step: number,
  t: number
): Record<(typeof stepMappingTypeKeys)[number], number> {
  const stepMapping = animationSteps.filter(
    (stepMapping) => stepMapping.step === step
  )[0];
  const result = {} as Record<(typeof stepMappingTypeKeys)[number], number>;
  for (const key of stepMappingTypeKeys) {
    result[key] = stepMapping[key].compute(t);
  }
  return result;
}

function computeBlur(rodAngleDiff: number): number {
  return ANIMATION.ROD_BLUR_COEFFICIENT * Math.abs(rodAngleDiff);
}

export const useRodStatus = ({
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
  rodX: number;
  rodY: number;
  rodAngle: number;
  rodBlur: number;
  floatX: number;
  floatY: number;
  floatCroppedPct: number;
  timeToEnd: number;
} => {
  const [rodX, setRodX] = useState(animationStatus[0].rodX);
  const [rodY, setRodY] = useState(animationStatus[0].rodY);
  const [rodAngle, setRodAngle] = useState(animationStatus[0].rodAngle);
  const [rodBlur, setRodBlur] = useState(0);
  const [floatX, setFloatX] = useState(animationStatus[0].floatX);
  const [floatY, setFloatY] = useState(animationStatus[0].floatY);
  const [floatCroppedPct, setFloatCroppedPct] = useState(
    animationStatus[0].floatCroppedPct
  );
  const [timeToEnd, setTimeToEnd] = useState(0);

  useEffect(() => {
    if (!runTime) {
      setRodX(animationStatus[status].rodX);
      setRodY(animationStatus[status].rodY);
      setRodAngle(animationStatus[status].rodAngle);
      setRodBlur(0);
      setFloatX(animationStatus[status].floatX);
      setFloatY(animationStatus[status].floatY);
      setFloatCroppedPct(animationStatus[status].floatCroppedPct);
      return;
    }
    const result = computeSplineOutputs(step, time);
    const newBlur = computeBlur(result.rodAngle - rodAngle);

    setRodX(result.rodX);
    setRodY(result.rodY);
    setRodAngle(result.rodAngle);
    setRodBlur(newBlur);
    setFloatX(result.floatX);
    setFloatY(result.floatY);
    setFloatCroppedPct(result.floatCroppedPct);
  }, [status, step, time, rodAngle, runTime]);

  useEffect(() => {
    setTimeToEnd(animationStatus[status].durationMs - time);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  return {
    rodX,
    rodY,
    rodAngle,
    rodBlur,
    floatX,
    floatY,
    floatCroppedPct,
    timeToEnd,
  };
};
