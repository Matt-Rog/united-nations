import { AppProps } from "next/app";
import Head from "next/head";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  useMantineTheme,
} from "@mantine/core";
import { Roboto, RobotoMono } from "@/lib/CustomFonts";
import { useState } from "react";
import { getCookie, setCookie } from "cookies-next";
import { useHotkeys } from "@mantine/hooks";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  const theme = useMantineTheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
    setCookie("mantine-color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  return (
    <>
      <Head>
        <title>United Nations</title>
        <link rel="shortcut icon" href="/static/images/favicon.ico" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            primaryShade: 4,
            fontFamily: `${Roboto.style.fontFamily}`,
            colorScheme: colorScheme,
            fontFamilyMonospace: `${RobotoMono.style.fontFamily}`,
            headings: {
              fontFamily: `${Roboto.style.fontFamily}`,
            },
          }}
        >
          <SessionProvider session={session}>
            <Component {...pageProps} />
          </SessionProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}
