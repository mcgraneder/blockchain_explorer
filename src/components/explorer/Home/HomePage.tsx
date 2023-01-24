import React from "react";
import { BlockOrNull, TransactionOrNull } from "@etclabscore/ethereum-json-rpc";
import EthereumJSONRPC from "@etclabscore/ethereum-json-rpc";
import ExplorerHomeSkeleton from "../../Skeletons/ExplorerHomeSkeleton";
import DataSummaryContainer from "../../DataSummaryContainer";
import useNavigation from "src/hooks/useNavigation";

export interface IBlockViewProps {
  blocks: BlockOrNull[];
  transactions: TransactionOrNull[];
  ethrpc: EthereumJSONRPC;
  blockNumber: number;
}

function HomePage(props: IBlockViewProps) {
  const { blocks, transactions, ethrpc, blockNumber } = props;
  const { handleTransaction } = useNavigation(ethrpc);

  if (blocks.length == 0 || transactions.length == 0) {
    return (
      <div className=' mb-12 mt-5 mx-2 sm:mx-0 flex flex-col mlg:flex-row gap-8'>
        <ExplorerHomeSkeleton />
        <ExplorerHomeSkeleton />
      </div>
    );
  }

  return (
    <div className=' mb-8 mt-5 mx-2 sm:mx-0'>
      <div className=' flex flex-col mlg:flex-row items-center justify-center w-full gap-8'>
        <DataSummaryContainer
          isBlock={true}
          blocks={blocks}
          transactions={transactions}
          handleTransaction={handleTransaction}
          blockNumber={blockNumber}
        />
        <DataSummaryContainer
          isBlock={false}
          blocks={blocks}
          transactions={transactions}
          handleTransaction={handleTransaction}
          blockNumber={blockNumber}
        />
      </div>
    </div>
  );
}

export default HomePage;
