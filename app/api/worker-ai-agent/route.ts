import type { NextRequest } from "next/server";
import { generateThreadFromURL } from "../../../CF-Worker-AI-Agents/Thread_Creator_Agent";
import { generateLinkedInPostFromURL } from "../../../CF-Worker-AI-Agents/LinkedIn_Post_Creator_Agent";

export async function POST(request: NextRequest) {
  const { url, type, behavior } = (await request.json()) as {
    url: string;
    type: string;
    behavior: string;
  };

  let response = null;

  switch (type) {
    case "X (Twitter) Thread":
      response = await generateThreadFromURL(url, behavior);
      break;
    case "LinkedIn Post":
      response = await generateLinkedInPostFromURL(url, behavior);
      break;
    default:
      break;
  }

  return new Response(JSON.stringify({ request: response }));
}
