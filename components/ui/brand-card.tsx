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
      <div className="aspect-square rounded-xl bg-gray-100 relative">
        <Image
          src={data.image}
          alt=""
          fill
          className="aspect-square object-cover rounded-md"
        />
      </div>
      {/* Description */}
      <div>
        <p className="font-semibold text-md text-center">{data.name}</p>
      </div>
    </div>
  );
};

export default BrandCard;
