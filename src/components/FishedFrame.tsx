import Image from "next/image";
import frameImg from "@/images/moldura.png";
import corvinaImg from "@/images/corvina.png";
import { Button } from "@/components/ui/Button";
export const FishedFrame = ({
  refreshSuccess,
}: {
  refreshSuccess: () => void;
}) => {
  return (
    <div className="absolute top-[160px] left-[460px]">
      <Image
        src={frameImg}
        alt=""
        style={{
          objectFit: "cover",
        }}
      />
      <Image
        src={corvinaImg}
        alt=""
        className="absolute top-[160px] left-[200px]"
      />
      <div className="absolute left-[120px] top-[11px] w-[760px] h-[70px] flex items-center justify-center text-4xl ">
        <span>CORVINA</span>
      </div>

      <div className="absolute left-[385px] top-[81px] w-[230px] h-[28px] flex items-center justify-center text-lg text-gray-100">
        <span>Comum</span>
      </div>

      <div className="absolute left-[230px] top-[173px] w-[200px] flex justify-start items-center text-lg">
        <span>1.256 kg</span>
      </div>

      <div className="absolute left-[565px] top-[173px] w-[200px] flex justify-end items-center text-lg">
        <span>$10.26</span>
      </div>

      <Button className="absolute top-[570px] left-[256px] w-56 h-14 p-3">
        Iscar
      </Button>
      <Button
        className="absolute top-[570px] left-[520px] w-56 h-14 p-3"
        onClick={refreshSuccess}
      >
        Vender
      </Button>
    </div>
  );
};