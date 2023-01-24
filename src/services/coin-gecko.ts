import API from "src/constants/Apis";
import { get } from "./axios";

export const CoinGeckoTokenIdsMap = {
  BTC: "bitcoin",
  ETH: "ethereum",
  DAI: "dai",
  USDC: "usd-coin",
  USDT: "tether",
  LUNA: "terra-luna",
  "1INCH": "1inch",
  ROOK: "rook",
  REN: "republic-protocol",
  BUSD: "binance-usd",
};

export type SupportedFiat = "USD";
export type SupportedToken = keyof typeof CoinGeckoTokenIdsMap;
export type SupportedTokens = Array<keyof typeof CoinGeckoTokenIdsMap>;
export type ResponseType = {
  [x in SupportedToken]: number;
};
export type ErrorResponse = "API_FAILED";

class CoinGeckoClass {
  async fetchPrice(tokens: SupportedTokens, currency: SupportedFiat) {
    try {
      const fiat = currency.toLowerCase();
      const ids = tokens.map((token) => CoinGeckoTokenIdsMap[token]).join(",");
      const response = await get<{ [token: string]: { [fiat: string]: unknown } }>(
        `${API.coinGecko.price}`,
        {
          params: { ids, vs_currencies: fiat },
        }
      );
      if (!response) {
        throw new Error("oops");
      }
      const formattedResponse = Object.keys(CoinGeckoTokenIdsMap).reduce((prev, curr) => {
        // @ts-expect-error
        const CGToken = CoinGeckoTokenIdsMap[curr];
        const value = response[CGToken]?.[fiat];
        if (value) return { ...prev, [curr]: value };
        return prev;
      }, {}) as ResponseType;

      return formattedResponse;
    } catch (error) {
      return "API_FAILED" as ErrorResponse;
    }
  }
  async getMarketData(tokens: SupportedTokens, currency: SupportedFiat) {
    try {
      const ids = tokens.map((token) => CoinGeckoTokenIdsMap[token]).join(",");
      return get<any>(API.coinGecko.markets, {
        params: {
          vs_currency: currency.toLowerCase(),
          ids: ids,
          price_change_percentage: "24h,7d,1y",
        },
      });
    } catch (error) {
      console.error(error);
      return "API_FAILED" as ErrorResponse;
    }
  }
}

const CG = new CoinGeckoClass();
export default CG;
