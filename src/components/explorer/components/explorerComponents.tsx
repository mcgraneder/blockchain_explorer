import { useState, useCallback } from "react";
import Tooltip from "src/components/catalog/Tooltip";
import Link from "next/link";
import { hexToNumber } from "@etclabscore/eserialize";
import {
  UilArrowLeft,
  UilArrowRight,
  UilQuestionCircle,
  UilArrowUp,
  UilArrowDown,
} from "@iconscout/react-unicons";
import { useTranslation } from "next-i18next";
import { LoadingIndicator } from "../../icons/LoadingIndicator";
import TransactionSkeleton from "src/components/Skeletons/TransactionsSkeleton";
import { UilCheckCircle, UiRefresh } from "@iconscout/react-unicons";

export interface IBlockNavigaor {
  blockNumber: string;
  isParent: boolean;
}

export interface ITopRow {
  children: any;
  classNames?: string;
}

interface ITableHeader {
  data: string[];
}

interface ITableRow {
  children: any;
  classNames?: string;
  onClick?: any;
}

interface ColumnHeaderProps {
  children: string;
  className?: string;
  onArrowIconClick?: () => void;
  sortIconOrder?: string;
  includeIcon?: boolean;
}

interface IEvenetLogRow {
  title: string;
  children: any;
  data?: any;
}

//add classNam prop if nessecary. its fien for now
export const EventLogRow = ({ title, children }: IEvenetLogRow) => {
  return (
    <div className='mb-6 mt-4 ietms-center flex flex-col gap-2 sm:flex-row mx-5'>
      <div className='text-left flex-shrink-0 sm:max-w-[15%] max-w-[100%] md2:max-w-[10%] relative w-full'>
        <span className='text-white'>{title}</span>
      </div>
      <div className=' flex-shrink-0 flex-grow-0 max-w-[100%] sm:max-w-[85%] md2:max-w-[75%] relative sm:px-5 px-4 w-full'>
        {children}
      </div>
    </div>
  );
};

export const ColumnHeader = ({
  children,
  onArrowIconClick,
  className = "",
  sortIconOrder,
  includeIcon = false,
}: ColumnHeaderProps) => {
  return (
    <>
      <th className='px-5 py-2 pb-4 h-4 text-left min-w-max text-white text-opacity-[45%] text-[14px] leading-4'>
        <span className={`${className} ${children !== "#" && "cursor-pointer flex"}`}>
          {children}
          {children !== "#" && (
            <button onClick={onArrowIconClick} className='-mt-1.5'>
              {includeIcon && (sortIconOrder === "ascending" ? <UilArrowUp /> : <UilArrowDown />)}
            </button>
          )}
        </span>
      </th>
    </>
  );
};

export const BlockNavigator = ({ blockNumber, isParent }: IBlockNavigaor) => {
  const desinationBlock = isParent ? hexToNumber(blockNumber) + 1 : hexToNumber(blockNumber) - 1;
  return (
    <div className='flex gap-2'>
      <div className='bg-grey-600 rounded p-0.5 '>
        <Tooltip content={"View pervious activeBlock"}>
          <Link key={blockNumber} href={`/block/${desinationBlock}`} passHref>
            <div>
              {!isParent ? (
                <UilArrowLeft className='text-grey-400' />
              ) : (
                <UilArrowRight className='text-grey-400' />
              )}
            </div>
          </Link>
        </Tooltip>
      </div>
    </div>
  );
};

export const TopRow = ({ children, classNames }: ITopRow) => {
  return (
    <div
      className={`border-b border-black-600 py-3 items-center justify-center pb-5 pl-5 pr-5 ${classNames}`}>
      <div className='tracking-normal text-sm sm:tracking-widest'>{children}</div>
    </div>
  );
};

export const TableHeader = ({ data }: ITableHeader) => {
  return (
    <thead>
      <tr className='border-b border-black-600 '>
        {data.map((dataItem: any, index: number) => {
          return <ColumnHeader key={index}>{dataItem}</ColumnHeader>;
        })}
      </tr>
    </thead>
  );
};

export const TableRow = ({ children, onClick, classNames }: ITableRow) => {
  return (
    <td className={`px-5 py-4 text-left tabular-nums ${classNames}`}>
      <div className='flex gap-2 items-center' onClick={onClick ? onClick : () => {}}>
        {children}
      </div>
    </td>
  );
};

