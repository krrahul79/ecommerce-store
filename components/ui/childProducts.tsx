"use client";

import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import Currency from "@/components/ui/currency";
import Button from "@/components/ui/button";
import { Product } from "@/types";
import useCart from "@/hooks/use-cart";
import { calculatePercentageDifference } from "@/lib/utils";

interface ChildProductProps {
  prod: Product;
}

const Info: React.FC<ChildProductProps> = ({ data }) => {
 
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
      <div className="mt-3 flex items-end">
        {data?.oldprice && (
          <p className="text-xl text-red-500 line-through mr-4">
            <Currency value={data.oldprice} />
          </p>
        )}
        <p className="text-2xl text-gray-900 mr-4">
          <Currency value={data?.newprice} />
        </p>

        {data?.oldprice && data?.newprice && (
          <p className="text-sm text-gray-500">
            {` Save (${calculatePercentageDifference(
              data.oldprice,
              data.newprice
            ).toFixed(2)}%)`}
          </p>
        )}
      </div>
      <div>
        <p className="text-xl mt-5 text-gray-500">{`${data.typeToDisplay}`}</p>
        
      </div>
      <p className="text-xl mt-5 text-gray-500">Quantity</p>
      <div className="flex items-center mt-2">
        <button
          onClick={decreaseQuantity}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-l"
        >
          -
        </button>
        <input
          type="number"
          value={quantity}
          readOnly
          className="px-3 py-1 bg-gray-100 text-gray-900"
        />
        <button
          onClick={increaseQuantity}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-r"
        >
          +
        </button>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-y-6"></div>
      <div className="mt-10 flex items-center gap-x-3">
        <Button onClick={onAddToCart} className="flex items-center gap-x-2">
          Add To Cart
          <ShoppingCart size={20} />
        </Button>
      </div>
    </div>
  );
};

export default Info;
