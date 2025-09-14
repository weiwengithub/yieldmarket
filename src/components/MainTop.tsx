import Image from "next/image";
import MainBg1 from "@/assets/images/main-background-1.png";
import MainBg2 from "@/assets/images/main-background-2.png";

export default function MainTop({ page }: { page: string; }) {
  return (
    <div className="mb-[15px] relative">
      <Image src={MainBg1} alt="" className="w-[592px] h-[169px] absolute top-0 right-[77px]"/>
      <Image src={MainBg2} alt="" className="w-[239px] h-[227px] absolute top-[25px] right-[109px]"/>

      <div className="pt-[35px]">
        <h1 className="h-[67px] leading-[67px] text-[55px] font-bold text-[#B2B2B2]">
          <span>Dual-Sided</span>
        </h1>
        <h1 className="h-[67px] leading-[67px] text-[55px] font-bold text-[#B2B2B2]">
          <span className="bg-gradient-orange bg-clip-text text-transparent">OTC</span> <span>Matching System</span>
        </h1>
      </div>

      <div className="mt-[80px] h-[44px] leading-[44px] text-[36px] font-bold">{page === "sell-orders" ? "Sell Orders" : "Buy Orders"}</div>
    </div>
  );
}