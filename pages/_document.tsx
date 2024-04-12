import Document, { Head, Html, Main, NextScript } from "next/document";
import Image from "next/image";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Litoco AI transforms your blog posts and YouTube videos into captivating social media content. Generate Twitter threads and LinkedIn posts with just a link, saving you time and effort."
          />
          <meta property="og:site_name" content="litoco.ai" />
          <meta
            property="og:description"
            content="Litoco AI transforms your blog posts and YouTube videos into captivating social media content. Generate Twitter threads and LinkedIn posts with just a link, saving you time and effort."
          />
          <meta
            property="og:title"
            content="Litoco AI - Generate Social Media Content from Links"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="Litoco AI - Generate Social Media Content from Links"
          />
          <meta
            name="twitter:description"
            content="Turn your blog posts and YouTube videos into engaging Twitter threads and LinkedIn posts effortlessly or any other Social Media Content. Litoco AI generates social media content from links, optimizing your online presence."
          />
          <meta
            property="og:image"
            content={`${process.env.APP_HOST}/og-image.png`}
          />
          <meta
            name="twitter:image"
            content={`${process.env.APP_HOST}/og-image.png`}
          />
          <link
            rel="icon"
            type="image/png"
            href={`${process.env.APP_HOST}/favicon.png`}
          />
          <link
            rel="apple-touch-icon"
            type="image/png"
            href={`${process.env.APP_HOST}/favicon.png`}
          />
        </Head>
        <body className="bg-gradient-to-r from-gray-100 to-gray-50 relative overflow-hidden ">
          <div className="z-0 hidden sm:flex ">
            <Image
              src="/anime-model-image-male.png"
              height={720}
              width={720}
              alt="litico hero"
              className="absolute bottom-0 left-[-50px] z-0 max-w-[35vw] h-auto "
            />
          </div>
          <div className="z-0 hidden sm:flex ">
            <Image
              src="/anime-model-image-female.png"
              height={720}
              width={720}
              alt="litico hero"
              className="absolute bottom-0 right-[-50px] z-0 max-w-[35vw] h-auto"
            />
          </div>
          <div className=" max-h-screen overflow-y-auto ">
            <Main />
          </div>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
