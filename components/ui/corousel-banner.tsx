"use client";

import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-cart";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

const CarouselBanner = () => {
  useEffect(() => {}, []);

  return (
    <Carousel className="w-full h-full p-2">
      <CarouselContent>
        <CarouselItem>
          <div className="flex items-center justify-center">
            <div className="aspect-w-4 aspect-h-3">
              {/* Aspect ratio 3:2 (or any other aspect ratio of your image) */}
              <Image
                src="https://res.cloudinary.com/dur9jryl7/image/upload/v1713830752/ln6utlqbifkvv2xuaubh.png"
                alt=""
                height={800}
                width={1800}
                className="rounded-md"
              />
            </div>
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default CarouselBanner;
