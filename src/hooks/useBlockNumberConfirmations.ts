import ERPC from "@etclabscore/ethereum-json-rpc";
import { useBlockNumber } from "../helpers/helpers";
import { useState, useEffect } from "react";

export const useNumberOfBlockConfirmations = (
  ethrpc: ERPC,
  blockNumber: string
): { blockConfirmations: number } => {
  const [blockConfirmations, setBlockConfirmations] = useState<number>(0);
  const [currentBlock]: [number] = useBlockNumber(ethrpc);

  useEffect(() => {
    if (!ethrpc) return;
    setBlockConfirmations(currentBlock - Number(blockNumber));
  }, [currentBlock, ethrpc, blockNumber]);

  return { blockConfirmations };
};
