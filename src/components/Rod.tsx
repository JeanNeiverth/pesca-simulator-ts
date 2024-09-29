import Image from "next/image";
import rod from "../images/vara.png";

export function Rod({
  params,
}: {
  params: {
    x: number;
    y: number;
    angle: number;
    blur: number;
  };
}) {
  const { x, y, angle, blur } = params;

  return (
    <Image
      src={rod}
      alt=""
      className="absolute"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: `rotate(${angle}deg)`,
        filter: `blur(${blur}px)`,
      }}
    />
  );
}
