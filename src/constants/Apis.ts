import { isProduction } from "../utils/misc";

let DOMAIN = "";
if (typeof window === "undefined") {
  if (isProduction()) DOMAIN = "https://app.catalog.fi";
  else DOMAIN = "https://app-dev.catalog.fi";
} else DOMAIN = window.location.origin;


const NextBaseUrl = `${DOMAIN}/api/v1`;

const RenBaseUrl = isProduction()
  ? "https://api-mainnet.catalog.fi"
  : "https://catalog-solidity-api-testnet-pr-67.onrender.com"; // "http://localhost:4000";

const SmartWalletBaseUrl = isProduction()
  ? "https://wallet.catalog.fi"
  : "https://wallet-pr-5.onrender.com";

const AnalyticsUrl = isProduction()
  ? "https://catalog-bl-analytics-ui-mainnet.onrender.com/"
  : "https://catalog-bl-analytics-ui-testnet.onrender.com/";

  const renExplorerLinkBaseUrl = isProduction()
    ? `https://explorer.renproject.io/tx/`
    : `https://explorer-testnet.renproject.io/tx/`;

const CoinGeckoBaseUrl = "https://api.coingecko.com/api/v3";

const API = {
  next: {
    decrypt: `${NextBaseUrl}/decrypt`,
    account: `${NextBaseUrl}/account`,
    catInfo: `${NextBaseUrl}/catinfo`,
    emailInfo: `${NextBaseUrl}/emailinfo`,
    address: `${NextBaseUrl}/address`,
    version: `${NextBaseUrl}/version`,

    txsByStatus: `${NextBaseUrl}/txsByStatus`,
    depositTx: `${NextBaseUrl}/depositTx`,
    withdrawTx: `${NextBaseUrl}/withdrawTx`,
    transferTx: `${NextBaseUrl}/transferTx`,
    swapTx: `${NextBaseUrl}/swapTx`,
    txs: `${NextBaseUrl}/txs`, // firestore
    transactions: `${NextBaseUrl}/transactions`, // PSQL
    status: `${NextBaseUrl}/status`,
  },
  smartWallet: {
    relayer: `${SmartWalletBaseUrl}/relayer`,
    addresses: `${SmartWalletBaseUrl}/addresses`,
    transactions: `${SmartWalletBaseUrl}/transactions`,
  },
  ren: {
    tokens: `${RenBaseUrl}/tokens`,
    balancesOf: `${RenBaseUrl}/balancesOf`,
    balanceOf: `${RenBaseUrl}/balanceOf`,
    submitRelayTx: `${RenBaseUrl}/submitRelayTx`,
    submitBLRelayTx: `${RenBaseUrl}/submitBLRelayTx`,
    queryRelayTx: `${RenBaseUrl}/queryRelayTx`,
    liquidity: `${RenBaseUrl}/liquidity`,
    getPubkeyForAsset: `${RenBaseUrl}/getPubkeyForAsset`,
    buyTxTypedData: `${RenBaseUrl}/buyTxTypedData`,
    sellTxTypedData: `${RenBaseUrl}/sellTxTypedData`,

    transferTxTypedData: `${RenBaseUrl}/transferTxTypedData`,
    submitMintRenTx: `${RenBaseUrl}/submitMintRenTx`,
    smartWalletWithdrawTxTypedData: `${RenBaseUrl}/smartWalletWithdrawTxTypedData`,
    queryRenTx: `${RenBaseUrl}/queryRenTx`,
    relayCompleteMint: `${RenBaseUrl}/relayCompleteMint`,
    burnTxTypedData: `${RenBaseUrl}/burnTxTypedData`,
    submitBurnRenTx: `${RenBaseUrl}/submitBurnRenTx`,
    getReleaseTx: `${RenBaseUrl}/getReleaseTx`,
    poolState: `${RenBaseUrl}/poolState`,

    bl: {
      path: `${RenBaseUrl}/bl/path`,
      status: `${RenBaseUrl}/bl/status`,
      buildTx: `${RenBaseUrl}/bl/buildTx`,
      submitTx: `${RenBaseUrl}/bl/submitTx`,
      updateNativeTx: `${RenBaseUrl}/bl/updateNativeTx`,
    },
  },
  coinGecko: {
    price: `${CoinGeckoBaseUrl}/simple/price`,
    markets: `${CoinGeckoBaseUrl}/coins/markets/`,
  },
};

export const redirectLinks = {
  analytics: AnalyticsUrl,
  renExplorerLink: renExplorerLinkBaseUrl,
}

export default API;
