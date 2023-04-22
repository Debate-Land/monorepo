import { Image, SanityDocument } from "sanity";

interface Author extends SanityDocument {
  slug: {
    current: string;
    _type: 'slug'
  };
  name: string;
  image: Image;
  pageType: 'blog-post' | 'general-page';
  bio: JSX.Element[];
};

export default Author;
