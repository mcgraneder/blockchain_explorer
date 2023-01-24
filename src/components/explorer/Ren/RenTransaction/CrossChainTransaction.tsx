import { Chain, TxStatus } from "@renproject/utils";
import BigNumber from "bignumber.js";
import React, { PropsWithChildren } from "react";

import {
  SummarizedTransaction,
  TransactionSummary,
  TransactionType,
} from "../../../../lib/searchResult";

import { AmountWithPrice } from "src/components/catalog/AmountWithPrice";
import { LoadingIndicator } from "src/components/icons/LoadingIndicator";
import { RenderPayload } from "./RenderPayload";
import { RenderRenVMStatus } from "./RenderRenVMStatus";
import DataContainer from "src/components/DataContainer";
import { DataRow } from "../../components/explorerComponents";

export const classNames = (...classes: Array<string | undefined>) =>
  classes.filter(Boolean).join(" ");

export const TableRow: React.FC<
  any & {
    title: React.ReactNode;
    titleClassName?: string;
    className?: string;
  }
> = ({ title, titleClassName, children, className }) => (
  <div className={classNames(className, "py-4 sm:py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6")}>
    <dt className={classNames("text-sm font-medium text-gray-500 flex items-start")}>{title}</dt>
    <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3 truncate'>{children}</dd>
  </div>
);

export const TableHeader: React.FC<any & { title: React.ReactNode }> = ({ title, children }) => (
  <div className='flex flex-col'>
    <div className='flex flex-col lg:flex-row lg:items-center justify-between px-4 w-full py-5'>
      <div className=''>
        <h3 className='text-lg leading-6 font-medium text-gray-900 truncate flex'>{title}</h3>
      </div>
      {children}
    </div>
  </div>
);

interface Props {
  hash: string;
  summary: TransactionSummary;
  error?: Error;
  loadAdditionalDetails?: () => Promise<void>;

  toChain?: Chain;
  fee?: BigNumber;

  gatewayAddress?: string;
  toPayload?: { chain: string; txConfig?: any };

  status: TxStatus | undefined;
  inConfirmations?: number;
  inTarget?: number;

  revertReason: string | undefined;

  inTx?: { txHash: string; explorerLink: string };
  outTx?: { txHash: string; explorerLink: string };

  queryTx: SummarizedTransaction;

  handleRenVMTx?: () => Promise<void>;
  handleOutTx?: () => Promise<void>;
}

