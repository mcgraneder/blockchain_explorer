import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Layout } from "src/layouts";
import { useRPCClient } from "src/contexts/useRPCClient";
import AllBlocks from "../../components/explorer/Blocks/AllBlocks";
import { LoadingIndicator } from "../../components/icons/LoadingIndicator";

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
