export async function POST(req) {
  const body = await req.json();

  const baseUrl = "https://DEINE-VERCEL-URL.vercel.app";

  return new Response(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="og:title" content="DropSignal Vault" />
        <meta property="og:description" content="Deposit USDC on Base. Earn real yield." />
        <meta property="og:image" content="${baseUrl}/frame.png" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/frame.png" />
        <meta property="fc:frame:button:1" content="Deposit USDC" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content="${baseUrl}?action=deposit" />
      </head>
    </html>
    `,
    {
      headers: { "Content-Type": "text/html" }
    }
  );
}
