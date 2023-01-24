import React, { useState } from "react";
import { hexToNumber } from "@etclabscore/eserialize";
import { useTranslation } from "react-i18next";
import EthereumJSONRPC, { BlockOrNull } from "@etclabscore/ethereum-json-rpc";
import { toFixed } from "../../../utils/misc";
import { LoadingIndicator } from "../../icons/LoadingIndicator";
import useNavigation from "../../../hooks/useNavigation";
import { useAllBlocks } from "../../../hooks/useAllBlocks";
import BlockSkeleton from "src/components/Skeletons/BlockSkeleton";
import DataContainer from "../../DataContainer";
import { TableHeader, TopRow } from "../components/explorerComponents";
import ReactPaginate from "react-paginate";
import { UilAngleRightB, UilAngleLeftB } from "@iconscout/react-unicons";
import _ from "lodash";
import Link from "next/link";
import { TableRow } from "../components/explorerComponents";

export interface IBlockViewProps {
  ethrpc: EthereumJSONRPC;
}

const tableHeaders: string[] = [
  "Block",
  "Age",
  "Txns",
  "Fee Recipient",
  "Gas Used",
  "Gas Limit",
  "Base Fee",
  "Reward",
];

//need to fix date
function AllBlocks(props: IBlockViewProps) {
  const [page, setPage] = useState<number>(0);

  const { ethrpc } = props;
  const { handleBlock } = useNavigation(ethrpc);
  const { allBlocks } = useAllBlocks(ethrpc, 165);
  const { t } = useTranslation();

  const pageStart = page * 15;
  const onPageChange = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (allBlocks.length == 0) {
    return <BlockSkeleton title={"All Blocks"} />;
  }
  return (
    <DataContainer title={"All Blocks"} titleData={""} data={allBlocks}>
      <div className='p-4 mt-2 bg-black-800 rounded-xl text-sm lg:text-base '>
        <TopRow classNames='text-grey-400'>
          {allBlocks.length != 0 ? (
            <div className='tracking-wide'>
              {t(`Showing ${page * 15} - ${(page + 1) * 15} of recent 160 recent blocks`)}
            </div>
          ) : (
            <div className='tracking-wide'>{t(`Fetching Transaction list`)}</div>
          )}
        </TopRow>

        <div className='p-4 mt-2 bg-black-800 rounded-xl'>
          {allBlocks.length !== 0 ? (
            <div className='overflow-x-auto coingrid-scrollbar items-stretch'>
              <table className='w-full'>
                <TableHeader data={tableHeaders} />
                <tbody>
                  {allBlocks.slice(pageStart, pageStart + 15).map((d: BlockOrNull, i: number) => {
                    if (i === allBlocks.length - 1 || !d) return;
                    const unixTimestamp = hexToNumber(d.timestamp!) * 1000;
                    const endTime = new Date(unixTimestamp);
                    const date = `${endTime.getHours()}:${endTime.getMinutes()}:${endTime.getSeconds()} ${" "} PM`;

                    return (
                      <tr
                        key={i}
                        className={` ${
                          i !== allBlocks.length - 2 ? "border-b border-black-600" : ""
                        }`}>
                        <TableRow
                          classNames={"text-primary hover: cursor-pointer"}
                          onClick={() => handleBlock(d.number!)}>
                          <Link href={`/block/${hexToNumber(d.number!)}`} passHref>
                            <span>{hexToNumber(d.number!)}</span>
                          </Link>
                        </TableRow>

                        {date ? (
                          <TableRow classNames={"text-grey-400"}>
                            <div>{date}</div>
                          </TableRow>
                        ) : null}

                        <TableRow classNames={"text-grey-400"}>
                          <div>{"1"}</div>
                        </TableRow>

                        {d.miner ? (
                          <TableRow classNames={"text-primary"}>
                            <div>{`${d.miner.substring(0, 20)}...`}</div>
                          </TableRow>
                        ) : null}

                        {d?.gasUsed ? (
                          <TableRow classNames={"text-grey-400"}>
                            <div>{hexToNumber(d.gasUsed!)}</div>
                          </TableRow>
                        ) : null}

                        {d?.gasLimit ? (
                          <TableRow classNames={"text-grey-400"}>
                            <div>{toFixed(hexToNumber(d.gasLimit!), 4)}</div>
                          </TableRow>
                        ) : null}

                        <TableRow classNames={"text-grey-400"}>
                          <div>{hexToNumber(d.baseFeePerGas)}</div>
                        </TableRow>

                        <TableRow classNames={"text-grey-400"}>
                          <div>{hexToNumber(d.value)}</div>
                        </TableRow>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='gap-2 flex text-grey-400 items-center justify-center'>
              <div>Fetching Block data</div>
              <LoadingIndicator />
            </div>
          )}
          {/* </div> */}
        </div>

        {Math.ceil(allBlocks.length / 11) > 1 && (
          <ReactPaginate
            className='flex items-center justify-center gap-3'
            breakLabel='...'
            previousClassName={`${page === 0 && "text-gray-500"}`}
            nextClassName={`${page === Math.ceil(allBlocks.length / 11) - 1 && "text-gray-500"}`}
            nextLabel={<UilAngleRightB />}
            pageClassName='w-8 h-8 flex items-center justify-center rounded-lg '
            activeClassName='bg-primary'
            onPageChange={onPageChange}
            pageCount={11}
            previousLabel={<UilAngleLeftB />}
          />
        )}
      </div>
    </DataContainer>
  );
}

export default AllBlocks;
