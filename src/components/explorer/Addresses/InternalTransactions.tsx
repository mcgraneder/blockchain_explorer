import React, { useEffect, useState, useCallback } from "react";
import { hexToNumber } from "@etclabscore/eserialize";
import { useTranslation } from "react-i18next";
import { UilAngleLeftB, UilAngleRightB, UilClipboardNotes } from "@iconscout/react-unicons";
import EthereumJSONRPC, { TransactionOrNull } from "@etclabscore/ethereum-json-rpc";
import { useRPCClient } from "src/contexts/useRPCClient";
import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";
import { TableRow } from "../components/explorerComponents";
import Link from "next/link";
import { TopRow } from "../components/explorerComponents";
import { TableHeader } from "../components/explorerComponents";
import { decodeContractInputData } from "src/lib/dataDecoder/contractInputDecoder";
import { InputData } from "src/lib/dataDecoder/contractInputDecoder";
import useNavigation from "src/hooks/useNavigation";
import Web3 from "web3";
import { LoadingIndicator } from "../../icons/LoadingIndicator";
import { fetchEventSignarutes } from "src/lib/dataDecoder/simpleContractMethodFetcher";
import Tooltip from "src/components/catalog/Tooltip";

export interface IBlockViewProps {
  ethrpc: EthereumJSONRPC;
  addressTransactions: TransactionOrNull[];
}

const tableHeaders: string[] = ["Txn Number", "Parent Hash", "Method", "From", "To", "Value"];

const InternalTransactions = (props: IBlockViewProps) => {
  const { ethrpc, addressTransactions } = props;

  const [page, setPage] = useState<number>(0);
  const { handleTransaction } = useNavigation(ethrpc);
  const { address, setAddress } = useRPCClient();
  const { handleAddress } = useNavigation(ethrpc);
  const { t } = useTranslation();
  const { query } = useRouter();

  useEffect(() => {
    if (!query.address || address) return;
    setAddress(query.address);
  }, [query]);

  const pageStart = page * 15;
  const onPageChange = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!addressTransactions) return <LoadingIndicator />;
  return (
    <div className='p-4 mt-2 bg-black-800 rounded-xl text-sm lg:text-sm '>
      <TopRow classNames='text-grey-400'>
        {addressTransactions.length != 0 ? (
          <div className='tracking-wide'>
            {t(`Showing ${page * 15} - ${(page + 1) * 15} of recent 160 recent blocks`)}
          </div>
        ) : (
          <div className='tracking-wide'>{t(`this address has no internal Transactions`)}</div>
        )}
      </TopRow>

      <div className='p-4 mt-2 bg-black-800 rounded-xl'>
        {addressTransactions.length !== 0 ? (
          <div className='overflow-x-auto .coingrid-scrollbar items-stretch'>
            <table className='w-full'>
              <TableHeader data={tableHeaders} />
              <tbody>
                {addressTransactions.slice(pageStart, pageStart + 15).map((d: any, i: number) => {
                  if (i === addressTransactions.length - 1) return;
                  return (
                    <tr key={i} className={`${d.No == 1 ? "border-t border-black-600" : ""}`}>
                      <TableRow classNames={"text-grey-400"}>
                        <div className='flex gap-2 items-center justify-center text-center bg-grey-600 py-1 px-2 rounded-lg'>
                          <div className='text-center text-sm'>{d.No}</div>
                        </div>
                      </TableRow>
                      {d.hash ? (
                        <TableRow classNames={"text-primary hover: cursor-pointer"}>
                          <Tooltip content={"View transaction"}>
                            <Link href={`/transactions/${d.hash}`} passHref>
                              <span onClick={() => handleTransaction(d.hash!)}>
                                {`${d.hash.substring(0, 30)}...`}
                              </span>
                            </Link>
                          </Tooltip>
                        </TableRow>
                      ) : null}

                      <TableRow classNames={"text-grey-400"}>
                        <div className='flex gap-2 items-center justify-center text-center bg-grey-600 py-1 px-2 rounded-lg'>
                          <div className='text-center text-sm'>{d.method}</div>
                        </div>
                      </TableRow>

                      {d.from ? (
                        <TableRow
                          classNames={"text-grey-400 hover: cursor-pointer"}
                          onClick={() => handleAddress(d.from!)}>
                          <Tooltip content={"View address"}>
                            <Link href={`/address/${d.from}`} passHref>
                              <span>{`${d.from?.substring(0, 18)}...`}</span>
                            </Link>
                          </Tooltip>
                        </TableRow>
                      ) : null}

                      {d.to ? (
                        <TableRow
                          classNames={`text-primary /hover: cursor-pointer`}
                          onClick={() => handleAddress(d.to!)}>
                          <Tooltip content={"View address"}>
                            <Link href={`/address/${d.to}`} passHref>
                              <span>{`${d.to.substring(0, 18)}...`}</span>
                            </Link>
                          </Tooltip>
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='gap-2 flex text-grey-400 items-center justify-center'>
            <div>{t("This address currently has no addressTransactions")}</div>
          </div>
        )}
      </div>
      {Math.ceil(addressTransactions.length / 15) > 1 && (
        <ReactPaginate
          className='flex items-center justify-center gap-3'
          breakLabel='...'
          previousClassName={`${page === 0 && "text-gray-500"}`}
          nextClassName={`${
            page === Math.ceil(addressTransactions.length / 15) - 1 && "text-gray-500"
          }`}
          nextLabel={<UilAngleRightB />}
          pageClassName='w-8 h-8 flex items-center justify-center rounded-lg '
          activeClassName='bg-primary'
          onPageChange={onPageChange}
          pageCount={Math.ceil(addressTransactions.length) / 15}
          previousLabel={<UilAngleLeftB />}
        />
      )}
    </div>
  );
};

export default InternalTransactions;
