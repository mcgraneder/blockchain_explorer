import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Layout } from "src/layouts";
import { Breakpoints } from "src/utils/Breakpoints";
import { useViewport } from "../../hooks/useViewport";
import { useRPCClient } from "src/contexts/useRPCClient";
import useEthRPC from "../../hooks/useRPC";
import { useState, useEffect } from "react";
import { useRecentBlocks } from "../../hooks/useRecentBlocks";
import { useRecentTransactions } from "../../hooks/useRecentTransactions";
import useInterval from "use-interval";
import AllTransactions from "../../components/explorer/Transactions/AllTransactions/allTransactions";
import { LoadingIndicator } from "../../components/icons/LoadingIndicator";
import AllRenTransactions from "../../components/explorer/Ren/RenTransaction/AllRenTransactions";

const RenTransactions: NextPage = () => {
  return (
    <>
      <Layout>
        <AllRenTransactions />
      </Layout>
    </>
  );
};

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "errors"])),
  },
});

export default RenTransactions;
