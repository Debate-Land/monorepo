import { SanityDocument, TypedObject } from "sanity";

interface ChangelogPopup extends SanityDocument {
  heading: string;
  publishedAt: string;
  body: TypedObject[];
};

export default ChangelogPopup;
