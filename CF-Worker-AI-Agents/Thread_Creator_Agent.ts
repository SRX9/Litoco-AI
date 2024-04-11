import { parseInfoFromURL } from "./Online_Agent";
import { cf_ai_run } from "./cf_run";

export const generateThreadFromURL = async (url: string, behavior: string) => {
  const urlInfoObj = await parseInfoFromURL(url);

  const { urlInfo, imageUrl, error }: any = urlInfoObj ? urlInfoObj : {};

  if (!urlInfo) {
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
  ];

  const responseList = await Promise.all(promises);

  return {
    threadResponse: responseList?.[0],
    imageUrl,
    error,
  };
};
