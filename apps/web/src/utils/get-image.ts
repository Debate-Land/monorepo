import client from "../lib/sanity";
import { useNextSanityImage } from "next-sanity-image";

// @ts-ignore
export default function GetImage(image, CustomImageBuilder = null) {
  const imageProps = useNextSanityImage(client, image, {
    // @ts-ignore
    imageBuilder: CustomImageBuilder
  });
  if (!image || !image.asset) {
    return null;
  }
  return imageProps;
};
