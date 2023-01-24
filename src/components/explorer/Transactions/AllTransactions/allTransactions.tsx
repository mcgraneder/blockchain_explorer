import React from "react";
import EthereumJSONRPC from "@etclabscore/ethereum-json-rpc";
import useNavigation from "../../../../hooks/useNavigation";
import useAllTransactions from "../../../../hooks/useAllTransactions";
import DataContainer from "../../../DataContainer";
import AllTransactionsTab from "./AllTransactionsTab";
import TransactionSkeleton from "src/components/Skeletons/TransactionsSkeleton";

export interface IBlockViewProps {
  ethrpc: EthereumJSONRPC;
}

function AllTransactions(props: IBlockViewProps) {
  const { ethrpc } = props;

  const { handleBlock, handleAddress, handleTransaction } = useNavigation(ethrpc);
  const { allTransactions } = useAllTransactions(ethrpc);

  if (allTransactions.length == 0) {
    return <TransactionSkeleton title={"Transactions"} />;
  }

  return (
    <DataContainer title={"Transactions"} titleData={""} data={allTransactions}>
      <AllTransactionsTab
        ethrpc={ethrpc}
        allTransactions={allTransactions}
        handleAddress={handleAddress}
        handleBlock={handleBlock}
        handleTransaction={handleTransaction}
      />
    </DataContainer>
  );
}

export default AllTransactions;
