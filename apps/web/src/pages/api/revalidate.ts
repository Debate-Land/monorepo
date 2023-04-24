import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook';
import { NextApiRequest, NextApiResponse } from 'next';
import { types } from '@shared/cms';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TODO: Use Sanity signature validation.

  // eslint-disable-next-line turbo/no-undeclared-env-vars
  const isValid = (req.headers['sanity-webhook-signature']! as string).split(',')[0] == process.env.SANITY_WEBHOOK_SIGNATURE!;

  if (!isValid) {
    res.status(404)
    return;
  }

  try {
    const document = req.body as unknown as types.Page;
    const pathToRevalidate = document.slug.current;

    await res.revalidate(`${document.pageType === 'blog-post' ? '/blog' : ''}/${pathToRevalidate}`);
    return res.json({ revalidated: true });
  }
  catch (err) {
    return res.status(500).send('Error while revalidating');
  }
}
