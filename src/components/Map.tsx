"use client"

import Image, { StaticImageData } from "next/image";
import { Button } from "./ui/Button";
import type {Location} from "@/types"

import srcFlag from "@/images/flag.png"

import Link from 'next/link'

export function Map({image,locations}:{image:StaticImageData, locations:Location[]}) {
  return (
    <>
      <Image src={image} alt="" />
      {locations.map((location) => {
        return (
          <Link
            key={location.id}
            href={`/map/${location.src}`}
            className="absolute"
            style={{ left: `${location.x}px`, top: `${location.y}px` }}
          >
          <Button
            
            className="absolute w-5 h-5 rounded-full overflow-hidden"
            // style={{ left: `${location.x}px`, top: `${location.y}px` }}
          >
            <Image
              src={srcFlag}
              height="20"
              width="20"
              alt=""
              className="absolute top-[6px] left-[3px]"

            />
            </Button>
            </Link>
        );
      })}
    </>
  );
}