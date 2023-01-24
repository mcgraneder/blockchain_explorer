import { useCallback, useState, useEffect } from "react";
import EthereumJSONRPC from "@etclabscore/ethereum-json-rpc";
import { TransactionOrNull } from "@etclabscore/ethereum-json-rpc";
import { decodeContractInputData, InputData } from "src/lib/dataDecoder/contractInputDecoder";

export const useFetchTransactionMethods = (
  ethrpc: EthereumJSONRPC,
  pageStart: number,
  allTransactions: TransactionOrNull[]
) => {
  const [txMethods, setTxMethods] = useState<string[]>([]);

  const fetchTxnMethods = useCallback(async (): Promise<string[]> => {
    if (!ethrpc) return [];
    let methods: string[] = [];
    const decodedTxnPromises = allTransactions
      ?.slice(pageStart, pageStart + 15)
      ?.map((txm: TransactionOrNull) => {
        const decodedData = decodeContractInputData(txm?.hash!, ethrpc).catch((error: Error) =>
          console.error(error)
        );
        return decodedData;
      }) as Promise<InputData[]>[];

    const decodedTxns = (await Promise.all(decodedTxnPromises)) as InputData[][];
    decodedTxns.forEach((txn: InputData[]) => {
      if (!txn[0] || !txn[0].method) methods.push("Unknown");
      else if (txn[0].method === "exec" || txn[0].method === "execute")
        methods.push(txn[txn.length - 1].method!);
      else methods.push(txn[0].method);
    });
    return methods;
  }, [allTransactions, pageStart, ethrpc]);

  useEffect(() => {
    if (!allTransactions) return;
    fetchTxnMethods().then((methods: string[]) => {
      setTxMethods(methods);
    });
  }, [allTransactions, fetchTxnMethods]);

  return { txMethods, setTxMethods };
};
