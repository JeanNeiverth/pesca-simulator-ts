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
  };
}) {
  const { x, y, blur, croppedPct } = params;

  const croppedSize = 40 * (1 - croppedPct / 100);

  return (
    <div
      className="absolute"
      style={{
        maxWidth: "40px",
        maxHeight: `${croppedSize}px`,
        left: `${x}px`,
        top: `${y}px`,
        overflow: "hidden",
      }}
    >
      <Image
        src={float}
        alt=""
        width="40"
        height="40"
        style={{
          filter: `blur(${blur}px)`,
          objectFit: "cover",
        }}
      />
    </div>
  );
}
