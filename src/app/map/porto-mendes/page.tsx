"use client";

import {Map} from "@/components/Map"
import { LocationId, LOCATIONS } from "@/fishes";
import image from "./image.png";

import type {Location} from "@/types"

const locations = {
  "1": {
    id: "1",
    name: "Trapiche",
    x: 600,
    y: 800,
    src: "porto-mendes/trapiche",
  },
} as const;

export default function Page() {
  return <Map
    image={image}
    locations={Object.values(locations)}
  />;
}