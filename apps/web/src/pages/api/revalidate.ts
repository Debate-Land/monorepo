import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook';
import { NextApiRequest, NextApiResponse } from 'next';
import { types } from '@shared/cms';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const signature = req.headers[SIGNATURE_HEADER_NAME]! as string;
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  const isValid = isValidSignature(JSON.stringify(req.body), signature, process.env.SANITY_WEBHOOK_SIGNATURE!);

  // Validate signature
  if (!isValid) {
    res.send(`${signature} ${process.env.SANITY_WEBHOOK_SIGNATURE!}`);
    return;
  }

  try {
    const document = req.body as unknown as types.Page;
    const pathToRevalidate = document.slug.current;

    await res.revalidate(`${document.pageType === 'blog-post' ? 'blog' : ''}/${pathToRevalidate}`);

    return res.json({ revalidated: true });
  }
  catch (err) {
    // Could not revalidate. The stale page will continue to be shown until
    // this issue is fixed.
    return res.status(500).send('Error while revalidating');
  }
}
