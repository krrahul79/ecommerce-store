"use client";

import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import Currency from "@/components/ui/currency";
import { Button } from "@/components/ui/button";
import { Product, CartProduct } from "@/types";
import useCart from "@/hooks/use-cart";
import { calculatePercentageDifference } from "@/lib/utils";
import { toast } from "react-hot-toast";

interface InfoProps {
  data: Product;
}

const Info: React.FC<InfoProps> = ({ data }) => {
  console.log("data.childProducts", data.childProducts);
  const cart = useCart();
  const [productId, setProductId] = useState(data._id);
  const [quantity, setQuantity] = useState(1);
  const [newprice, setNewPrice] = useState<string | null>(null);
  const [oldprice, setOldPrice] = useState<string | null>(null);
  const onAddToCart = () => {
    if (data?.isOutOfStock) {
      toast.error("Product out of stock");
    } else {
      const cartProduct: CartProduct = {
        _id: productId,
        name: data.name,
        newprice: newprice || data.newprice,
        calculatesize: data.calculateSize,
        images: data.images,
      };
      if (quantity > 0) {
        cart.addItem({ cartProduct, quantity });
      } else {
        toast("Please increase the quantity");
      }
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleSizeButtonClick = (
    newprice: string,
    oldprice: string,
    productId: string
  ) => {
    setNewPrice(newprice);
    setOldPrice(oldprice);
    setProductId(productId);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
      <div className="mt-3 flex items-end">
        {data?.oldprice && parseFloat(data?.oldprice) > 0 ? (
          <p className="text-xl text-red-500 line-through mr-4">
            <Currency value={oldprice || data.oldprice} />
          </p>
        ) : null}
        <p className="text-2xl text-gray-900 mr-4">
          <Currency value={newprice || data.newprice} />
        </p>

        {data?.oldprice && data?.newprice && parseFloat(data?.oldprice) > 0 ? (
          <p className="text-sm text-gray-500">
            {` Save (${calculatePercentageDifference(
              oldprice || data.oldprice,
              newprice || data.newprice
            ).toFixed(2)}%)`}
          </p>
        ) : null}
      </div>
      {data?.childProducts && data.childProducts.length > 0 ? (
        <div>
          <p className="text-xl mt-5 text-gray-500">{`${data.typeToDisplay}`}</p>
        </div>
      ) : null}
      {/* Display buttons for child products */}
      {data.childProducts && data.childProducts.length > 0 && (
        <div className="mt-5">
          {data.childProducts.map((childProduct) => (
            <Button
              key={childProduct._id}
              onClick={() =>
                handleSizeButtonClick(
                  childProduct.newprice,
                  childProduct.oldprice,
                  childProduct._id
                )
              }
              className="mr-3"
            >
              {childProduct.showSize}
            </Button>
          ))}
        </div>
      )}
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
