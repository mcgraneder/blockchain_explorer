import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Layout } from "src/layouts";
import { useRPCClient } from "src/contexts/useRPCClient";
import AllTransactions from "../../components/explorer/Transactions/AllTransactions/allTransactions";
import { LoadingIndicator } from "../../components/icons/LoadingIndicator";

const TransactionPage: NextPage = () => {
  const { ethRPC } = useRPCClient();

  if (!ethRPC) return <LoadingIndicator />;
  return (
    <>
      <Layout>
        <AllTransactions ethrpc={ethRPC} />
      </Layout>
    </>
  );
};

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "errors"])),
  },
});

export default TransactionPage;
