import { SanityDocument } from "sanity";

interface Email extends SanityDocument {
  subject: string;
  body: JSX.Element[];
};

export default Email;
