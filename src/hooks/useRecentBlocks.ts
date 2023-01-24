import { useState, useEffect, useCallback } from "react";
import ERPC, { BlockOrNull } from "@etclabscore/ethereum-json-rpc";
import { hexToNumber } from "@etclabscore/eserialize";

export const useRecentBlocks = (ethrpc: ERPC) => {
  const [recentBlocks, setRecentBlocks] = useState<BlockOrNull[]>([]);

  const range = (start: number, stop: number, step: number): number[] => {
    return Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
  };
  const fetchRecentBlocks = useCallback(async (): Promise<BlockOrNull[] | void> => {
    if (!ethrpc) return;
    const currentBlock = await ethrpc.eth_blockNumber();
    const lb = range(Number(currentBlock) - 12, Number(currentBlock), 1);

    let latestBlocksProms = lb.map((number: any): BlockOrNull => {
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
  }, [ethrpc]);

  useEffect(() => {
    fetchRecentBlocks().then((blocks: BlockOrNull[] | void) => {
      if (!blocks) return;
      setRecentBlocks(blocks);
    });
    let internal = setInterval(() => {
      // Refresh every 60 seconds if the page is in focus.
      if (document.hasFocus()) {
        fetchRecentBlocks().then((blocks: BlockOrNull[] | void) => {
          if (!blocks) return;
          setRecentBlocks(blocks);
        });
      }
    }, 10 * 1000);
    return () => clearInterval(internal);
  }, [fetchRecentBlocks]);

  return { recentBlocks, setRecentBlocks };
};
