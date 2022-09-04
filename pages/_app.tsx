import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { theme } from "../theme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>Student Advising Portal</title>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="title" content="Student Advising Portal" />
        <meta
          name="description"
          content="This is a student advising portal built as mini project for CSE412 (Software Engineering)"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://advising-portal.vercel.app/" />
        <meta property="og:title" content="Student Advising Portal" />
        <meta
          property="og:description"
          content="This is a student advising portal built as mini project for CSE412 (Software Engineering)"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://advising-portal.vercel.app/" />
        <meta property="twitter:title" content="Student Advising Portal" />
        <meta
          property="twitter:description"
          content="This is a student advising portal built as mini project for CSE412 (Software Engineering)"
        />
        <link rel="shortcut icon" href="/static/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
