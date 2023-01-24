import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import CNSNames from "src/components/cnsnames/CNSNames";

const Names: NextPage = () => {
  return (
    <>
    <Head>
      <title>Catalog Name Service</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
      <CNSNames />
    </>
  );
};

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "errors"])),
  },
});

export default Names;
