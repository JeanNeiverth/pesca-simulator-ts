"use client";

import {
  AnimationStatusType,
  AnimationStepType,
  STATUS,
  STEPS,
} from "@/hooks/useRodStatus";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  type Dispatch,
  useState,
  SetStateAction,
} from "react";

interface GlobalVariablesType {
  time: number;
  startTime: number;
  runTime: boolean;
  status: AnimationStatusType;
  step: AnimationStepType;
  setTime: Dispatch<SetStateAction<number>>;
  setStartTime: Dispatch<SetStateAction<number>>;
  setRunTime: Dispatch<SetStateAction<boolean>>;
  setStatus: Dispatch<SetStateAction<AnimationStatusType>>;
  setStep: Dispatch<SetStateAction<AnimationStepType>>;
}

export const GlobalVariablesContext = createContext({} as GlobalVariablesType);

export function GlobalVariablesContextProvider({
  children,
}: PropsWithChildren) {
  const [time, setTime] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [runTime, setRunTime] = useState(false);
  const [status, setStatus] = useState<AnimationStatusType>(STATUS.INITIAL);
  const [step, setStep] = useState<AnimationStepType>(STEPS.ARM_ROD);

  return (
    <GlobalVariablesContext.Provider
      value={{
        time,
        startTime,
        runTime,
        status,
        step,
        setTime,
        setStartTime,
        setRunTime,
        setStatus,
        setStep,
      }}
    >
      {children}
    </GlobalVariablesContext.Provider>
  );
}

export function useGlobalVariables() {
  const context = useContext(GlobalVariablesContext);
  return context;
}
