export async function cf_ai_run(model: any, input: any) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_APP_ID}/ai/run/${model}`,
    {
      headers: { Authorization: `Bearer ${process.env.COLUDFLARE_API}` },
      method: "POST",
      body: JSON.stringify(input),
    }
  );
  const result = await response.json();
  return result;
}
