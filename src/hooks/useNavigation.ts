import { useCallback } from "react";
import { useRPCClient } from "src/contexts/useRPCClient";
import { fetchRecentBlock } from "./useActiveBlock";
import { fetchRecentTransaction } from "./useActiveTransaction";
import { useRouter } from "next/router";

interface IUseNavigatiorn {
  handleBlock: (x: string) => Promise<void>;
  handleAddress: (x: string) => void;
  handleTransaction: (x: string) => Promise<void>;
}
const useNavigation = (ethrpc: any): IUseNavigatiorn => {
  const { setActiveBlock, setAddress, setActiveTransaction } = useRPCClient();

  const handleBlock = useCallback(
    async (blockNumber: string): Promise<void> => {
      const currentBlock = await ethrpc.eth_blockNumber();
      if (currentBlock < blockNumber) return;

      const block = await fetchRecentBlock(ethrpc, blockNumber);

      setActiveBlock(block);
    },
    [ethrpc, setActiveBlock]
  );

  const handleAddress = useCallback(
    (address: string): void => {
      setAddress(address);
    },
    [setAddress]
  );

  const handleTransaction = useCallback(
    async (transactionHash: string): Promise<void> => {
      const block = await fetchRecentTransaction(ethrpc, transactionHash);
      setActiveTransaction(block as any);
    },
    [ethrpc, setActiveTransaction]
  );

  return { handleBlock, handleAddress, handleTransaction };
};

export default useNavigation;
