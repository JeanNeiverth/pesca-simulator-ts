"use client";

import { MinigameProps } from "@/hooks/useMinigame";
import {
  AnimationStatusType,
  AnimationStepType,
  STATUS,
  STEPS,
} from "@/hooks/useRodStatus";
import { Fish } from "@/types";
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
  fish: Fish | undefined;
  minigameInput: MinigameProps;
  waitingTime: number;
  setTime: Dispatch<SetStateAction<number>>;
  setStartTime: Dispatch<SetStateAction<number>>;
  setRunTime: Dispatch<SetStateAction<boolean>>;
  setStatus: Dispatch<SetStateAction<AnimationStatusType>>;
  setStep: Dispatch<SetStateAction<AnimationStepType>>;
  setFish: Dispatch<SetStateAction<Fish | undefined>>;
  setMinigameInput: Dispatch<SetStateAction<MinigameProps>>;
  setWaitingTime: Dispatch<SetStateAction<number>>;
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
  const [fish, setFish] = useState<Fish | undefined>(undefined);
  const [minigameInput, setMinigameInput] = useState<MinigameProps>({
    difficulty: 1,
    timeToFinish: 3000,
  });
  const [waitingTime, setWaitingTime] = useState<number>(0);

  return (
    <GlobalVariablesContext.Provider
      value={{
        time,
        startTime,
        runTime,
        status,
        step,
        fish,
        minigameInput,
        waitingTime,
        setTime,
        setStartTime,
        setRunTime,
        setStatus,
        setStep,
        setFish,
        setMinigameInput,
        setWaitingTime,
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
