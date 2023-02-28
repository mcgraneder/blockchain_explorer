import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ExplorerWeb from "src/components/explorer/Home/ExplorerWeb";
import { useRPCClient } from "src/contexts/useRPCClient";

const ExplorerHomePage: NextPage = () => {
  const { ethRPC, recentBlocks, recentTransactions, blockNumber } = useRPCClient();
  return (
    <>
      <ExplorerWeb
        ethrpc={ethRPC}
        recentBlocks={recentBlocks}
        recentTransactions={recentTransactions}
        blockNumber={blockNumber}
      />
    </>
  );
};

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "errors"])),
  },
});

export default ExplorerHomePage;
