import { useState, useEffect, useCallback } from "react";
import ERPC, { BlockOrNull, TransactionOrNull } from "@etclabscore/ethereum-json-rpc";

export const useRecentTransactions = (ethrpc: ERPC) => {
  const [recentTransactions, setRecentTransactions] = useState<TransactionOrNull[]>([]);

  const range = (start: number, stop: number, step: number): number[] => {
    return Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
  };
  const fetchRecentBlocks = useCallback(async (): Promise<TransactionOrNull[] | void> => {
    if (!ethrpc) return;
    const currentBlock = await ethrpc.eth_blockNumber();
    const lb = range(Number(currentBlock) - 10, Number(currentBlock), 1);

    let latestBlocksProms = lb.map((number: any): BlockOrNull => {
      const hexlified = `0x${number.toString(16)}`;
      const block = ethrpc.eth_getBlockByNumber(hexlified, false).catch((error) => {
        console.error(error);
      }) as BlockOrNull;
      return block;
    });
    const p = await Promise.all(latestBlocksProms);

    let latestTxs: TransactionOrNull[] = [];
    if (p) {
      const latestTransactionProms = p.map((transaction): Promise<TransactionOrNull> => {
        const tx = ethrpc
          .eth_getTransactionByHash(transaction?.transactions![0] as string)
          .catch((error) => {
            console.error(error);
          }) as Promise<TransactionOrNull>;
        return tx;
      });

      latestTxs = await Promise.all(latestTransactionProms);
    }

    latestTxs?.forEach((tx: TransactionOrNull, i) => {
      if (!tx) return;
      tx.timestamp = p[i]?.timestamp;
    });

    const sortedTxs = latestTxs?.sort(
      (a: any, b: any) => Number(b.blockNumber) - Number(a.blockNumber)
    );

    return sortedTxs;
  }, [ethrpc]);

  useEffect(() => {
    fetchRecentBlocks().then((transaction: TransactionOrNull[] | void) => {
      if (!transaction) return;
      setRecentTransactions(transaction);
    });
    let internal = setInterval(() => {
      // Refresh every 60 seconds if the page is in focus.
      if (document.hasFocus()) {
        fetchRecentBlocks().then((transaction: TransactionOrNull[] | void) => {
          if (!transaction) return;
          setRecentTransactions(transaction);
        });
      }
    }, 10 * 1000);
  }, [fetchRecentBlocks]);

  return { recentTransactions, setRecentTransactions };
};
