import { parseInfoFromURL } from "./Online_Agent";
import { cf_ai_run } from "./cf_run";

export const generateLinkedInPostFromURL = async (
  url: string,
  behavior: string
) => {
  const urlInfoObj = await parseInfoFromURL(url);

  const { urlInfo, title, description, imageUrl, error }: any = urlInfoObj
    ? urlInfoObj
    : {};

  if (!urlInfo || urlInfo?.length < 50) {
    return { request: "URL doesn't have readable content", error };
  }

  const compressedText = await cf_ai_run("@cf/facebook/bart-large-cnn", {
    input_text: urlInfo,
    max_length: 5200,
  });

  const finalText =
    compressedText?.result?.summary &&
    compressedText?.result?.summary?.length > 300
      ? compressedText?.result?.summary?.slice(0, 5150)
      : urlInfo?.slice(0, 5150);

  const prompt = `
    ${process.env.PROMPT_LINKEDIN_POST_GENERATOR}
    Text behavior: {{${behavior}}}
    Text content: {{${finalText}}}
  `;

  const promises = [
    cf_ai_run("@hf/thebloke/zephyr-7b-beta-awq", { prompt: prompt }),
    cf_ai_run("@hf/thebloke/zephyr-7b-beta-awq", {
      prompt: `
      Optimized prompt for SDXL image model:

      Image description: Thumbnail image depicting a blog titled "{{${title}. ${description}}}" with ${behavior} with engaging visuals and relevant graphics and no text.
      Respond like this only: Image description: // description of thumbnail image very short 5 words only
      `,
    }),
  ];

  const responseList = await Promise.all(promises);

  return {
    threadResponse: responseList?.[0],
    imageDescription: responseList?.[1],
    imageUrl,
    error,
  };
};
