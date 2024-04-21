import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { auth } from "@clerk/nextjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "GBP",
});

export const calculatePercentageDifference = (oldPrice: any, newPrice: any) => {
  if (!oldPrice || !newPrice) return 0;
  return ((oldPrice - newPrice) / oldPrice) * 100;
};

export const isAdmin = () => {
  const { orgRole } = auth();
  if (orgRole === "admin") {
    return true;
  }
  return false;
};
