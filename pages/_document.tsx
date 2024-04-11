import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Litoco AI transforms your blog posts and YouTube videos into captivating social media content. Generate Twitter threads and LinkedIn posts with just a link, saving you time and effort."
          />{" "}
          <meta property="og:site_name" content="litoco.ai" />{" "}
          <meta
            property="og:description"
            content="Litoco AI transforms your blog posts and YouTube videos into captivating social media content. Generate Twitter threads and LinkedIn posts with just a link, saving you time and effort."
          />{" "}
          <meta
            property="og:title"
            content="Litoco AI - Generate Social Media Content from Links"
          />{" "}
          <meta name="twitter:card" content="summary_large_image" />{" "}
          <meta
            name="twitter:title"
            content="Litoco AI - Generate Social Media Content from Links"
          />{" "}
          <meta
            name="twitter:description"
            content="Turn your blog posts and YouTube videos into engaging Twitter threads and LinkedIn posts effortlessly or any other Social Media Content. Litoco AI generates social media content from links, optimizing your online presence."
          />{" "}
          <meta property="og:image" content="https://litoco.ai/og-image.png" />{" "}
          <meta name="twitter:image" content="https://litoco.ai/og-image.png" />
        </Head>
        <body className="bg-orange-50 ">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
