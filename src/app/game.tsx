import Image from "next/image";
import backgroundImage from "../images/Porto Mendes - Trapiche3.png";
import { useResolveSteps } from "@/hooks/useResolveSteps";
import { FishingLine } from "@/components/FishingLine";
import { Rod } from "@/components/Rod";
import { Float } from "@/components/Float";

export function Game() {
  const {
    handleMouseUp,
    handleMouseDown,
    fishingLineParams,
    rodParams,
    floatParams,
  } = useResolveSteps({});

  return (
    <>
      <Image
        src={backgroundImage}
        alt=""
        style={{ objectFit: "contain" }}
        onClick={handleMouseUp}
        onMouseDown={handleMouseDown}
      />
      <FishingLine params={fishingLineParams} />
      <Rod params={rodParams} />
      <Float params={floatParams} />
    </>
  );
}
