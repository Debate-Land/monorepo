// @ts-nocheck
import Image from "next/image";
import { createClient } from "next-sanity";
import createImageUrlBuilder from "@sanity/image-url";
import { PortableText as PortableTextComponent } from "@portabletext/react";
import GetImage from "@src/utils/get-image";
import { defineConfig } from "sanity";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const config = defineConfig({
  projectId: '2ayk9qf1',
  dataset: 'production',
  useCdn: true,
  title: 'Debate Land',
});


export const urlFor = (source: SanityImageSource) =>
  createImageUrlBuilder(config).image(source);

export const imageBuilder = (source: SanityImageSource) =>
  createImageUrlBuilder(config).image(source);

// Barebones lazy-loaded image component
// @ts-ignore
const ImageComponent = ({ value }) => {
  // const {width, height} = getImageDimensions(value)
  return (
    <Image
      {...GetImage(value)}
      blurDataURL={GetImage(value).blurDataURL}
      objectFit="cover"
      sizes="(max-width: 800px) 100vw, 800px"
      alt={value.alt || " "}
      placeholder="blur"
      loading="lazy"
    />
  );
};

const components = {
  types: {
    image: ImageComponent,
    code: (props: any) => (
      <pre data-language={props.node.language}>
        <code>{props.node.code}</code>
      </pre>
    )
  },
  marks: {
    center: (props: any) => (
      <div className="text-center">{props.children}</div>
    ),
    highlight: (props: any) => (
      <span className="font-bold text-brand-primary">
        {props.children}
      </span>
    ),
    link: (props: any) => (
      <a href={props?.value?.href} target="_blank" rel="noopener">
        {props.children}
      </a>
    )
  }
};
// Set up Portable Text serialization
export const PortableText = (props: any) => (
  <PortableTextComponent components={components} {...props} />
);

const client = createClient(config);

export const getClient = (usePreview: any) => client;

export default client;