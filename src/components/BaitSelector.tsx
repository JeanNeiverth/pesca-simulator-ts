import { BaitWithAmount } from "@/types";
import Image from "next/image";
import clsx from "clsx";
import { BaitIndex, useBaits } from "@/context/Baits";
import { STATUS } from "@/hooks/useRodStatus";
import { useGlobalVariables } from "@/context/GlobalVariables";

export const BaitSelector = () => {
  const { baits, selectedBait } = useBaits();

  return (
    <div className="flex flex-col absolute left-[555px] top-[964px]">
      <span className="relative ml-2 top-[-30px] h-0 text-lg text-yellow-400 font-semibold">
        {selectedBait && selectedBait.name}
      </span>
      <div className="flex w-[820px] h-[92px] items-center justify-start px-[10px]">
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
  const { selectBaitByKey, selectedBaitKey, getBaitByKey } = useBaits();
  const { status } = useGlobalVariables();

  return (
    <div
      className={clsx(
        "relative h-[72px] w-[72px] border-[1px] border-border transition-all",
        { "bg-accent": selectedBaitKey === baitKey },
        {
          "bg-[#969600] cursor-pointer hover:bg-accent": getBaitByKey(baitKey as BaitIndex) !== undefined,
        }
      )}
      onClick={() => {
        if (status === STATUS.INITIAL) selectBaitByKey(baitKey as BaitIndex);
      }}
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
        <div className="absolute top-[48px] w-[64px] text-right text-black font-semibold">
          <span className="text-shadow-md text-shadow-black">
            {bait.amount}
          </span>
        </div>
      )}
    </div>
  );
};
