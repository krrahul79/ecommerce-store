"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Category } from "@/types";

interface CategoryCard {
  data: Category;
}

const CategoryCard: React.FC<CategoryCard> = ({ data }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/category/${data?.id}`);
  };

  return (
    <div onClick={handleClick} className="group cursor-pointer space-y-4">
      {/* Image & actions */}
      <div className="aspect-square rounded-xl bg-gray-100 relative">
        <Image
          src={data.imageUrl}
          alt=""
          fill
          className="aspect-square object-cover rounded-md"
        />
      </div>
      {/* Description */}
      <div>
        <p className="font-semibold text-lg text-center">{data.name}</p>
      </div>
    </div>
  );
};

export default CategoryCard;
