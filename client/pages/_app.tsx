import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth-static-site";
import { GlobalStyles } from "../lib/styles";
import Header from "../components/Header";

const App = ({ Component, pageProps: { ...pageProps } }: AppProps) => {
  return (
    <>
      {GlobalStyles}
      <SessionProvider>
        <Header />
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
};

export default App;
