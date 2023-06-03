import client, { getClient } from '@src/lib/sanity'
import { DynamicPage, DynamicPageProps } from '@src/components/layout';
import ErrorPage from 'next/error';

export const getStaticPaths = async () => {
  const pages = await client.fetch <DynamicPageProps[]>(`*[_type=='page' && pageType == 'general-page']`);
  return {
    paths: pages?.map(page => ({
      params: {
        slug: page.slug.current
      }
    })) || [],
    fallback: true
  }
}

interface StaticProps {
  params: {
    slug: string;
  },
  preview?: boolean;
}

export const getStaticProps = async ({ params, preview = false }: StaticProps) => {
  const page = await getClient(preview).fetch<DynamicPageProps[]>(`*[_type=='page' && pageType == 'general-page' && slug.current=='${params.slug}'] {
    ...,
    author->
  }`);

  return {
    props: {
      ...page[0]
    }
  }
}

const GeneralPage = (props: DynamicPageProps) => (
  props._id ? <DynamicPage {...props} /> : <ErrorPage statusCode={404} />
)

export default GeneralPage;
