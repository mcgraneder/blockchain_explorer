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
import AllBlocks from "../../components/explorer/Blocks/AllBlocks";
import { LoadingIndicator } from "../../components/icons/LoadingIndicator";
import InputDataDecoder from "ethereum-input-data-decoder";

const BlockPage: NextPage = () => {
  const { ethRPC } = useRPCClient();

  if (!ethRPC) return <LoadingIndicator />;
  return (
    <>
      <Layout>
        <AllBlocks ethrpc={ethRPC} />
      </Layout>
    </>
  );
};

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "errors"])),
  },
});

export default BlockPage;
