import { HeadersFunction, LoaderFunction } from "@remix-run/node";

export const headers: HeadersFunction = () => {
  return {
    "Cache-Control": "public, max-age=300, s-maxage=3600",
  };
};

export const loader: LoaderFunction = () => {
  const robotText = `
    User-agent: Googlebot
    Disallow: /nogooglebot/

    User-agent: *
    Allow: /

    Sitemap: https://www.sebasptsch.dev/sitemap.xml
    `;

  return new Response(robotText, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
