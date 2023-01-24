import React, { useState, useEffect, useCallback, Dispatch } from "react";
import EthereumJSONRPC from "@etclabscore/ethereum-json-rpc";
import getBlocks from "../helpers/helpers";
import { hexToNumber } from "@etclabscore/eserialize";
import _ from "lodash";
import { TransactionOrNull } from "@etclabscore/ethereum-json-rpc";
import { useBlockNumber } from "../helpers/helpers";
import { SetStateAction } from "react";
import { BlockOrNull } from "@etclabscore/ethereum-json-rpc";

interface IAllTransactions {
  allTransactions: TransactionOrNull[];
  setAllTransactions: Dispatch<SetStateAction<TransactionOrNull[]>>;
}
const useAllTransactions = (ethrpc: EthereumJSONRPC): IAllTransactions => {
  const [allTransactions, setAllTransactions] = useState<TransactionOrNull[]>([]);
  const [currentBlock]: [number] = useBlockNumber(ethrpc);

  const getRange = useCallback(async (): Promise<{ start: number; end: number }> => {
    const start = Number(currentBlock);
    const end = Number(currentBlock) - 165;
    return { start, end };
  }, [currentBlock]);

  useEffect(() => {
    (async () => {
      const { start, end } = await getRange();
      getBlocks(end, start, ethrpc).then((blcks: BlockOrNull[]) => {
        const txes = _.flatMap(blcks, "transactions");

        const sortedTxes = txes.sort((a: TransactionOrNull, b: TransactionOrNull) => {
          return hexToNumber(b?.blockNumber!) - hexToNumber(a?.blockNumber!);
        });
        setAllTransactions(sortedTxes);
      });
    })();
  }, [getRange, ethrpc]);

  return { allTransactions, setAllTransactions };
};

export default useAllTransactions;
