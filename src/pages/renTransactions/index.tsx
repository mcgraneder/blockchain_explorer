import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Layout } from "src/layouts";
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
