"use client";

import { useEffect, useState } from "react";

import Container from "@/components/ui/container";
import useCart from "@/hooks/use-cart";

import Summary from "./components/summary";
import CartItem from "./components/cart-item";
import getConfig from "@/actions/get-config";

export const revalidate = 0;

const CartPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState<number>(5.99);
  const [minAmount, setMinAmount] = useState<number>(50.0);
  const [maxWeight, setMaxWeight] = useState<number>(20000);
  const cart = useCart();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const configData = await getConfig();
        if (configData) {
          setDeliveryCharge(parseFloat(configData.deliveryCharge));
          setMinAmount(parseFloat(configData.minAmount));
          setMaxWeight(parseInt(configData.maxWeight));
        }
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    };

    fetchConfig();
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-black">Shopping Cart</h1>
          <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
            <div className="lg:col-span-7">
              {cart.items.length === 0 && (
                <p className="text-neutral-500">No items added to cart.</p>
              )}
              <ul>
                {cart.items.map((item) => (
                  <CartItem key={item.cartProduct._id} data={item} />
                ))}
              </ul>
            </div>
            <Summary
              deliveryCharge={deliveryCharge}
              minAmount={minAmount}
              maxWeight={maxWeight}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CartPage;
