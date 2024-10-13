"use client";

import Image from "next/image";
import analogueReader from "../images/fisgou.png";
import pointer from "../images/ponteiro.png";

function getPointerCoordsByAngle({
  pointerAngle,
  deltaY,
}: {
  pointerAngle: number;
  deltaY: number;
}) {
  const h = pointer.height;
  const w = pointer.width;

  const angleRad = (Math.PI * pointerAngle) / 180;

  const x = 450 - w / 2 + deltaY * Math.sin(angleRad);
  const y = 498 - h / 2 - deltaY * Math.cos(angleRad);
  const angle = pointerAngle;
  return { x, y, angle };
}

interface MinigameDisplayerProps {
  pointerAngle: number;
  minigameMouseUp: () => void;
  minigameMouseDown: () => void;
}

export function MinigameDisplayer(props: MinigameDisplayerProps) {
  const { pointerAngle, minigameMouseUp, minigameMouseDown } = props;

  const { x, y, angle } = getPointerCoordsByAngle({
    pointerAngle: pointerAngle ?? 0,
    deltaY: 115,
  });

  return (
    <div
      className="absolute"
      onMouseUp={minigameMouseUp}
      onMouseDown={minigameMouseDown}
      style={{ left: "510px", top: "240px" }}
    >
      <Image src={analogueReader} alt="" />
      <Image
        src={pointer}
        alt=""
        className="absolute"
        style={{
          left: `${x}px`,
          top: `${y}px`,
          transform: `rotate(${angle}deg)`,
        }}
      />
    </div>
  );
}
