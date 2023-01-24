import { useState, useEffect, useCallback } from "react";
import ERPC, { BlockOrNull } from "@etclabscore/ethereum-json-rpc";
import { hexToNumber } from "@etclabscore/eserialize";

export const useAllBlocks = (ethrpc: ERPC, startLimit: number) => {
  const [allBlocks, setAllBlocks] = useState<BlockOrNull[]>([]);

  const range = (start: number, stop: number, step: number) => {
    return Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
  };
  const fetchRecentBlocks = useCallback(async (): Promise<BlockOrNull[]> => {
    const currentBlock = await ethrpc.eth_blockNumber();
    const lb = range(Number(currentBlock) - startLimit, Number(currentBlock), 1);

    let latestBlocksProms = lb.map((number: any) => {
      const hexlified = `0x${number.toString(16)}`;
      const block = ethrpc.eth_getBlockByNumber(hexlified, false).catch((error) => {
        console.error(error);
      }) as BlockOrNull;
      return block;
    });
    const p = await Promise.all(latestBlocksProms);
    const sortedBlocks = p.sort((a: BlockOrNull, b: BlockOrNull) => {
      return hexToNumber(b?.number!) - hexToNumber(a?.number!);
    });
    return sortedBlocks;
  }, [ethrpc, startLimit]);

  useEffect(() => {
    fetchRecentBlocks().then((blocks: BlockOrNull[]) => {
      setAllBlocks(blocks);
    });
  }, [fetchRecentBlocks]);

  return { allBlocks, setAllBlocks };
};
