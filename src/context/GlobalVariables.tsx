"use client";

import { BaitId, BAITS } from "@/fishes";
import {
  AnimationStatusType,
  AnimationStepType,
  STATUS,
  STEPS,
} from "@/hooks/useRodStatus";
import { BaitWithAmount, UserBaits } from "@/types";
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
  selectedBait: BaitWithAmount | undefined;
  userBaits: UserBaits;
  setTime: Dispatch<SetStateAction<number>>;
  setStartTime: Dispatch<SetStateAction<number>>;
  setRunTime: Dispatch<SetStateAction<boolean>>;
  setStatus: Dispatch<SetStateAction<AnimationStatusType>>;
  setStep: Dispatch<SetStateAction<AnimationStepType>>;
  setSelectedBait: Dispatch<SetStateAction<BaitWithAmount | undefined>>;
  setUserBaits: Dispatch<SetStateAction<UserBaits>>;
}

export const GlobalVariablesContext = createContext({} as GlobalVariablesType);

const initialUserBaits: UserBaits = {
  0: { ...BAITS[BaitId.MINHOCA], amount: 15 },
  1: { ...BAITS[BaitId.LAMBARI], amount: 5 },
  2: { ...BAITS[BaitId.RACAO], amount: 10 },
  3: undefined,
  4: undefined,
  5: undefined,
  6: undefined,
  7: undefined,
  8: undefined,
  9: undefined,
};

export function GlobalVariablesContextProvider({
  children,
}: PropsWithChildren) {
  const [time, setTime] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [runTime, setRunTime] = useState(false);
  const [status, setStatus] = useState<AnimationStatusType>(STATUS.INITIAL);
  const [step, setStep] = useState<AnimationStepType>(STEPS.ARM_ROD);
  const [selectedBait, setSelectedBait] = useState<BaitWithAmount | undefined>(
    undefined
  );
  const [userBaits, setUserBaits] = useState<UserBaits>(initialUserBaits);

  return (
    <GlobalVariablesContext.Provider
      value={{
        time,
        startTime,
        runTime,
        status,
        step,
        selectedBait,
        userBaits,
        setTime,
        setStartTime,
        setRunTime,
        setStatus,
        setStep,
        setSelectedBait,
        setUserBaits,
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
