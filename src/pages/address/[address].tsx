import type { NextPage } from "next";
import { Layout } from "src/layouts";
import AddressData from "../../components/explorer/Addresses/AddressData";
import { LoadingIndicator } from "../../components/icons/LoadingIndicator";
import { useRPCClient } from "src/contexts/useRPCClient";

const BlockPage: NextPage = () => {
  const { ethRPC } = useRPCClient();

  if (!ethRPC) return <LoadingIndicator />;
  return (
    <>
      <Layout>
        <AddressData ethrpc={ethRPC} />
      </Layout>
    </>
  );
};

export default BlockPage;