export const LoadingTransaction = ({ hash, error }: { hash: string; error?: Error }) => {
  return (
    <div className='mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8'>
      <div className='bg-white shadow-lg sm:rounded-lg border border-gray-200'>
        <TableHeader
          title={
            <>
              <div className='hidden sm:inline select-none'>Transaction</div>
              <div className='inline sm:hidden select-none'>Tx</div>
              <div className='ml-1.5 truncate'>{hash}</div>
            </>
          }></TableHeader>
        <div className='border-t border-gray-200 px-4 py-5 sm:p-0'>
          <dl className='sm:divide-y sm:divide-gray-200'>
            <div className='border-t border-gray-200 px-4 py-5 sm:p-0'>
              <dl className='sm:divide-y sm:divide-gray-200 flex items-center justify-center px-2 py-4'>
                {error ? <div>{error.message}</div> : <LoadingIndicator />}
              </dl>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export const CrossChainTransaction = ({
  hash,
  summary,
  fee,
  gatewayAddress,
  toPayload,
  toChain,
  status,
  inConfirmations,
  inTarget,
  revertReason,
  inTx,
  queryTx,
  handleRenVMTx,
  outTx,
}: Props) => {
  const tab = 0;
  const data = {
    hash: hash,
  };
  return (
    <DataContainer title={`RenTx-`} titleData={hash} data={data} isRenTx={true}>
      {tab == 0 ? (
        <div className='p-4 mt-2 bg-black-800 rounded-xl text-sm lg:text-base'>
          <div className='border-b border-black-600 text-red-500 py-3 items-center justify-center pb-5 pl-5 pr-5'>
            <div className='tracking-normal text-sm lg:text-base sm:tracking-widest'>
              {"[ This is a Catalog-Testnet transaction only ]"}
            </div>
          </div>
          <DataRow rowTitle={"Asset"} tootlipContent={"hellowww"}>
            <div className='w-full md:w-[120px] sm:w-[120px] xs:w-[120px]'>
              <div className='font-semi-bold text-grey-400'>{summary.assetShort}</div>
            </div>
          </DataRow>
          <DataRow rowTitle={"From"} tootlipContent={"hellowww"}>
            <div className='w-full md:w-[120px] sm:w-[120px] xs:w-[120px]'>
              <div className='font-semi-bold text-grey-400'>{summary.fromLabel}</div>
            </div>
          </DataRow>
          <DataRow rowTitle={"To"} tootlipContent={"hellowww"}>
            <div className='w-full md:w-[120px] sm:w-[120px] xs:w-[120px]'>
              <div className='font-semi-bold text-grey-400'>{summary.toLabel}</div>
            </div>
          </DataRow>
          {summary.amountIn || queryTx.result?.in?.amount ? (
            <DataRow rowTitle={"Amount"} tootlipContent={"hellowww"}>
              {summary.amountIn ? (
                <AmountWithPrice
                  amount={summary.amountIn}
                  asset={summary.asset}
                  assetShort={summary.assetShort}
                  assetLabel={summary.assetLabel}
                />
              ) : (
                <div className='text-grey-400'>
                  {queryTx.result.in.amount.toString()} (unknown decimals)
                </div>
              )}
            </DataRow>
          ) : null}
          {fee ? (
            <DataRow rowTitle={"Fee"} tootlipContent={"hellowww"}>
              {/* <div className='w-full md:w-[120px] sm:w-[120px] xs:w-[120px]'> */}
              <AmountWithPrice
                amount={fee}
                asset={summary.asset}
                assetShort={summary.assetShort}
                assetLabel={summary.assetLabel}
              />
              {/* </div> */}
            </DataRow>
          ) : null}
          {status ? (
            <DataRow rowTitle={"To"} tootlipContent={"hellowww"}>
              <div className='w-full md:w-[120px] sm:w-[120px] xs:w-[120px]'>
                <RenderRenVMStatus
                  status={status}
                  inConfirmations={inConfirmations}
                  inTarget={inTarget}
                  transactionType={TransactionType.Mint}
                  revertReason={revertReason}
                  handleRenVMTx={handleRenVMTx}
                />
              </div>
            </DataRow>
          ) : null}
          {gatewayAddress ? (
            <DataRow rowTitle={"Gateway Address"} tootlipContent={"hellowww"}>
              <div className='w-full '>
                <div
                  // to={`/gateway/${gatewayAddress}`}
                  className='text-primary'>
                  {gatewayAddress}
                </div>
              </div>
            </DataRow>
          ) : null}
          {toPayload && toChain ? (
            <DataRow rowTitle={"RenVM Tx"} tootlipContent={"hellowww"}>
              <div className='w-full md:w-[120px] sm:w-[120px] xs:w-[120px]'>
                <RenderPayload chain={toChain} payload={toPayload} />
              </div>
            </DataRow>
          ) : null}
          {inTx ? (
            <DataRow rowTitle={`${summary.fromLabel} Tx`} tootlipContent={"hellowww"}>
              <div className='w-full'>
                {inTx.txHash ? <div className='text-primary'>{inTx.txHash}</div> : <>Submitted</>}
              </div>
            </DataRow>
          ) : null}
          {outTx ? (
            <DataRow rowTitle={`${summary.toLabel} Tx`} tootlipContent={"hellowww"}>
              <div className='w-full '>
                {outTx.txHash ? <div className='text-primary'>{outTx.txHash}</div> : <>Error</>}
              </div>
            </DataRow>
          ) : null}
        </div>
      ) : (
        // <BlockExtraInfo block={activeBlock} tab={tab} setTab={setTabs} />
        <></>
      )}
    </DataContainer>
  );
};
