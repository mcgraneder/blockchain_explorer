import type { NextPage } from "next";
import BlockView from "src/components/explorer/Blocks/BlockData";
import { Layout } from "src/layouts";
import { useRPCClient } from "src/contexts/useRPCClient";
import { LoadingIndicator } from "../../components/icons/LoadingIndicator";

const BlocksPage: NextPage = () => {
  const { ethRPC } = useRPCClient();

  if (!ethRPC) return <LoadingIndicator />;
  return (
    <>
      <Layout>
        <BlockView ethrpc={ethRPC} />
      </Layout>
    </>
  );
};

export default BlocksPage;
