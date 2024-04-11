import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  const prompt =
    url.searchParams.get("prompt") || process.env.PROMPT_THUMBNAIL_POSITIVE;
  const negative =
    url.searchParams.get("negative") || process.env.PROMPT_THUMBNAIL_NEGATIVE;

  const MODEL = "@cf/bytedance/stable-diffusion-xl-lightning";

  // Set CK Workers Headerts
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${process.env.COLUDFLARE_API}`);
  myHeaders.append("Content-Type", "application/json");

  const inputs = JSON.stringify({
    prompt: prompt + ", Highly detailed, Realistic, realistic reflections",
    negative_prompt: negative,
    width: 360,
    height: 200,
  });

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: inputs,
    redirect: "follow",
  };

  try {
    const result = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_APP_ID}/ai/run/${MODEL}`,
      requestOptions
    ).then((response) => response.arrayBuffer());

    const base64Image = Buffer.from(result).toString("base64");

    const timestamp = Date.now();
    const filename = `image_${timestamp}.png`;

    const s3Client = new S3Client({
      endpoint: `https://${process.env.CLOUDFLARE_APP_ID}.r2.cloudflarestorage.com`,
      region: "auto",
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY || "",
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY || "",
      },
    });

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: filename,
      Body: Buffer.from(base64Image, "base64"),
      ContentType: "image/png",
    });

    await s3Client.send(putObjectCommand);

    return new Response(JSON.stringify({ imageUrl: filename }));
  } catch (error) {
    return new Response(JSON.stringify({ error: error }));
  }
}
