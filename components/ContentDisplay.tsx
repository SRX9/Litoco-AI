import { useEffect, useState } from "react";
import { ContentType, contentTypes } from "./DropDown";
import { MemoizedReactMarkdown } from "./markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";

const TweetCard = dynamic(() => import("react-tweet-card"), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

interface ContentDisplayProps {
  type: ContentType;
  generatedContent: string;
  headerImagePrompt: string;
  imageURL: string;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({
  type,
  generatedContent,
  headerImagePrompt,
  imageURL,
}) => {
  const [imgThumbnailLoading, setImgThumbnailLoading] = useState<boolean>(true);
  const [imageThumbnailURL, setImageThumbnailURL] = useState<string>("");

  const generateThumbnail = async (prompt: string) => {
    try {
      setImgThumbnailLoading(true);
      const imageThumbnailResponse = await fetch(
        `/api/genThumbnail/?prompt=${prompt}`
      );

      if (!imageThumbnailResponse.ok) {
        throw new Error(imageThumbnailResponse.statusText);
      }

      const data: any = await imageThumbnailResponse.json();
      setImageThumbnailURL(
        `https://${process.env.CLOUDFLARE_R2_MEDIA_SUBDOMAIN}/${data?.imageUrl}`
      );
    } catch (error) {
    } finally {
      setImgThumbnailLoading(false);
    }
  };

  useEffect(() => {
    if (type === contentTypes?.[1] && headerImagePrompt) {
      generateThumbnail(
        headerImagePrompt?.toLowerCase()?.split("description:")?.[1] ||
          headerImagePrompt
      );
    }
  }, [headerImagePrompt]);

  if (!generatedContent) {
    return null;
  }

  const getHeader = () => {
    switch (type) {
      case contentTypes[0]:
        return "X Thread";
      case contentTypes[1]:
        return "Linkedin Post";
      default:
        break;
    }
  };

  return (
    <div className="space-y-10 my-10">
      <div className="pt-10">
        <h2 className="sm:text-3xl text-2xl font-bold text-slate-900 mx-auto  ">
          Your {getHeader()}
        </h2>
      </div>
      {type === contentTypes[1] && headerImagePrompt && (
        <div
          className="bg-white rounded-xl cursor-pointer shadow-md p-8 max-w-[660px] hover:bg-gray-100 transition border"
          onClick={() => {
            navigator.clipboard.writeText(generatedContent);
            toast("Content copied to clipboard", {
              icon: "✂️",
            });
          }}
        >
          <div className="text-left mb-6 relative">
            <div className=" w-full  flex justify-between pb-4 ">
              <img
                width="48"
                height="48"
                src="https://img.icons8.com/sf-regular-filled/48/linkedin.png"
                alt="linkedin"
                className=" ml-[-7px] mt-[-7px]  "
              />
            </div>
            <MemoizedReactMarkdown
              className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
              remarkPlugins={[remarkGfm, remarkMath]}
              components={{
                p({ children }: any) {
                  return <p className="mb-2 last:mb-0">{children}</p>;
                },
              }}
            >
              {generatedContent}
            </MemoizedReactMarkdown>
          </div>
          {imgThumbnailLoading && (
            <div className="py-5 w-full flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 animate-spin"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </div>
          )}
          <img
            src={imageThumbnailURL}
            className={"w-full max-h-[400px] h-auto object-cover rounded-lg "}
          />
        </div>
      )}
      <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
        {type === contentTypes[0] &&
          generatedContent.split("\n").map(
            (content, index) =>
              content &&
              content.length > 50 && (
                <div
                  key={index}
                  className="bg-white rounded-xl cursor-pointer shadow-md p-4 hover:bg-gray-100 transition border"
                  onClick={() => {
                    navigator.clipboard.writeText(content);
                    toast("Content copied to clipboard", {
                      icon: "✂️",
                    });
                  }}
                >
                  <TweetCard
                    author={{
                      name: "Cloudfairy",
                      username: "cloudfairy_ai",
                      image:
                        "https://pbs.twimg.com/profile_images/1561325596407660544/FeiCTKJp_400x400.jpg",
                    }}
                    tweet={content}
                    time={new Date()}
                    tweetImages={
                      index === 0
                        ? [
                            {
                              src: imageURL,
                            },
                          ]
                        : []
                    }
                    source="Twitter for Cloudflare"
                    fitInsideContainer
                  />
                </div>
              )
          )}
      </div>
    </div>
  );
};

export default ContentDisplay;
