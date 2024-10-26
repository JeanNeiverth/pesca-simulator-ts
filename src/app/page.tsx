"use client";

import {Map} from "@/components/Map"
import { LOCATIONS } from "@/fishes";
import worldMapImage from "@/images/world-map.png";

export default function Home() {
  return <Map
    image={worldMapImage}
    locations={Object.values(LOCATIONS)}
  />;
}
