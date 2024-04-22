"use client";

import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
//import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-cart";
import { useUser } from "@clerk/nextjs";

const NavbarActions = ({ isAdmin }: { isAdmin: boolean }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [isAdmin]);

  const router = useRouter();
  const cart = useCart();

  if (!isMounted) {
    return null;
  }

  //const { user } = useUser();
  // console.log("user", user);
  // if (!isAdmin) {
  //   return null;
  // }

  return (
    <div className="ml-auto flex items-center gap-x-4">
      {isAdmin && (
        <Button
          onClick={() => router.push("/categories")}
          className="flex items-center rounded-full bg-black px-4 py-2"
        >
          Create Categories
        </Button>
      )}
      {isAdmin && (
        <Button
          onClick={() => router.push("/products")}
          className="flex items-center rounded-full bg-black px-4 py-2"
        >
          Create Products
        </Button>
      )}
      <Button
        onClick={() => router.push("/cart")}
        className="flex items-center rounded-full bg-black px-4 py-2"
      >
        <ShoppingBag size={20} color="white" />
        <span className="ml-2 text-sm font-medium text-white">
          {cart.items.length}
        </span>
      </Button>
      {/* // <UserButton /> */}
    </div>
  );
};

export default NavbarActions;
