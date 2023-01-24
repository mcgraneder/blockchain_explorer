import React, { useEffect } from "react";
import { useRenProvider } from "src/contexts/useRenProvider";
import { LoadingIndicator } from "src/components/icons/LoadingIndicator";
import Tooltip from "src/components/catalog/Tooltip";
import { ColumnHeader } from "../../components/explorerComponents";
import { useTranslation } from "next-i18next";
import { Icon } from "src/components/icons/AssetLogs/Icon";
import { useViewport } from "../../../../hooks/useViewport";
import Link from "next/link";
import RenTxSkeleton from "../../../Skeletons/RenTxSkeleton";

export const LatestTxData = () => {
  const { latestTransactions, refresh, fetchingError, fetching } = useRenProvider();
  const { width } = useViewport();
  const { t } = useTranslation();

  useEffect(() => {
    refresh(0, 4).catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!latestTransactions || fetching) return <RenTxSkeleton />;
  return (
    <div className='bg-black-800 min-w-[47%] rounded-xl mb-10 '>
      <div className=' px-6 py-3 flex justify-between border-b border-black-600'>
        <div className='  text-base'>Bridged Transactions</div>
        <Link href={`/renTransactions`}>
          <a href={"#"} className='text-primary'>
            {"View all Bridged transactions"}
          </a>
        </Link>
      </div>

      <div className='overflow-y-auto coingrid-scrollbar max-h-[580px] px-2'>
        {latestTransactions.length !== 0 || fetchingError ? (
          <div className='overflow-x-auto .coingrid-scrollbar items-stretch rounded-xl'>
            <table className='w-full rouned-lg bg-black-800'>
              <thead className='h-16 text-white '>
                <tr className='border-b border-black-600 py-5 h-[20px]'>
                  <ColumnHeader>{t("Txn Hash")}</ColumnHeader>
                  <ColumnHeader className='lg:block hidden'>{t("From Chain")}</ColumnHeader>
                  <ColumnHeader className='md:block hidden'>{t("To Chain")}</ColumnHeader>
                  <ColumnHeader>{t("Asset")}</ColumnHeader>
                </tr>
              </thead>
              <tbody>
                {latestTransactions?.slice(0, 5).map((d: any, i: number) => {
                  const hash =
                    width >= 770
                      ? `${d.result.hash?.substring(0, 32)}...`
                      : `${d.result.hash?.substring(0, 15)}...`;

                  return (
                    <tr key={i} className={` cursor-pointer border-b border-black-600`}>
                      <td className='pl-5 py-5 text-sm sm:text-base text-left tabular-nums text-primary font-semibold overflow-hidden'>
                        <Tooltip content={"View Ren Tx"}>
                          <Link key={d.result.hash} href={`/renTransactions/${d.result.hash}`}>
                            <a href={"#"} className='text-primary'>
                              {hash}
                            </a>
                          </Link>
                        </Tooltip>
                      </td>

                      <td className='px-5 py-5 text-left tabular-nums text-grey-400'>
                        <div className='gap-2 items-center justify-left hidden lg:flex'>
                          <Icon chainName={d.summary.from}></Icon>
                          <div> {d.summary.from}</div>
                        </div>
                      </td>

                      <td className='px-5 py-5 text-left tabular-nums text-primary'>
                        <div className='hidden gap-2 items-center justify-left md:flex'>
                          <Icon chainName={d.summary.to}></Icon>
                          <div>{d.summary.to}</div>
                        </div>
                      </td>

                      <td className='px-5 py-5 text-left tabular-nums text-grey-400'>
                        <div className='flex gap-2 items-center justify-left'>
                          <Icon chainName={d.summary.assetShort}></Icon>
                          <div> {d.summary.assetShort}</div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='gap-2 flex text-grey-400 items-center justify-center'>
            <div>This address currently has no addressTransactions</div>
            <LoadingIndicator />
          </div>
        )}
      </div>
    </div>
  );
};
