import corvinaImg from "@/images/corvina.png";
import lambariImg from "@/images/lambari.png";
import bagreImg from "@/images/bagre.png";
import { FishKind, Location as MapLocation } from "./types";

export enum FishId {
  LAMBARI = "1",
  CORVINA = "2",
  BAGRE = "3",
}

export const FISHES: Record<FishId, FishKind> = {
  [FishId.LAMBARI]: {
    id: FishId.LAMBARI,
    name: "Lambari",
    rarity: "common",
    pricePerKg: 0.1,
    src: lambariImg,
  },
  [FishId.CORVINA]: {
    id: FishId.CORVINA,
    name: "Corvina",
    rarity: "rare",
    pricePerKg: 1,
    src: corvinaImg,
  },
  [FishId.BAGRE]: {
    id: FishId.BAGRE,
    name: "Bagre",
    rarity: "common",
    pricePerKg: 0.5,
    src: bagreImg,
  },
} as const;

export enum BaitId {
  LAMBARI = "1",
}

export const BAITS = {
  [BaitId.LAMBARI]: {
    id: [BaitId.LAMBARI],
    name: "Lambari",
    price: 1,
    src: lambariImg,
  },
} as const;

export enum LocationId {
  PORTO_MENDES = "1",
}

export const LOCATIONS: Record<LocationId, MapLocation> = {
  [LocationId.PORTO_MENDES]: {
    id: LocationId.PORTO_MENDES,
    name: "Porto Mendes",
    x: 600,
    y: 800,
    src: "porto-mendes",
  },
} as const;
