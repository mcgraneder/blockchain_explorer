import type { NextPage } from "next";
import { Layout } from "src/layouts";
import { useRPCClient } from "src/contexts/useRPCClient";

import TransactionData from "../../components/explorer/Transactions/TransactionData";
import { LoadingIndicator } from "../../components/icons/LoadingIndicator";

const TransactionsPage: NextPage = () => {
  const { ethRPC } = useRPCClient();

  if (!ethRPC) return <LoadingIndicator />;
  return (
    <>
      <Layout>
        <TransactionData ethrpc={ethRPC} />
      </Layout>
    </>
  );
};

export default TransactionsPage;
