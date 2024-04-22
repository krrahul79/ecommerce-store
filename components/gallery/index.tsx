"use client";

import NextImage from "next/image";
import { Tab } from "@headlessui/react";

import { Image } from "@/types";

import GalleryTab from "./gallery-tab";

interface GalleryProps {
  images: string[];
}

const Gallery: React.FC<GalleryProps> = ({ images = [] }) => {
  return (
    <Tab.Group as="div" className="flex">
      <div className="mx-auto mt-6 hidden w-40 max-w-xl sm:block lg:max-w-none mr-20">
        <Tab.List className="flex flex-col">
          {images.map((image) => (
            <GalleryTab image={image} />
          ))}
        </Tab.List>
      </div>
      <Tab.Panels className="aspect-square w-full">
        {images.map((image) => (
          <Tab.Panel>
            <div className="aspect-square relative h-full w-full sm:rounded-lg overflow-hidden">
              <NextImage
                fill
                src={image}
                alt="Image"
                className="object-cover object-center"
              />
            </div>
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

export default Gallery;
