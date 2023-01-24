import { createContext, useCallback, useContext, useState, useMemo } from "react";
import RenJS from "@renproject/ren";
import { allChains } from "src/lib/chains/chains";
import {
  RenVMGateway,
  LegacyRenVMTransaction,
  RenVMTransaction,
  SummarizedTransaction,
  SearchResult,
} from "../lib/searchResult";
import { ChainMapper } from "../lib/chains/chains";
import { RenNetwork, utils } from "@renproject/utils";
import { unmarshalTransaction } from "../lib/searchTactics/searchRenVMHash";
import { searchGateway } from "../lib/searchGateway";
import { searchTransaction } from "../lib/searchTransaction";
import { isProduction } from "../utils/misc";

interface RenProviderProps {
  children: React.ReactNode;
}

type RenProviderContextType = {
  transaction: any;
  setTransaction: any;
  gateway: any;
  setGateway: any;
  renJS: any;
  getChain: any;
  latestTransactions: any;
  fetchLatestTransactions: any;
  setSearchResult: any;
  handleGatewayUrl: (encodedGatewayInput: string) => void;
  handleTransactionUrl: (encodedTransactionInput: string) => void;
  getChainDetails: any;
  refresh: any;
  fetchingError: Error | null;
  fetching: boolean;
  page: number;
  refreshed: boolean;
};

const RenProviderContext = createContext({} as RenProviderContextType);

function RenProvider({ children }: RenProviderProps) {
  const [transaction, setTransaction] = useState<
    RenVMTransaction | LegacyRenVMTransaction | null | Error
  >(null);
  const [gateway, setGateway] = useState<RenVMGateway | null | Error>(null);
  const [fetching, setFetching] = useState<boolean>(false);
  const [fetchingError, setFetchingError] = useState<Error | null>(null);
  const [refreshed, setRefreshed] = useState<boolean>(false);

  const [latestTransactions, setLatestTransactions] = useState<
    SummarizedTransaction[] | undefined
  >();
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [updatedCount, setUpdatedCount] = useState(0);
  const [page, setPage] = useState<number>(0);

  const renJS = useMemo(() => {
    return new RenJS(
      isProduction() ? "https://rpc.renproject.io" : "https://rpc-testnet.renproject.io"
    );
  }, []);

  const getChainDetails = useCallback((chainName: string) => {
    for (const chain of allChains) {
      if (chain.chainPattern.exec(chainName) || Object.values(chain.assets).includes(chainName)) {
        return chain;
      }
    }
    return null;
  }, []);

  const getChain = useCallback(
    (chain: string) => {
      const chainName = getChainDetails(chain)?.chain || chain;

      const chains = renJS.chains;

      const chainDetails = getChainDetails(chain);

      const existingChain = chains[chainName] || (chainDetails && chains[chainDetails.chain]);
      Object.values(chains).find((chain) => Object.values(chain?.assets || {}).includes(chainName));
      if (existingChain) {
        return existingChain;
      }

      if (!chainDetails) {
        return null;
      }

      try {
        const chain = ChainMapper(
          chainDetails.chain,
          isProduction() ? RenNetwork.Mainnet : RenNetwork.Testnet
        );
        if (chain) {
          renJS.withChain(chain);
        }
        return chain;
      } catch (error: any) {
        console.error(error);
        return null;
      }
    },
    [renJS, getChainDetails]
  );

  const fetchLatestTransactions = useCallback(
    async (newPage: number, txAmount: number) => {
      setLatestTransactions(undefined);
      const { txs } = (await renJS.provider.sendMessage(
        "ren_queryTxs" as any as never,
        {
          latest: true,
          offset: String(newPage * txAmount),
          limit: String(txAmount),
        } as any as never
      )) as any; //{ txs: Resp["tx"][] };
      let txsUnmarshalled = (
        await Promise.all(
          txs.map(async (tx: any) => {
            try {
              return await unmarshalTransaction({ tx, txStatus: undefined }, getChain);
            } catch (error) {
              console.error(error);

              return undefined;
            }
          })
        )
      ).filter(utils.isDefined);

      setPage(newPage);
      setLatestTransactions(txsUnmarshalled);
    },
    [renJS, getChain, setLatestTransactions]
  );

  const handleTransactionUrl = useCallback(
    (encodedTransactionInput: string) => {
      const transactionInput = decodeURIComponent(encodedTransactionInput);

      let transaction: RenVMTransaction = RenVMTransaction(transactionInput);
      if (
        searchResult &&
        !Array.isArray(searchResult) &&
        searchResult.resultPath === transaction.resultPath
      ) {
        transaction = searchResult as RenVMTransaction;
      }

      setTransaction(transaction);

      searchTransaction(transaction, getChain, renJS)
        .then((transaction) => {
          setTransaction(transaction);
          setUpdatedCount((count) => count + 1);
        })
        .catch((error) =>
          setTransaction({
            ...transaction,
            queryTx: error,
          })
        );
    },
    [searchResult, setTransaction, getChain, renJS]
  );

  const handleGatewayUrl = useCallback(
    (encodedGatewayInput: string) => {
      const gatewayInput = decodeURIComponent(encodedGatewayInput);

      let gateway: RenVMGateway = RenVMGateway(gatewayInput);
      if (
        searchResult &&
        !Array.isArray(searchResult) &&
        searchResult.resultPath === gateway.resultPath
      ) {
        gateway = searchResult as RenVMGateway;
      }

      setGateway(gateway);
      setUpdatedCount((count) => count + 1);

      searchGateway(gateway, getChain, renJS)
        .then((gateway) => {
          setGateway(gateway);
          setUpdatedCount((count) => count + 1);
        })
        .catch((error) =>
          setGateway({
            ...gateway,
            queryGateway: error,
          })
        );
    },
    [searchResult, getChain, renJS]
  );

  const refresh = useCallback(
    async (nextPage: number, manualCall?: boolean) => {
      setRefreshed(false);
      setFetching(true);
      setFetchingError(null);
      try {
        await fetchLatestTransactions(nextPage, 16);
        if (!manualCall) {
          setRefreshed(true);
          setTimeout(() => setRefreshed(false), 200);
        }
      } catch (error: any) {
        setFetchingError(error);
      }
      setFetching(false);
    },
    [fetchLatestTransactions]
  );

  return (
    <RenProviderContext.Provider
      value={{
        transaction,
        setTransaction,
        gateway,
        setGateway,
        renJS,
        getChain,
        latestTransactions,
        fetchLatestTransactions,
        setSearchResult,
        handleGatewayUrl,
        handleTransactionUrl,
        getChainDetails,
        refresh,
        fetchingError,
        fetching,
        page,
        refreshed,
      }}>
      {children}
    </RenProviderContext.Provider>
  );
}

const useRenProvider = () => {
  return useContext(RenProviderContext);
};

export { RenProvider, useRenProvider };
