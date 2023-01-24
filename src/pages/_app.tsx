import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import "../styles/toast.css";
import "../styles/tooltip.css";

import { Web3Provider } from "@ethersproject/providers";
import mixpanel from "mixpanel-browser";
import { appWithTranslation } from "next-i18next";
import Head from "next/head";
import Script from "next/script";
import { ToastContainer, ToastContainerProps } from "react-toastify";
import type { AppProps } from "next/app";
import { RPCClientProvider } from "src/contexts/useRPCClient";
import { RenProvider } from "src/contexts/useRenProvider";
import { isProduction } from "../utils/misc";

const toastConfig = {
  autoClose: 6000,
  closeButton: true,
  closeOnClick: false,
  theme: "dark",
  draggable: false,
  pauseOnHover: true,
  progressStyle: { visibility: "visible", animationDirection: "reverse" },
} as ToastContainerProps;

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_API_KEY!, {
  api_host: "https://mixpanel-proxy-54redfghu76.catalog.fi",
  debug: false,
  ignore_dnt: true,
});

const RPC_URL = isProduction()
  ? "https://mainnet.catalog.fi/rpc"
  : "https://rpc.catalog.fi/testnet";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Catalog Explorer</title>
        <meta
          httpEquiv='Content-Security-Policy'
          content="script-src 'self' 'unsafe-eval' 'unsafe-inline' https://api.coingecko.com http://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js https://www.google-analytics.com https://www.googletagmanager.com/ https://*.google.com https://cdn.usefathom.com https://*.hcaptcha.com https://*.freshworks.com https://www.gstatic.com;"
        />
      </Head>
      <Script
        async
        strategy='lazyOnload'
        src='https://www.googletagmanager.com/gtag/js?id=G-NVG461QN61'
      />
      <Script
        async
        strategy='lazyOnload'
        src='https://www.googletagmanager.com/gtag/js?id=UA-226398370-1'
      />

      <Script src='/analytics.js' strategy='lazyOnload' />
      <Script src='/analyticsUniversal.js' strategy='lazyOnload' />

      <RPCClientProvider url={RPC_URL}>
        <RenProvider>
          <ToastContainer {...toastConfig} />
          <Component {...pageProps} />
        </RenProvider>
      </RPCClientProvider>
    </>
  );
}

export default appWithTranslation(MyApp);