export const LoadingHeader = () => {
  return (
    <div className='p-0 sm:p-4 mt-2 bg-black-800 rounded-xl text-xs lg:text-[14px]'>
      <div className='border-b border-black-600 text-grey-400 py-3 items-center justify-center pb-5 mb-4'>
        <div className='flex items-center gap-2 ml-5'>
          <div>Fetching Data</div>
          <LoadingIndicator />
        </div>
      </div>
    </div>
  );
};

export const AddressPageLoadingHeader = () => {
  return (
    <div className=''>
      <div className='flex gap-5 mb-8'>
        <div className='bg-black-900 min-w-[49%] rounded-xl'>
          <div className=' p-4 px-6 flex gap-2 items-center text-center border-b border-black-600'>
            <div className='  font-semibold text-lg text-center text-primary '>Overview</div>
          </div>
          <div className='px-5 py-5  bg-black-800 rounded-b-xl flex gap-[20px] justtify-between items-stretch'>
            <div className='flex gap-2 items-center'>
              <div className='w-[220px] text-white'>{"Balance"}</div>
            </div>
            <LoadingIndicator />
          </div>
        </div>

        <div className='bg-black-900 min-w-[49%] rounded-xl '>
          <div className=' p-4 px-6 flex justify-between border-b border-black-600'>
            <div className='  font-semibold text-lg text-primary'>More info</div>
          </div>
          <div className='px-5 py-5 bg-black-800 rounded-b-xl flex gap-[20px] justtify-between items-stretch'>
            <div className='flex gap-2 items-center'>
              <div className='w-[220px] text-white'>{"Name Tag"}</div>
            </div>
            <div className='text-grey-400'>Not available</div>
          </div>
        </div>
      </div>

      <TransactionSkeleton title={"Address"} />
    </div>
  );
};

export const DataRow = ({ tooltipContent, rowTitle, classNames, children }: any) => {
  return (
    <div className='px-5 py-5 border-b border-black-600 flex flex-col md:flex-row  gap-[30px] cursor-auto'>
      <div className='flex gap-2 items-center'>
        <Tooltip content={tooltipContent}>
          <UilQuestionCircle className='w-5 h-5 text-grey-400' />
        </Tooltip>
        <div className='w-[200px] lg:w-[280px] text-white'>{rowTitle}</div>
      </div>
      <div className={`flex gap-2 break-words overflow-hidden ${classNames}`}>{children}</div>
    </div>
  );
};

export const AsyncIcon: React.FC<{
  icon: (props: React.ComponentProps<"svg">) => JSX.Element;
  onClick: () => Promise<void>;
  disabled?: boolean;
  className?: string;
  showSuccess?: boolean;
}> = ({ className, onClick, icon: Icon, disabled, showSuccess }) => {
  const [calling, setCalling] = useState(false);
  const [called, setCalled] = useState(false);
  const asyncOnClick = useCallback(async () => {
    setCalling(true);
    setCalled(false);
    try {
      await onClick();
      setCalled(true);
      setTimeout(() => setCalled(false), 1 * 1000);
    } catch (error) {
      // Ignore
    }
    setCalling(false);
  }, [onClick]);

  return calling ? (
    <UiRefresh className={`h-8 px-0.5 text-gray-500 font-thin animate-spin ${className}`} />
  ) : called && showSuccess ? (
    <UilCheckCircle className={`h-8 text-green-500 font-thin className`} />
  ) : (
    <Icon
      role='button'
      className={`cursor-pointer h-8 text-gray-500 font-thin
          ${disabled ? "opacity-50 cursor-default" : ""} ${className}`}
      onClick={disabled ? undefined : asyncOnClick}
    />
  );
};

interface InavLink {
  href: string;
  display: string;
  tooltipText: string;
  page: string;
}
export const NavLink = ({ href, display, tooltipText, page }: InavLink) => {
  return (
    <Tooltip content={tooltipText}>
      <Link key={href} href={`/${page}/${href}`}>
        <div className=' text-primary font-semibold hover:cursor-pointer'>{display}</div>
      </Link>
    </Tooltip>
  );
};
