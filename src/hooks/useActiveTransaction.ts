import ERPC from "@etclabscore/ethereum-json-rpc";
import { TransactionReceiptOrNull } from "@etclabscore/ethereum-json-rpc";

export const fetchRecentTransaction = async (
  ethrpc: ERPC,
  transactionHash: string
): Promise<TransactionReceiptOrNull> => {
  const tx = (await ethrpc.eth_getTransactionByHash(transactionHash).catch((error) => {
    console.error(error);
  })) as TransactionReceiptOrNull;
  if (!tx) console.log(`Error fetching Transaction. check that hash is valid`);
  return tx;
};
