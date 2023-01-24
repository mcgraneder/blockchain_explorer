import React from "react";
import Image from "next/image";
import BottomNavigationBar from "./BottomNavigationBar";
import NavigationBar from "./NavigationBar";
import styles from "./layout.module.css";
import { useRouter } from "next/router";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps) {
  const router = useRouter();

  const pathName = router.pathname;
  const onCorrectPage = ["/explorerHome"].includes(router.pathname);

  return (
    <>
      <div className='flex flex-col items-center h-screen text-white md:px-8 lg:h-auto lg:min-h-screen '>
        <NavigationBar />
        <div
          id='layout'
          className={`${styles.layout} relative bg-black-900 pb-2 pt-6 px-2 overflow-y-scroll coingrid-scrollbar lg:overflow-y-auto md:p-10 sm:p-8 rounded-t-[40px] md:rounded-[40px] overflow-x-hidden   items-center flex-1 w-full lg:mb-6`}>
          {children}
        </div>
        <BottomNavigationBar />
      </div>
    </>
  );
}

const BannerCardWrapper = ({ children, onClick }: any) => {
  return (
    <button
      disabled={!onClick}
      onClick={onClick}
      className='flex items-center justify-center gap-3 px-4 py-3 mb-6 rounded-full bg-black-800'>
      {children}
    </button>
  );
};

export default DefaultLayout;
