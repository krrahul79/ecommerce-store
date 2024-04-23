"use client";

import Image from "next/image";
import { MouseEventHandler } from "react";
import { Expand, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

import Currency from "@/components/ui/currency";
import IconButton from "@/components/ui/icon-button";
import usePreviewModal from "@/hooks/use-preview-modal";
import useCart from "@/hooks/use-cart";
import { Product } from "@/types";
import { calculatePercentageDifference } from "@/lib/utils";

interface ProductCard {
  data: Product;
}

const ProductCard: React.FC<ProductCard> = ({ data }) => {
  const previewModal = usePreviewModal();
  const cart = useCart();
  const router = useRouter();

  const handleClick = () => {
    router.push(`/product/${data?._id}`);
  };

  const onPreview: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();

    previewModal.onOpen(data);
  };

  // const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
  //   event.stopPropagation();

  //   cart.addItem(data);
  // };

  return (
    <div
      onClick={handleClick}
      className="bg-white group cursor-pointer rounded-xl border p-3 space-y-4"
    >
      {/* Image & actions */}
      <div className="aspect-square rounded-xl bg-gray-100 relative">
        <Image
          src={data.images?.[0]}
          alt=""
          fill
          className="aspect-square object-cover rounded-md"
        />
        {/* <div className="opacity-0 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
          <div className="flex gap-x-6 justify-center">
            <IconButton
              onClick={onPreview}
              icon={<Expand size={20} className="text-gray-600" />}
            />
            <IconButton
              onClick={onAddToCart}
              icon={<ShoppingCart size={20} className="text-gray-600" />}
            />
          </div>
        </div> */}
      </div>
      {/* Description */}
      <div>
        <p className="font-semibold text-lg">{data.name}</p>
      </div>
      {/* Price & Reiew */}
      <div className="mt-3 flex items-end">
        {data?.oldprice && parseFloat(data.oldprice) > 0 ? (
          <p className="text-xl text-red-500 line-through mr-2">
            <Currency value={data.oldprice} />
          </p>
        ) : null}
        <p className="text-2xl text-gray-900 mr-2">
          <Currency value={data?.newprice} />
        </p>

        {data?.oldprice && data?.newprice && parseFloat(data.oldprice) > 0 ? (
          <p className="text-sm text-gray-500">
            {` Save (${calculatePercentageDifference(
              data.oldprice,
              data.newprice
            ).toFixed(2)}%)`}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default ProductCard;
