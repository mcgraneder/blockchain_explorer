import React, { useEffect, useState } from "react";
import { hexToNumber } from "@etclabscore/eserialize";
import EthereumJSONRPC, { BlockOrNull } from "@etclabscore/ethereum-json-rpc";
import { useRouter } from "next/router";
import { useRPCClient } from "src/contexts/useRPCClient";
import useNavigation from "src/hooks/useNavigation";
import DataSkeleton from "src/components/Skeletons/DataSkeleton";
import DataContainer from "src/components/DataContainer";
import { TransactionOrNull } from "@etclabscore/ethereum-json-rpc";
import {
  decodeContractEventLogs,
  DecodedEventLogsType,
} from "src/lib/dataDecoder/contractEventLOgDecoder";
import { decodeContractInputData, InputData } from "../../../lib/dataDecoder/contractInputDecoder";
import TransactionLogs from "./TransactionLogs";
import { Tab } from "../types/explorerTypes";
import TransactionDataTab from "./TransactionDataTab";
import DecodedTransactionDataTab from "./DecodedTransactionTab";
import { isKeccakHash } from "src/utils/misc";

export interface IBlockViewProps {
  ethrpc: EthereumJSONRPC;
}

function TransactionData(props: IBlockViewProps) {
  const { ethrpc } = props;
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [decodedEventLogs, setDecodedEventLogs] = useState<Array<DecodedEventLogsType>>();
  const [decodedInputData, setDecodedInputData] = useState<Array<InputData>>();

  const { query, push } = useRouter();
  const { handleBlock, handleAddress } = useNavigation(ethrpc);
  const { setActiveBlock, activeTransaction: transaction, setActiveTransaction } = useRPCClient();

  const tabs: Tab[] = [
    {
      tabName: "Overview",
      tabNumber: 0,
      component: (
        <TransactionDataTab
          ethrpc={ethrpc}
          transaction={transaction}
          setActiveBlock={setActiveBlock}
          handleAddress={handleAddress}
          handleBlock={handleBlock}
          decodedInputData={decodedInputData}
        />
      ),
    },
    {
      tabName: "Logs",
      tabNumber: 1,
      component: <TransactionLogs transaction={transaction} ethrpc={ethrpc} />,
    },
    {
      tabName: "Txn data",
      tabNumber: 2,
      component: <DecodedTransactionDataTab transaction={transaction} ethrpc={ethrpc} />,
    },
  ];

  useEffect(() => {
    if (!query.transactionId) return;
    const isValidTx = isKeccakHash(query.transactionId as string);
    if (!isValidTx) push("/404");
    ethrpc
      .eth_getTransactionByHash(query.transactionId as string)
      .then((transaction: TransactionOrNull) => {
        setActiveTransaction(transaction);
        console.log(transaction);
      })
      .catch((error: Error) => console.error(error));

    decodeContractEventLogs(query.transactionId as string, ethrpc).then(
      (decodedEvents: DecodedEventLogsType[]) => setDecodedEventLogs(decodedEvents)
    );

    decodeContractInputData(query.transactionId as string, ethrpc).then(
      (decodedData: InputData[]) => {
        setDecodedInputData(decodedData);
      }
    );

    ethrpc
      .eth_getBlockByHash(query.transactionId as string, true)
      .then((block: BlockOrNull) => setActiveBlock(block))
      .catch((error: Error) => console.error(error));
  }, [query]);

  if (!transaction || !decodedEventLogs || !decodedInputData) {
    return <DataSkeleton title={"Transaction"} />;
  }

  const txn = `${transaction.hash.substring(0, 20)}...`;
  return (
    <DataContainer
      title={"Transaction"}
      titleData={txn}
      currentTab={currentTab}
      tabs={tabs}
      setCurrentTab={setCurrentTab}
      data={transaction}>
      {tabs.map((tabData: Tab) => {
        return <>{currentTab === tabData.tabNumber ? tabData.component : null}</>;
      })}
    </DataContainer>
  );
}

export default TransactionData;
