import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ExplorerWeb from "src/components/explorer/Home/ExplorerWeb";
import { Breakpoints } from "src/utils/Breakpoints";
import { useViewport } from "../hooks/useViewport";
import { Layout } from "src/layouts";
import Link from "next/link";

const NotFoundPage: NextPage = () => {
  const { width } = useViewport();
  return (
    <>
      <div className='flex flex-col justify- items-center my-10 '>
        <div className='text-[250px] sm:text-[250px] text-primary font-bold leading-tight'>404</div>
        <div className='text-white text-[20px] sm:text-[35px] font-bold'>
          Opps this route does not exist.{" "}
        </div>
        <div className='text-grey-400 flex gap-2 py-5'>
          <span className='text-sm sm:base'>please click</span>
          <Link href={"/explorerHome"} passHref>
            <span className='text-primary font-bold hover:cursor-pointer text-sm sm:base'>
              here
            </span>
          </Link>
          <span className='text-sm sm:base'>to return to the home page.</span>
        </div>
      </div>
    </>
  );
};

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "errors"])),
  },
});

export default NotFoundPage;
