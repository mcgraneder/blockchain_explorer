import {
  useState,
  useEffect,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useRef,
  MutableRefObject,
  useCallback,
} from "react";
import useEthRPC from "../hooks/useRPC";
import { useRecentBlocks } from "../hooks/useRecentBlocks";
import { useRecentTransactions } from "../hooks/useRecentTransactions";
import EthereumJSONRPC from "@etclabscore/ethereum-json-rpc";
import useInterval from "use-interval";
import { useRouter } from "next/router";
import { useBlockNumber } from "../helpers/helpers";

interface RPCClientProviderProps {
  children: React.ReactNode;
  url: string;
}

type AuthContextType = {
  ethRPC: EthereumJSONRPC;
  activeTransaction: any;
  setActiveTransaction: Dispatch<SetStateAction<any>>;
  activeBlock: any;
  setActiveBlock: any;
  address: any;
  setAddress: any;
  recentBlocks: any;
  setRecentBlocks: any;
  recentTransactions: any;
  setRecentTransactions: any;
  previousPathRef: MutableRefObject<string | null>;
  flow: string[];
  popFlow: () => void;
  pushFlow: (nf: string) => void;
  blockNumber: number;
};

const RPCClientContext = createContext({} as AuthContextType);

function RPCClientProvider({ children, url }: RPCClientProviderProps) {
  const [ethRPC] = useEthRPC(url);
  const [activeTransaction, setActiveTransaction] = useState<any>();
  const [activeBlock, setActiveBlock] = useState<any>();
  const [address, setAddress] = useState<any>("");
  const { asPath } = useRouter();

  const [blockNumber] = useBlockNumber(ethRPC);
  const { recentBlocks, setRecentBlocks } = useRecentBlocks(ethRPC);
  const { recentTransactions, setRecentTransactions } = useRecentTransactions(ethRPC);
  const [flow, setFlow] = useState<Array<string>>([]);

  const pushFlow = useCallback((nf: string) => setFlow((f) => [...f, nf]), []);
  const popFlow = useCallback(
    () =>
      setFlow((f) => {
        const fl = [...f];
        fl.pop();
        return fl;
      }),
    []
  );

  useEffect(() => {
    pushFlow(asPath);
  }, [asPath, pushFlow]);

  const previousPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (ethRPC) {
      ethRPC.startBatch();
    }
  }, [ethRPC]);

  useInterval(
    () => {
      if (ethRPC) {
        ethRPC.stopBatch();
        ethRPC.startBatch();
      }
    },
    100,
    true
  );

  return (
    <RPCClientContext.Provider
      value={{
        ethRPC,
        activeTransaction,
        setActiveTransaction,
        activeBlock,
        setActiveBlock,
        address,
        setAddress,
        recentBlocks,
        setRecentBlocks,
        recentTransactions,
        setRecentTransactions,
        previousPathRef,
        flow,
        popFlow,
        pushFlow,
        blockNumber,
      }}>
      {children}
    </RPCClientContext.Provider>
  );
}

const useRPCClient = () => {
  return useContext(RPCClientContext);
};

export { RPCClientProvider, useRPCClient };
