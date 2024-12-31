import { SessionProvider } from "next-auth-static-site";
import Header from "../components/Header";
import "./styles.css";

const App = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <SessionProvider>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default App;
