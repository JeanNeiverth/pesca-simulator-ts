"use client";

import { useWindowSize } from "@react-hook/window-size";
import { Game } from "./game";
const WIDTH = 1920;
const HEIGHT = 1080;

import { useEffect, useState } from "react";

export default function Home() {
  const [scale, setScale] = useState(1);
  const [windowWidth, windowHeight] = useWindowSize();

  useEffect(() => {
    const screenProportion = windowWidth / windowHeight;
    const scaleValue =
      screenProportion < WIDTH / HEIGHT
        ? windowWidth / WIDTH
        : windowHeight / HEIGHT;
    setScale(scaleValue);
  }, [windowWidth, windowHeight]);

  return (
    <main className="overflow-hidden w-screen h-screen bg-black flex items-center justify-center">
      <div
        style={{
          width: WIDTH,
          minWidth: WIDTH,
          height: HEIGHT,
          minHeight: HEIGHT,
          transform: `scale(${scale})`,
          overflow: "hidden",
        }}
      >
        <Game />
      </div>
    </main>
  );
}
