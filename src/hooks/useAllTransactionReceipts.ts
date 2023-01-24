import React, { useState, useEffect, useCallback, Dispatch } from "react";
import EthereumJSONRPC from "@etclabscore/ethereum-json-rpc";
import getBlocks from "../helpers/helpers";
import { hexToNumber } from "@etclabscore/eserialize";
import _ from "lodash";
import { TransactionOrNull } from "@etclabscore/ethereum-json-rpc";
import { useBlockNumber } from "../helpers/helpers";
import { SetStateAction } from "react";
import { BlockOrNull, TransactionReceiptOrNull } from "@etclabscore/ethereum-json-rpc";

interface IAllTransactions {
  allTransactionsReceipts: TransactionReceiptOrNull[];
  setAllTransactionsReceipts: Dispatch<SetStateAction<TransactionReceiptOrNull[]>>;
}
const useAllTransactionReceipts = (ethrpc: EthereumJSONRPC): IAllTransactions => {
  const [allTransactionsReceipts, setAllTransactionsReceipts] = useState<
    TransactionReceiptOrNull[]
  >([]);
  const [currentBlock]: [number] = useBlockNumber(ethrpc);

  const getRange = useCallback(async (): Promise<{ start: number; end: number }> => {
    const start = Number(currentBlock);
    const end = Number(currentBlock) - 160;
    return { start, end };
  }, [currentBlock]);

  useEffect(() => {
    (async () => {
      const { start, end } = await getRange();
      getBlocks(end, start, ethrpc).then((blcks: BlockOrNull[]) => {
        const txes = _.flatMap(blcks, "transactions");
        const sortedTxes = _.sortBy(txes, (tx: any) => {
          return hexToNumber(tx.blockNumber);
        }).reverse();

        setAllTransactionsReceipts(sortedTxes);
      });
    })();
  }, [getRange, ethrpc]);

  return { allTransactionsReceipts, setAllTransactionsReceipts };
};

export default useAllTransactionReceipts;
