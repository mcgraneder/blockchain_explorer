import type { NextPage } from "next";
import { Layout } from "src/layouts";
import { RenTransaction } from "src/components/explorer/Ren/RenTransaction/RenTransaction";

const RenTransactions: NextPage = () => {
  return (
    <>
      <Layout>
        <RenTransaction />
      </Layout>
    </>
  );
};

export default RenTransactions;
