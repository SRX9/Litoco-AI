// Home.tsx
import { NextPage } from "next";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import DropDownContentType, {
  ContentType,
  contentTypes,
} from "../components/DropDown";
import Footer from "../components/Footer";
import ContentGenerator from "../components/ContentGenerator";
import ContentDisplay from "../components/ContentDisplay";

const Home: NextPage = () => {
  const [type, setType] = useState<ContentType>(contentTypes[0]);
  const [behavior, setBehavior] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [headerImagePrompt, setHeaderImagePrompt] = useState<string>("");
  const [imageURL, setImageURL] = useState<string>("");

  return (
    <div className="flex max-w-2xl mx-auto flex-col items-center justify-center py-2 min-h-screen ">
      <main className="flex flex-1 w-full z-[9999]   flex-col items-center justify-center text-center px-4 mt-20 mb-4 sm:mt-20">
        <div className="rounded-2xl py-1 px-4 mx-20 bg-white border-0 shadow-md  text-sm mb-5 hover:scale-105 transition duration-300 ease-in-out">
          Link To Content
        </div>
        <h1 className="sm:text-6xl text-4xl max-w-[380px] font-bold text-slate-900">
          Litoco
        </h1>
        <div className="mt-7 max-w-[480px]">
          Transforms your blog posts and YouTube videos into captivating social
          media content
        </div>

        <ContentGenerator
          type={type}
          setType={setType}
          behavior={behavior}
          setBehavior={setBehavior}
          url={url}
          setUrl={setUrl}
          setGeneratedContent={setGeneratedContent}
          setHeaderImagePrompt={setHeaderImagePrompt}
          setImageURL={setImageURL}
        />

        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />

        <ContentDisplay
          type={type}
          generatedContent={generatedContent}
          headerImagePrompt={headerImagePrompt}
          imageURL={imageURL}
        />
      </main>
      <Footer />
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 2000 }}
      />
    </div>
  );
};

export default Home;
