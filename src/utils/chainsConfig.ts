import { isProduction } from "./misc";

export enum Chains {
  Arbitrum = "Arbitrum",
  Aurora = "Aurora",
  Avalanche = "Avalanche",
  BinanceSmartChain = "BinanceSmartChain",
  Cronos = "Cronos",
  Catalog = "Catalog",
  Ethereum = "Ethereum",
  Fantom = "Fantom",
  KavaEVM = "KavaEVM",
  Klaytn = "Klaytn",
  Moonbeam = "Moonbeam",
  Optimism = "Optimism",
  Polygon = "Polygon",
}

export type NetworkConfig = {
  id: string | number;
  fullName: string;
  shortName?: string;
};

export const NetworkToChainId: { [chain: string]: number } = isProduction()
  ? {
      [Chains.Ethereum]: 1,
      [Chains.BinanceSmartChain]: 56,
      [Chains.Catalog]: 1,
      [Chains.Polygon]: 137,
    }
  : {
      [Chains.Ethereum]: 5,
      [Chains.BinanceSmartChain]: 97,
      [Chains.Catalog]: 18414,
      [Chains.Polygon]: 80001,
    };

export const ChainIdToNetwork: { [x: number]: Chains } = isProduction()
  ? {
      [1]: Chains.Ethereum,
      [56]: Chains.BinanceSmartChain,
      [3120]: Chains.Catalog,
      [137]: Chains.Polygon,
    }
  : {
      [5]: Chains.Ethereum,
      [97]: Chains.BinanceSmartChain,
      [18414]: Chains.Catalog,
      [80001]: Chains.Polygon,
    };

export const ChainRpcs: Record<Chains, { rpcs: string[] }> = {
  Arbitrum: { rpcs: ["https://goerli-rollup.arbitrum.io/rpc"] },
  Aurora: { rpcs: ["https://testnet.aurora.dev"] },
  Avalanche: {
    rpcs: ["https://rpc.ankr.com/avalanche_fuji", "https://api.avax-test.network/ext/bc/C/rpc"],
  },
  BinanceSmartChain: {
    rpcs: [
      "https://data-seed-prebsc-1-s3.binance.org:8545",
      "https://data-seed-prebsc-1-s2.binance.org:8545",
      "https://data-seed-prebsc-1-s3.binance.org:8545",
    ],
  },
  Cronos: {
    rpcs: ["https://evm-t3.cronos.org", "https://cronos-testnet-3.crypto.org:8545"],
  },
  Ethereum: {
    rpcs: [
      "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    ],
  },
  Catalog: {
    rpcs: ["https://rpc.catalog.fi/testnet", "https://rpc.catalog.fi/testnet"],
  },
  Fantom: {
    rpcs: ["https://rpc.ankr.com/fantom_testnet", "https://rpc.testnet.fantom.network"],
  },
  KavaEVM: { rpcs: ["https://evm.testnet.kava.io"] },
  Klaytn: { rpcs: ["https://api.baobab.klaytn.net:8651"] },
  Moonbeam: {
    rpcs: ["https://rpc.testnet.moonbeam.network", "https://rpc.api.moonbase.moonbeam.network"],
  },
  Optimism: { rpcs: ["https://goerli.optimism.io"] },
  Polygon: {
    rpcs: ["https://rpc-mumbai.maticvigil.com", "https://rpc-mumbai.maticvigil.com"],
  },
};
