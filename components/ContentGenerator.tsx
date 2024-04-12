// ContentGenerator.tsx
import { useState } from "react";
import Image from "next/image";
import DropDownContentType, { ContentType, contentTypes } from "./DropDown";
import { ProgressBar, Step } from "react-step-progress-bar";
import { isYouTubeLink } from "../utils/Checks";

interface ContentGeneratorProps {
  type: ContentType;
  setType: (type: ContentType) => void;
  behavior: string;
  setBehavior: (behavior: string) => void;
  url: string;
  setUrl: (url: string) => void;
  setGeneratedContent: (content: string) => void;
  setHeaderImagePrompt: (prompt: string) => void;
  setImageURL: (url: string) => void;
}

const ContentGenerator: React.FC<ContentGeneratorProps> = ({
  type,
  setType,
  behavior,
  setBehavior,
  url,
  setUrl,
  setGeneratedContent,
  setHeaderImagePrompt,
  setImageURL,
}) => {
  const [loading, setLoading] = useState(false);
  const [notEnoughContent, setNotEnoughContent] = useState<string>("");
  const [stepPercent, setStepPercent] = useState<number>(0);

  const loadingStepCounter = async () => {
    setStepPercent(8);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setStepPercent(15);

    await new Promise((resolve) => setTimeout(resolve, 3000));
    setStepPercent(30);

    await new Promise((resolve) => setTimeout(resolve, 5000));
    setStepPercent(55);

    await new Promise((resolve) => setTimeout(resolve, 5000));
    setStepPercent(65);

    await new Promise((resolve) => setTimeout(resolve, 5000));
    setStepPercent(100);
  };

  const resetResultStates = () => {
    setGeneratedContent("");
    setHeaderImagePrompt("");
    setNotEnoughContent("");
    setImageURL("");
    setStepPercent(0);
  };

  const generateContent = async (e: any) => {
    e.preventDefault();
    try {
      if (!url) {
        return;
      }
      resetResultStates();
      setLoading(true);

      // Start Timer
      loadingStepCounter();

      const response = await fetch("/api/worker-ai-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          type,
          behavior,
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data: any = await response.json();
      const dataRes = data.request?.threadResponse?.result?.response;
      if (!dataRes) {
        if (isYouTubeLink(url)) {
          setNotEnoughContent(
            "Video doesn't have readable Transcript available."
          );
        } else {
          setNotEnoughContent(
            "WebPage with provided URL doesn't have enough content."
          );
        }
        return;
      }
      setHeaderImagePrompt(data.request?.imageDescription?.result?.response);
      setGeneratedContent(dataRes);
      setImageURL(data.request?.imageUrl);
      setStepPercent(100);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl w-full">
      <div className="flex mt-10 items-center justify-start gap-3">
        <Image
          src="/1-black.png"
          width={30}
          height={30}
          alt="1 icon"
          className=""
        />
        <div className="text-left font-medium">
          Select the type of content you want.
        </div>
      </div>
      <form onSubmit={generateContent}>
        <div className="block mt-4">
          <DropDownContentType
            selected={type}
            setSelected={(newType) => {
              if (loading) {
                return;
              }
              setUrl("");
              setType(newType as ContentType);
              setLoading(false);
              resetResultStates();
            }}
            options={contentTypes}
            label={(option) => option}
          />
          <input
            value={behavior}
            type="text"
            maxLength={200}
            onChange={(e) => setBehavior(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black mt-3 mb-5"
            placeholder="(Optional) Desired content creation tone (e.g., Pirate in drunk style)"
          />
        </div>
        <div className="flex mt-8 items-center space-x-3">
          <Image src="/2-black.png" width={30} height={30} alt="2 icon" />
          <p className="text-left font-medium">
            Enter the URL of the blog post or YouTube video.
          </p>
        </div>
        <input
          value={url}
          type="url"
          required
          maxLength={500}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black mt-3 mb-5"
          placeholder={"Link of Any Blog, Youtube Video or Article"}
        />

        {!loading && (
          <button
            className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-3 mt-3 hover:bg-black/80 w-full"
            type="submit"
          >
            Generate Content &rarr;
          </button>
        )}
      </form>
      {loading && (
        <div className="pt-4 w-full  px-5 mt-10 items-center gap-3 justify-center">
          <ProgressBar
            filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
            percent={stepPercent}
          >
            <Step transition="scale">
              {({ accomplished, index }: any) => (
                <div
                  className={`transitionStep ${
                    accomplished ? "accomplished" : null
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 6a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V6Zm3.97.97a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 0 1 0-1.06Zm4.28 4.28a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </Step>
            <Step transition="scale">
              {({ accomplished, index }: any) => (
                <div
                  className={`transitionStep ${
                    accomplished ? "accomplished" : null
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    <path
                      fillRule="evenodd"
                      d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </Step>
            <Step transition="scale">
              {({ accomplished, index }: any) => (
                <div
                  className={`transitionStep ${
                    accomplished ? "accomplished" : null
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </Step>
            <Step transition="scale">
              {({ accomplished, index }: any) => (
                <div
                  className={`transitionStep ${
                    accomplished ? "accomplished" : null
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </Step>
          </ProgressBar>
        </div>
      )}
      {notEnoughContent && (
        <div className="pt-4 w-full flex flex-col mt-10 items-center gap-3 justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
          <div className="text-md text-gray-500">{notEnoughContent}</div>
        </div>
      )}
    </div>
  );
};

export default ContentGenerator;
