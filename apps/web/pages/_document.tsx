import { Html, Head, Main, NextScript } from 'next/document'

const Document = (props: any) => {
  return (
    <Html className="scroll-smooth">
      <Head />
      <body>
        <Main {...props} />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document
