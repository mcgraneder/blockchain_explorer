import { UilArrowLeft } from "@iconscout/react-unicons";
import ActiveTabIndicator from "public/svgs/active-tab-indicator.svg";
import { useRouter } from "next/router";
import { BlockOrNull, TransactionOrNull } from "@etclabscore/ethereum-json-rpc";
import { useRPCClient } from "src/contexts/useRPCClient";
import { useNumberOfBlockConfirmations } from "../hooks/useBlockNumberConfirmations";
import { useViewport } from "../hooks/useViewport";
import { Breakpoints } from "../utils/Breakpoints";

type Tab = {
  tabName: string;
  tabNumber: number;
  component: JSX.Element;
};

interface IDataContainer {
  title: string;
  children: any;
  isRenTx?: boolean;
  titleData?: string;
  data?: BlockOrNull | TransactionOrNull;
  currentTab?: number;
  tabs?: Tab[];
  setCurrentTab?: any;
}

const DataContainer = ({
  title,
  titleData,
  currentTab = 0,
  tabs,
  setCurrentTab,
  data,
  children,
  isRenTx = false,
}: IDataContainer) => {
  const { width } = useViewport();
  const { flow } = useRPCClient();
  const { push } = useRouter();

  const handlePreviousRoute = () => {
    if (flow.length < 2) push("/explorerHome");
    else push(flow[flow.length - 2]);
  };

  return (
    <div className={`mb-5`}>
      <div className='p-2 pt-3 mt-2 border border-black-800 rounded-xl  bg-black-900 '>
        <div className='flex gap-2 items-center ml-5'>
          <div
            className='h-9 w-9 bg-black-800 rounded-full items-center justify-center flex hover:cursor-pointer'
            onClick={handlePreviousRoute}>
            <UilArrowLeft className='text-grey-600 h-8 w-8' />
          </div>
          <div className='flex gap-7 items-center text-lg md:text-xl'>
            {width >= Breakpoints.sm ? (
              <div className='flex items-center justify-center gap-2'>
                <div className='hidden sm:flex'>
                  <h1 className=' ml-2 py-2 text-primary text-center gap-3 items-center text-[17px] font-bold'>
                    {" "}
                    {title}
                  </h1>
                </div>

                {titleData ? (
                  <div className=' text-grey-400 text-center items-center justify-center text-base'>
                    {titleData}
                  </div>
                ) : null}
              </div>
            ) : null}

            {!isRenTx && tabs && (
              <div className='flex gap-5 sm:gap-10 ml-2'>
                {tabs.map((tab: Tab) => {
                  return (
                    <div key={tab.tabNumber} className='relative'>
                      <div
                        className={`py-2 text-sm md:text-[15px] ${
                          currentTab == tab.tabNumber ? "text-white" : "text-grey-400"
                        } text-bold hover:cursor-pointer`}
                        onClick={() => setCurrentTab(tab.tabNumber)}>
                        {tab.tabName}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default DataContainer;
