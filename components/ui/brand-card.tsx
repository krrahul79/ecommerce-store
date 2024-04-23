"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Category, Brand } from "@/types";

interface BrandCard {
  data: Brand;
}

const BrandCard: React.FC<BrandCard> = ({ data }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/brand/${data?._id}`);
  };

  return (
    <div onClick={handleClick} className="group cursor-pointer space-y-4">
      {/* Image & actions */}
      <div className="flex align-center rounded-full overflow-hidden bg-gray-100 relative w-40 h-40">
        <Image
          src={data.image}
          alt=""
          width={100}
          height={100}
          className="object-cover flex align-center w-full h-full"
        />
      </div>
      {/* Description */}
      <div className="text-center">
        <p className="font-semibold text-md">{data.name}</p>
      </div>
    </div>
  );
};

export default BrandCard;
