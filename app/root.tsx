// root.tsx
import {
  ChakraProvider,
  Container,
  cookieStorageManagerSSR,
  Flex,
  localStorageManager,
  Spacer,
} from "@chakra-ui/react";
import { withEmotionCache } from "@emotion/react";
import { LinksFunction, LoaderFunction, MetaFunction } from "@remix-run/node"; // Depends on the runtime you choose
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import React, { useContext, useEffect } from "react";

import { ClientStyleContext, ServerStyleContext } from "./context";

import { User } from "@prisma/client";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
import { authenticator } from "./services/auth.server";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export let links: LinksFunction = () => {
  return [
    // { rel: "preconnect", href: "https://fonts.googleapis.com" },
    // { rel: "preconnect", href: "https://fonts.gstatic.com" },
  ];
};

interface DocumentProps {
  children: React.ReactNode;
}

const Document = withEmotionCache(
  ({ children }: DocumentProps, emotionCache) => {
    const serverStyleData = useContext(ServerStyleContext);
    const clientStyleData = useContext(ClientStyleContext);

    // Only executed on client
    useEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData?.reset();
    }, []);

    return (
      <html lang="en">
        <head>
          <Meta />
          <Links />
          {serverStyleData?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(" ")}`}
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
        </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    );
  }
);

export default function App() {
  const { cookies, user } = useLoaderData<{
    cookies: string;
    user?: User;
  }>();
  return (
    <Document>
      <ChakraProvider
        colorModeManager={
          typeof cookies === "string"
            ? cookieStorageManagerSSR(cookies)
            : localStorageManager
        }
      >
        <Flex direction={"column"} minH="100vh">
          <Nav user={user} />
          <Container maxW="container.lg">
            <Outlet />
          </Container>
          <Spacer />
          <Footer />
        </Flex>
      </ChakraProvider>
    </Document>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  // first time users will not have any cookies and you may not return
  // undefined here, hence ?? is necessary
  return {
    cookies: request.headers.get("cookie") ?? "",
    user: user ?? undefined,
  };
};
