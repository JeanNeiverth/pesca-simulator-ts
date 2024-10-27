import { Bait, BaitWithAmount, UserBaits } from "@/types";
import Image from "next/image";
import { BaitId, BAITS } from "@/fishes";
import { useGlobalVariables } from "@/context/GlobalVariables";
import clsx from "clsx";

export const BaitSelector = () => {
  const { selectedBait, setSelectedBait, userBaits, setUserBaits } =
    useGlobalVariables();
  const baits = Object.values(userBaits);

  return (
    <div className="flex flex-col absolute left-[555px] top-[964px]">
      <span className="relative ml-2 top-[-30px] h-0 text-lg text-yellow-400 font-semibold">
        {selectedBait && selectedBait.name}
      </span>
      <div className="flex w-[820px] h-[92px] items-center justify-start px-[10px] gap-[10px] bg-primary border-2 border-border rounded-xl">
        {baits.map((bait, idx) => (
          <BaitContainer key={idx} bait={bait} baitKey={idx} />
        ))}
      </div>
    </div>
  );
};

const BaitContainer = ({
  bait,
  baitKey,
}: {
  bait?: BaitWithAmount;
  baitKey: number;
}) => {
  const { selectedBait, setSelectedBait } = useGlobalVariables();

  return (
    <div
      className={clsx(
        "relative h-[72px] w-[72px] bg-[#969600] border border-border rounded-md hover:bg-accent cursor-pointer",
        { "bg-accent": selectedBait && bait && selectedBait?.id === bait?.id }
      )}
      onClick={() => setSelectedBait(bait)}
    >
      {bait && (
        <Image
          alt=""
          src={bait.src}
          width={64}
          height={64}
          className="absolute top-1 left-1"
        />
      )}
      {bait && (
        <div className="absolute top-[48px] w-[64px] text-right text-blue-950 font-semibold">
          <span>{bait.amount}</span>
        </div>
      )}
      {bait && (
        <div className="absolute top-[-2px] left-[4px] w-[64px] text-left">
          <span>{baitKey}</span>
        </div>
      )}
    </div>
  );
};
