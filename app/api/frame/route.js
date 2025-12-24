export async function GET() {
  return new Response(`
<!DOCTYPE html>
<html>
  <head>
    <meta name="fc:frame" content="vNext" />

    <meta property="og:title" content="Drop Signal" />
    <meta property="og:image" content="https://theshillreport-drop-signal-mini-app.vercel.app/IMG_2667.jpeg" />

    <meta name="fc:frame:image" content="https://theshillreport-drop-signal-mini-app.vercel.app/IMG_2667.jpeg" />

    <meta name="fc:frame:button:1" content="Open App" />
    <meta name="fc:frame:button:1:action" content="link" />
    <meta name="fc:frame:button:1:target" content="https://theshillreport-drop-signal-mini-app.vercel.app/" />
  </head>
</html>
`,
  {
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": "no-store",
    },
  });
}