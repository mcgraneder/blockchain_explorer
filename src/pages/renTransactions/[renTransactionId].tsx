import type { GetStaticPaths, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { LatestTxData } from "src/components/explorer/Ren/LatestRenTransactions/LatestTxData";
import { Breakpoints } from "src/utils/Breakpoints";
import { useViewport } from "../../hooks/useViewport";
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

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "errors"])),
  },
});

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default RenTransactions;
