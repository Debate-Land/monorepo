import { SanityDocument } from "sanity";

interface Page extends SanityDocument {
  slug: {
    current: string;
    _type: 'slug'
  };
  title: string;
  description: string;
  pageType: 'blog-post' | 'general-page';
  body: JSX.Element[];
  publishedAt: string;
  author: {
    _type: 'reference';
    _id: string;
  }
};

export default Page;
