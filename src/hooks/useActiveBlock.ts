import ERPC, { BlockOrNull } from "@etclabscore/ethereum-json-rpc";
import ETHJSONSpec from "../../openrpc.json";

const isKeccakHash = (trimmedSearchQuery: string): boolean => {
  return new RegExp(ETHJSONSpec.components.schemas.Keccak.pattern).test(trimmedSearchQuery);
};

export const fetchRecentBlock = async (ethrpc: ERPC, blockNumber: string) => {
  if (!ethrpc) return;
  const hexlified = `0x${Number(blockNumber).toString(16)}`;
  let block: BlockOrNull = null;

  if (isKeccakHash(blockNumber)) {
    block = (await ethrpc.eth_getBlockByHash(blockNumber, true).catch((error) => {
      console.error(error);
    })) as BlockOrNull;
  } else {
    block = (await ethrpc.eth_getBlockByNumber(hexlified, true).catch((error) => {
      console.error(error);
    })) as BlockOrNull;
  }
  return block;
};
