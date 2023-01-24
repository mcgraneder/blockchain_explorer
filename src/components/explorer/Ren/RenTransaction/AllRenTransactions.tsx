import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LoadingIndicator } from "src/components/icons/LoadingIndicator";
import _ from "lodash";
import DataContainer from "../../../DataContainer";
import TransactionsSkeleton from "src/components/Skeletons/TransactionsSkeleton";
import { useRenProvider } from "src/contexts/useRenProvider";
import { useViewport } from "../../../../hooks/useViewport";
import Tooltip from "src/components/catalog/Tooltip";
import Link from "next/link";
import { SummarizedTransaction } from "./SearchTypes";
import { AmountWithPrice } from "../../../catalog/AmountWithPrice";
import BigNumber from "bignumber.js";
import { Catalog } from "@renproject/chains-ethereum";
import { Icon } from "src/components/icons/AssetLogs/Icon";
import { AsyncIcon, TableHeader } from "../../components/explorerComponents";
import {
  UilArrowDown,
  UilAngleDoubleRight,
  UilAngleDoubleLeft,
  UilRefresh,
  UilAngleRightB,
  UilAngleLeftB,
} from "@iconscout/react-unicons";
const tableHeaders = ["Txn Hash", "Method", "From Chain", "To Chain", "Amount", "Txn Fee"];

function AllRenTransactions() {
  const { latestTransactions, refresh, fetchingError, fetching, page } = useRenProvider();
  const { t } = useTranslation();
  const { width } = useViewport();

  useEffect(() => {
    refresh(page, false).catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!latestTransactions || fetching) {
    return <TransactionsSkeleton title={"Recent bridged transactions"} />;
  } else
    return (
      <DataContainer title={"All Ren Transactions"} isRenTx={true} data={latestTransactions}>
        <div className='p-4 mt-2 bg-black-800 rounded-xl text-sm lg:text-sm '>
          <div className='border-b border-black-600 text-grey-400 py-3 items-center justify-center pb-5 pl-5 pr-5'>
            <div className='flex justify-between tracking-normal text-sm lg:text-base sm:tracking-widest'>
              {latestTransactions.length && (
                <div className='tracking-wide'>{t(`Showing recent 160 bridged transactions`)}</div>
              )}
              <div className='flex items-center text-xs font-medium text-grey-400 uppercase'>
                <AsyncIcon
                  icon={UilAngleDoubleLeft}
                  onClick={() => refresh(0, true)}
                  disabled={fetching || page === 0}
                />
                <AsyncIcon
                  icon={UilAngleLeftB}
                  onClick={() => refresh(page - 1, true)}
                  disabled={fetching || page === 0}
                />
                <span className='px-1 text-sm'>
                  Page{" "}
                  <span className='font-mono'>{<span className='text-base'>{page}</span>}</span>
                </span>
                <AsyncIcon
                  icon={UilAngleRightB}
                  onClick={() => refresh(page + 1, true)}
                  disabled={fetching}
                />
                <AsyncIcon
                  icon={UilRefresh}
                  onClick={() => refresh(page)}
                  disabled={fetching}
                  showSuccess={true}
                />
              </div>
            </div>
          </div>

          <div className='p-4 mt-2 bg-black-800 rounded-xl'>
            {latestTransactions.length !== 0 || fetchingError ? (
              <div className='overflow-x-auto .coingrid-scrollbar items-stretch'>
                <table className='w-full'>
                  <TableHeader data={tableHeaders} />
                  <tbody>
                    {latestTransactions?.map((d: SummarizedTransaction, i: number) => {
                      const hash =
                        width >= 770
                          ? `${d.result.hash?.substring(0, 32)}...`
                          : `${d.result.hash?.substring(0, 15)}...`;

                      const fee =
                        d.summary.amountIn &&
                        d.summary.amountOut &&
                        Number(d.summary?.amountIn) - Number(d.summary?.amountOut);

                      return (
                        <tr
                          key={i}
                          className={` cursor-pointer ${
                            i !== latestTransactions.length - 2 ? "border-b border-black-600" : ""
                          }`}>
                          <td className='flex px-5 py-4 text-left text-white align-middle'>
                            <span className='ml-2 mt-1 text-primary font-[500] leading-6'>
                              <Tooltip content={"View Ren Tx"}>
                                <Link
                                  key={d.result.hash}
                                  href={`/renTransactions/${d.result.hash}`}>
                                  <a href={"#"} className='text-primary'>
                                    {hash}
                                  </a>
                                </Link>
                              </Tooltip>
                            </span>
                          </td>
                          <td className='px-5 py-4 text-left tabular-nums text-grey-400'>
                            <div className='flex gap-2 items-center justify-center text-center bg-grey-600 py-1 px-2 rounded-lg'>
                              <div className='text-center font-bold'>{d.transactionType}</div>
                            </div>
                          </td>

                          <td
                            className={`px-5 py-4 text-left tabular-nums ${
                              d.summary.from === Catalog.chain ? "text-primary" : "text-grey-400"
                            }`}>
                            <div className='flex gap-2 items-center'>
                              <Icon chainName={d.summary.from} />
                              <div>{`${d.summary.from!}`}</div>
                            </div>
                          </td>

                          <td
                            className={`px-5 py-4 text-left tabular-nums ${
                              d.summary.to === Catalog.chain ? "text-primary" : "text-grey-400"
                            }`}>
                            <div className='flex gap-2 items-center'>
                              <Icon chainName={d.summary.to} />
                              <div>{`${d.summary.to!}`}</div>
                            </div>
                          </td>

                          <td className='px-5 py-4 text-left tabular-nums text-grey-400'>
                            {d.summary.amountIn ? (
                              <AmountWithPrice
                                amount={d.summary.amountIn}
                                asset={d.summary.asset}
                                assetShort={d.summary.assetShort}
                                assetLabel={d.summary.assetLabel}
                              />
                            ) : (
                              <div className='text-grey-400'>
                                {d.result.in.amount.toString()} (unknown decimals)
                              </div>
                            )}
                          </td>

                          <td className='px-5 py-4 text-left tabular-nums text-grey-400'>
                            {fee ? (
                              <AmountWithPrice
                                amount={new BigNumber(fee)}
                                asset={d.summary.asset}
                                assetShort={d.summary.assetShort}
                                assetLabel={d.summary.assetLabel}
                              />
                            ) : (
                              <div className='text-grey-400'>{`unable to get fee`}</div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className='gap-2 flex text-grey-400 items-center justify-center'>
                {fetchingError ? (
                  <div>{t("This address currently has no AllRenTransactions")}</div>
                ) : (
                  <div>{t("There was an error while fetching transactions")}</div>
                )}
                <LoadingIndicator />
              </div>
            )}
          </div>
        </div>
      </DataContainer>
    );
}

export default AllRenTransactions;
