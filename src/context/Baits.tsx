"use client";

import { BaitId, BAITS } from "@/fishes";
import { Bait, BaitWithAmount, UserBaits } from "@/types";
import { createContext, type ReactNode, useContext, useState } from "react";

export type BaitIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | undefined;

interface BaitsContextType {
  baits: UserBaits;
  selectedBaitKey: BaitIndex | undefined;
  selectedBait: BaitWithAmount | undefined;
  addBait: (baitId: BaitId | undefined, amount: number) => void;
  getBaitByBaitId: (id: BaitId) => Bait | undefined;
  getBaitByKey: (key: BaitIndex) => Bait | undefined;
  selectBaitByKey: (key: BaitIndex) => void;
}

const initialUserBaits: UserBaits = [
  { ...BAITS[BaitId.MINHOCA], amount: 15 },
  { ...BAITS[BaitId.LAMBARI], amount: 1 },
  { ...BAITS[BaitId.RACAO], amount: 10 },
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
];

const BaitContext = createContext<BaitsContextType>({} as BaitsContextType);

export const BaitsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [baits, setBaits] = useState<UserBaits>(initialUserBaits);
  const [selectedBait, setSelectedBait] = useState<BaitWithAmount | undefined>(
    undefined
  );
  const [selectedBaitKey, setSelectedBaitKey] = useState<BaitIndex>(undefined);

  const getBaitByBaitId = (id: BaitId) => baits.find((bait) => bait?.id === id);

  const getBaitByKey = (key: BaitIndex) => {
    if (key === undefined) return;
    return baits[key];
  };

  const selectBaitByKey = (key: BaitIndex) => {
    if (key !== selectedBaitKey) {
      setSelectedBaitKey(key as BaitIndex);
      setSelectedBait(key !== undefined ? baits[key] : undefined);
    } else {
      setSelectedBaitKey(undefined);
      setSelectedBait(undefined);
    }
  };

  const addBait = (baitId: BaitId | undefined, amount: number) => {
    if (!baitId) return
    if (!Number.isInteger(amount))
      throw new Error("Unexpected Error: bait amount must be an integer!");

    const currentKey = baits.findIndex((bait) => bait?.id === baitId);

    const currentAmount = currentKey === -1 ? 0 : baits[currentKey]!.amount;

    if (amount < 0 && currentAmount < Math.abs(amount))
      throw new Error(
        "Unexpected Error: cannot remove more baits than currently owned!"
      );

    const newAmount = currentAmount + amount;

    const key =
      currentKey === -1
        ? baits.findIndex((bait) => bait === undefined)
        : currentKey;

    if (key !== -1) {
      setBaits((baits) => {
        const newBaits = baits;
        newBaits[key] =
          newAmount === 0 ? undefined : { ...baits[key]!, amount: newAmount };
        return newBaits;
      });
    }
  };

  return (
    <BaitContext.Provider
      value={{
        baits,
        selectedBaitKey,
        selectedBait,
        addBait,
        getBaitByBaitId,
        getBaitByKey,
        selectBaitByKey,
      }}
    >
      {children}
    </BaitContext.Provider>
  );
};

export const useBaits = (): BaitsContextType => {
  const context = useContext(BaitContext);
  if (!context) throw new Error("useBaits must be used within a BaitsProvider");
  return context;
};
