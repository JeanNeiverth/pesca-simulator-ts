import type { StaticImageData } from "next/image";
import { FISHES, BAITS } from "./fishes";

export type FishKindId = keyof typeof FISHES;
export type BaitId = keyof typeof BAITS;
export type Rarity = "common" | "rare" | "epic" | "legendary";

export interface FishKind {
  id: string;
  name: string;
  pricePerKg: number;
  rarity: Rarity;
  src: StaticImageData;
}

export interface Fish extends FishKind {
  weight: number;
  price: number;
}

export interface Bait {
  id: string;
  name: string;
  src: StaticImageData;
  price: number;
}

export interface BaitMap {
  id: BaitId;
  eatingCoef: number;
  weightCoef: number;
}

export interface Location {
  id: string;
  name: string;
  x: number;
  y: number;
  src: string;
}
