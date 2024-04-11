import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import { getSubtitles } from "youtube-captions-scraper";

const cleanSourceText = (text: string) => {
  return text
    .trim()
    .replace(/(\n){4,}/g, "\n\n\n")
    .replace(/\n\n/g, " ")
    .replace(/ {3,}/g, "  ")
    .replace(/\t/g, "")
    .replace(/\n+(\s*\n)*/g, "\n");
};

export const parseInfoFromURL = async (link: string) => {
  try {
    if (isYouTubeLink(link)) {
      const subtitles = await getYouTubeSubtitles(link);
      return {
        urlInfo: subtitles === "No Subtitles" ? "" : subtitles,
        title: "",
        description: "",
        imageUrl: "",
        error: subtitles === "No Subtitles" ? "No Subtitles" : "",
      };
    } else {
      const response = await fetch(link);
      if (!response.ok) {
        return { urlInfo: "", title: "", description: "", imageUrl: "" };
      }
      const text = await response.text();
      const { content, title, description, imageUrl } = extractPageInfo(
        text,
        link
      );
      return { urlInfo: content, title, description, imageUrl };
    }
  } catch (error) {
    console.error(`Error fetching page content for ${link}:`, error);
    return {
      urlInfo: "",
      title: "",
      description: "",
      imageUrl: "",
    };
  }
};

const isYouTubeLink = (link: string) => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
  return youtubeRegex.test(link);
};

const getYouTubeSubtitles = async (link: string) => {
  try {
    const subtitles = await getSubtitles({
      videoID: getYouTubeVideoID(link),
      lang: "en",
    });
    return subtitles.map((subtitle: { text: any }) => subtitle.text).join(" ");
  } catch (error) {
    console.error(`Error retrieving YouTube subtitles for ${link}:`, error);
    return "No Subtitles";
  }
};

const getYouTubeVideoID = (link: string) => {
  const videoIDRegex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = link.match(videoIDRegex);
  return match ? match[1] : "";
};

const extractPageInfo = (html: string, link: string) => {
  try {
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const title = doc.title;
    const description = getMetaContent(doc, "description");
    const imageUrl = getMetaContent(doc, "og:image");

    const parsed = new Readability(doc).parse();
    const sourceText = parsed ? cleanSourceText(parsed.textContent) : "";

    return {
      content: sourceText,
      title,
      description,
      imageUrl,
    };
  } catch (error) {
    console.error(`Error extracting page info for ${link}:`, error);
    return {
      content: "",
      title: "",
      description: "",
      imageUrl: "",
    };
  }
};

const getMetaContent = (doc: Document, name: string) => {
  const meta = doc.querySelector(
    `meta[name="${name}"], meta[property="${name}"]`
  );
  return meta ? meta.getAttribute("content") || "" : "";
};
