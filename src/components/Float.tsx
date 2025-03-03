import Image from "next/image";
import float from "@/images/float.png";

export function Float({
  params,
}: {
  params: {
    x: number;
    y: number;
    blur: number;
    croppedPct: number;
    scale: number;
  };
}) {
  const { x, y, blur, croppedPct, scale } = params;

  const size = (40 * scale).toFixed(2);

  const croppedSize = 40 * scale * (1 - croppedPct / 100);

  return (
    <div
      className="absolute flex justify-center items-start"
      style={{
        maxWidth: `${size}px`,
        maxHeight: `${croppedSize}px`,
        left: `${x}px`,
        top: `${y}px`,
        overflow: "hidden",
      }}
    >
      <Image
        src={float}
        alt=""
        width={Number(size)}
        height={Number(size)}
        style={{
          filter: `blur(${blur}px)`,
          objectFit: "cover",
        }}
      />
    </div>
  );
}
