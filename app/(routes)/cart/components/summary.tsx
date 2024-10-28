"use client";

import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { toast } from "react-hot-toast";

import getConfig from "@/actions/get-config";
import ReCAPTCHA from "react-google-recaptcha";

interface SummaryProps {
  deliveryCharge: number;
  minAmount: number;
  maxWeight: number;
}

const Summary: React.FC<SummaryProps> = ({
  deliveryCharge,
  minAmount,
  maxWeight,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);

  const removeAll = useCart((state) => state.removeAll);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRecaptchaVerified, setRecaptchaVerified] = useState(false); // Track reCAPTCHA status
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success(
        "Payment successful! Your order details will be sent via email. Please remember to check your spam folder just in case."
      );
      removeAll();
      router.push("/");
    }

    if (searchParams.get("canceled")) {
      toast.error("Something went wrong.");
    }
  }, [searchParams, removeAll]);

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.cartProduct.newprice) * item.quantity;
  }, 0);

  const totalMeasure = items.reduce((total, item) => {
    return total + Number(item.cartProduct.calculatesize) * item.quantity;
  }, 0);

  const actaulTotalPrice = () => {
    var total = totalPrice;
    if (total < minAmount - 0) {
      return deliveryCharge + total;
    }
    return total;
  };

  const handleCheckoutClick = () => {
    if (items.length === 0 || !!errorMessage) return; // Prevent checkout if disabled

    recaptchaRef.current?.execute(); // Execute the invisible reCAPTCHA
  };

  const onRecaptchaChange = (token: string | null) => {
    if (token) {
      setRecaptchaVerified(true); // reCAPTCHA verified successfully
    } else {
      setRecaptchaVerified(false); // reCAPTCHA failed
    }
  };

  const onCheckout = async () => {
    if (totalMeasure > maxWeight) {
      setErrorMessage("Sorry, your order exceeds the weight limit.");
      return; // Prevent checkout if weight limit exceeded
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
      {
        products: items.map((item) => ({
          product: item.cartProduct,
          quantity: item.quantity,
        })),
        deliveryCharge: deliveryCharge,
      }
    );

    window.location = response.data.url;
  };

  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">
            Total amount
          </div>
          <Currency value={totalPrice} />
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">
            Delivery charge
          </div>
          <Currency value={deliveryCharge} />
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Order total</div>
          <Currency value={actaulTotalPrice()} />
        </div>
      </div>
      {errorMessage && (
        <div className="text-red-500 font-medium mt-2">{errorMessage}</div>
      )}
      <div className="mt-4">
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
          onChange={onRecaptchaChange}
          ref={recaptchaRef}
        />
      </div>

      <Button
        onClick={onCheckout}
        disabled={items.length === 0 || !!errorMessage || !isRecaptchaVerified} // disable if no items or error message exists
        className="w-full mt-6"
      >
        Checkout as guest
      </Button>
    </div>
  );
};

export default Summary;
