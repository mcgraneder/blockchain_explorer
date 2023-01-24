import React from "react";
import { Layout } from "../../../layouts";
import HomePage from "./HomePage";
import Search from "./Search";
import { LatestTxData } from "../Ren/LatestRenTransactions/LatestTxData";
import EthereumJSONRPC from "@etclabscore/ethereum-json-rpc";
import { BlockOrNull } from "@etclabscore/ethereum-json-rpc";
import { TransactionOrNull } from "@etclabscore/ethereum-json-rpc";
import { UilArrowUp, UilArrowDown } from "@iconscout/react-unicons";

export interface TabInfo {
  title: string;
}

interface IExplorerWeb {
  ethrpc: EthereumJSONRPC;
  recentBlocks: BlockOrNull[];
  recentTransactions: TransactionOrNull[];
  blockNumber: number;
}
const ExplorerWeb = ({ ethrpc, recentBlocks, recentTransactions, blockNumber }: IExplorerWeb) => {
  return (
    <Layout>
      <Search ethrpc={ethrpc} />
      <HomePage
        blocks={recentBlocks}
        transactions={recentTransactions}
        ethrpc={ethrpc}
        blockNumber={blockNumber}
      />
      <LatestTxData />
    </Layout>
  );
};

export default ExplorerWeb;
