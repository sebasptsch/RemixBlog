import { HeadersFunction, LoaderFunction } from "@remix-run/node";
import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";
import { db } from "~/utils/db.server";

export const headers: HeadersFunction = () => {
  return {
    "Cache-Control": "public, max-age=300, s-maxage=3600",
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  //   const links = [{ url: "/page-1/", changefreq: "daily", priority: 0.3 }];
  const posts = await db.post.findMany({
    where: {
      status: "PUBLISHED",
    },
  });

  const blogLinks = posts.map((post) => ({
    url: `/posts/${post.slug}`,
    changefreq: "weekly",
    priority: 0.3,
  }));

  const staticLinks: {
    url: string;
    changefreq: string;
    priority: number;
  }[] = [
    { url: `/`, changefreq: "weekly", priority: 0.3 },
    { url: `/auth/login`, changefreq: "weekly", priority: 0.3 },
  ];

  const stream = new SitemapStream({ hostname: "https://www.sebasptsch.dev" });
  return new Response(
    await streamToPromise(
      Readable.from([...blogLinks, ...staticLinks]).pipe(stream)
    ).then((data) => data.toString()),
    {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "xml-version": "1.0",
        encoding: "UTF-8",
      },
    }
  );
};
