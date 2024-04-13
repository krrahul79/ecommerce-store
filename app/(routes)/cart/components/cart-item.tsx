import Image from "next/image";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";

import IconButton from "@/components/ui/icon-button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { Cart, CartProduct, Product } from "@/types";

interface CartItemProps {
  data: Cart;
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {
  const cart = useCart();

  const onRemove = () => {
    cart.removeItem(data.cartProduct._id);
  };

  const decreaseQuantity = () => {
    cart.reduceItem(data.cartProduct._id);
  };

  const increaseQuantity = () => {
    cart.increaseItem(data.cartProduct._id);
  };

  return (
    <li className="flex py-6 border-b">
      <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-48 sm:w-48">
        <Image
          fill
          src={data.cartProduct.images[0]}
          alt=""
          className="object-cover object-center"
        />
      </div>
      <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="absolute z-10 right-0 top-0">
          <IconButton onClick={onRemove} icon={<X size={15} />} />
        </div>
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div className="flex justify-between">
            <p className=" text-lg font-semibold text-black">
              {data.cartProduct.name}
            </p>
          </div>

          <div className="mt-1 flex text-sm"></div>
          <Currency value={data.cartProduct.newprice} />
        </div>
        <div className="flex items-center mt-2">
          <button
            onClick={decreaseQuantity}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-l"
          >
            -
          </button>
          <input
            type="number"
            value={data.quantity}
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
      </div>
    </li>
  );
};

export default CartItem;
