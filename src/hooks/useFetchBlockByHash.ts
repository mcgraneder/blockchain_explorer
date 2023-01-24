import ERPC from "@etclabscore/ethereum-json-rpc";
import { BlockOrNull } from "@etclabscore/ethereum-json-rpc";

export const fetchBlockByHash = async (ethrpc: ERPC, hash: string): Promise<BlockOrNull> => {
  let block: BlockOrNull | void;
  block = await ethrpc.eth_getBlockByHash(hash, false).catch((error) => {
    console.error(error);
  });

  if (!block) console.log(`Unable to fetch block. are you sure the hash is valid.`);

  return block as BlockOrNull;
};
