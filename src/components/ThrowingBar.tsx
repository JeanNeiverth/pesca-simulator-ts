import Image from "next/image";
import throwingBarImage from "@/images/throwing-bar.png";

export const ThrowingBar = ({ d }: { d: number | undefined }) => {
  return (
    <>
      <Image
        className="absolute top-[750px] left-[660px]"
        src={throwingBarImage}
        alt=""
      />
      <svg
        style={{
          position: "absolute",
          top: "755px",
          left: `${660 + (d ?? 0) * 585}px`,
        }}
        width="16"
        height="70"
        viewBox="0 0 12 70"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon points="0,20 6,0 12,20" className="fill-border" />
        <rect x="4" y="16" width="4" height="46" className="fill-border" />
        <polygon points="0,50 6,70 12,50" className="fill-border" />
      </svg>
    </>
  );
};
