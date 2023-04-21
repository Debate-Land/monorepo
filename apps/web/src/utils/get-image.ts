import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import client from "../lib/sanity";
import { UseNextSanityImageBuilder, UseNextSanityImageProps, useNextSanityImage } from "next-sanity-image";

export default function GetImage(image: SanityImageSource | null, CustomImageBuilder: UseNextSanityImageBuilder | null = null) {
  const imageProps = useNextSanityImage(client, image, {
    ...(CustomImageBuilder && {
      imageBuilder: CustomImageBuilder
    })
  })
  // @ts-ignore
  if (!image || !image.asset) {
    return null;
  }
  return imageProps;
};
