import React, { useState } from "react";
import { TableRow } from "../../components/explorerComponents";
import { TableHeader } from "../../components/explorerComponents";
import Link from "next/link";
import { hexToNumber } from "@etclabscore/eserialize";
import Web3 from "web3";
import { toFixed } from "src/utils/misc";
import { TopRow } from "../../components/explorerComponents";
import ReactPaginate from "react-paginate";
import { TransactionOrNull } from "@etclabscore/ethereum-json-rpc";
import { UilAngleRightB, UilAngleLeftB } from "@iconscout/react-unicons";
import { LoadingIndicator } from "src/components/icons/LoadingIndicator";
import { useTranslation } from "next-i18next";
import EthereumJSONRPC from "@etclabscore/ethereum-json-rpc";
import { useFetchTransactionMethods } from "src/hooks/useFetchTransactionMethods";

interface ITransactionTab {
  ethrpc: EthereumJSONRPC;
  allTransactions: TransactionOrNull[];
  handleAddress: (x: string) => void;
  handleBlock: (x: string) => Promise<void>;
  handleTransaction: (x: string) => Promise<void>;
}

const tableHeaders: string[] = ["TxnHash", "Method", "Block", "From", "To", "Value", "Txn Fee"];

const AllTransactionsTab = ({
  ethrpc,
  allTransactions,
  handleAddress,
  handleBlock,
  handleTransaction,
}: ITransactionTab) => {
  const [page, setPage] = useState<number>(0);
  const pageStart = page * 15;
  const { txMethods } = useFetchTransactionMethods(ethrpc, pageStart, allTransactions);
  const { t } = useTranslation();

  const onPageChange = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className='p-4 mt-2 bg-black-800 rounded-xl text-sm lg:text-sm'>
      <TopRow classNames='text-grey-400'>
        {allTransactions.length != 0 ? (
          <div className='tracking-wide'>
            {t(`Showing ${page * 15} - ${(page + 1) * 15} of recent 160 recent transactions`)}
          </div>
        ) : (
          <div className='tracking-wide'>{t(`Fetching Transaction list`)}</div>
        )}
      </TopRow>

      <div className='p-4 mt-2 bg-black-800 rounded-xl'>
        {allTransactions.length !== 0 ? (
          <div className='overflow-x-auto .coingrid-scrollbar items-stretch'>
            <table className='w-full'>
              <TableHeader data={tableHeaders} />
              <tbody>
                {allTransactions.slice(pageStart, pageStart + 15).map((d: any, i: number) => {
                  if (i === allTransactions.length - 1) return;
                  const fee = Web3.utils.fromWei(hexToNumber(d.gas!).toString(), "Gwei");
                  return (
                    <tr
                      key={i}
                      className={`${
                        i !== allTransactions.length - 2 ? "border-b border-black-600" : ""
                      }`}>
                      {d.hash ? (
                        <TableRow classNames={"text-primary hover: cursor-pointer"}>
                          <Link href={`/transactions/${d.hash}`} passHref>
                            <span onClick={() => handleTransaction(d.hash!)}>
                              {`${d.hash.substring(0, 30)}...`}
                            </span>
                          </Link>
                        </TableRow>
                      ) : null}

                      <TableRow classNames={"text-grey-400"}>
                        <div className='flex gap-2 items-center justify-center text-center bg-grey-600 py-1 px-2 rounded-lg'>
                          <div className='text-center text-sm'>{txMethods[i]}</div>
                        </div>
                      </TableRow>

                      {d.blockNumber ? (
                        <TableRow
                          classNames={"text-primary hover: cursor-pointer"}
                          onClick={() => handleBlock(d.blockNumber!)}>
                          <Link href={`/block/${d.blockNumber}`} passHref>
                            <span>{hexToNumber(d.blockNumber!)}</span>
                          </Link>
                        </TableRow>
                      ) : null}

                      {d.from ? (
                        <TableRow
                          classNames={"text-grey-400 hover: cursor-pointer"}
                          onClick={() => handleAddress(d.from!)}>
                          <Link href={`/address/${d.from}`} passHref>
                            <span>{`${d.from?.substring(0, 18)}...`}</span>
                          </Link>
                        </TableRow>
                      ) : null}

                      {d.to ? (
                        <TableRow
                          classNames={"text-grey-400 hover: cursor-pointer"}
                          onClick={() => handleAddress(d.to!)}>
                          <Link href={`/address/${d.to}`} passHref>
                            <span>{`${d.to.substring(0, 18)}...`}</span>
                          </Link>
                        </TableRow>
                      ) : (
                        <TableRow classNames={"text-grey-400"}>
                          <div>{`0x0..`}</div>
                        </TableRow>
                      )}
                      {d.value ? (
                        <TableRow classNames={"text-grey-400"}>
                          {Web3.utils.fromWei(hexToNumber(d.value!).toString())}
                        </TableRow>
                      ) : null}

                      {fee ? (
                        <TableRow classNames={"text-grey-400 "}>{toFixed(Number(fee), 5)}</TableRow>
                      ) : null}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='gap-2 flex text-grey-400 items-center justify-center'>
            <div>{t("Fetching Transaction list")}</div>
            <LoadingIndicator />
          </div>
        )}
      </div>
      {Math.ceil(allTransactions.length / 11) > 1 && (
        <ReactPaginate
          className='flex items-center justify-center gap-3'
          breakLabel='...'
          previousClassName={`${page === 0 && "text-gray-500"}`}
          nextClassName={`${
            page === Math.ceil(allTransactions.length / 11) - 1 && "text-gray-500"
          }`}
          nextLabel={<UilAngleRightB />}
          pageClassName='w-8 h-8 flex items-center justify-center rounded-lg '
          activeClassName='bg-primary'
          onPageChange={onPageChange}
          pageCount={11}
          previousLabel={<UilAngleLeftB />}
        />
      )}
    </div>
  );
};

export default AllTransactionsTab;
