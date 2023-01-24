import { hexToNumber } from "@etclabscore/eserialize";
import Link from "next/link";
import { useRouter } from "next/router";
import Tooltip from "./catalog/Tooltip";
import { formatTime } from "../utils/date";
import Web3 from "web3";
import { useViewport } from "../hooks/useViewport";
import { Breakpoints } from "../utils/Breakpoints";
import { shortenAddress } from "src/utils/misc";
import { NavLink } from "./explorer/components/explorerComponents";

const DataSummaryContainer = ({ isBlock, blocks, transactions, blockNumber }: any) => {
  const { push } = useRouter();
  const { width } = useViewport();
  const data = isBlock ? blocks : transactions;

  return (
    <div key={isBlock? "blocks" : "transactions"} className='bg-black-800 rounded-xl max-w-[100%] mlg:max-w-[50%] max-h-[580px] overflow-hidden w-full'>
      <div className=' px-4 py-3 flex justify-between border-b border-black-600'>
        <div className=' font-semi-bold text-[16px]'>
          {isBlock ? "Latest Blocks" : "Latest Transactions"}
        </div>
        <div
          className=' font-semi-bold text-[16px] font-semibold  text-primary hover:cursor-pointer'
          onClick={() => (isBlock ? push("/block") : push("/transactions"))}>
          {isBlock ? "View all blocks" : "View all transactions"}
        </div>
      </div>

      <div className='overflow-y-scroll coingrid-scrollbar max-h-[520px] py-2 pr-3 pl-2'>
        {data.map((d: any, i: number) => {
          if (i === data.length - 1) return;

          const date = formatTime(d.timestamp, 0);
          const blockConfirmations = isBlock ? blockNumber - hexToNumber(d.number) : null;

          return (
              <div key={d.number} className='flex justify-between py-5  border-b border-black-600'>
                <div className='flex gap-3 item-center'>
                  <div className='flex align-middle justify-center text-center h-[50px] w-[50px] bg-black-900 rounded-lg'>
                    <div className='self-center'>{isBlock ? "BK" : "TX"}</div>
                  </div>
                  <div className='flex-col gap-2  justify-center hover:cursor-pointer'>
                    <Tooltip content={isBlock ? "View block info" : "View transaction info"}>
                      <Link
                      key={d.number}
                        href={
                          isBlock ? `/block/${hexToNumber(d.number)}` : `/transactions/${d.hash}`
                        }>
                        <a className='text-primary'>
                          {isBlock ? hexToNumber(d.number) : shortenAddress(d.hash)}
                        </a>
                      </Link>
                    </Tooltip>
                    <div className='text-[15px]'>{date}</div>
                  </div>
                </div>

                {isBlock ? (
                  <div className='flex-col gap-2 '>
                    <div className='flex gap-2'>
                      <div className='text-[15px]'>Recipient: </div>
                      <NavLink
                        href={d?.miner!}
                        display={shortenAddress(d?.miner!, 4)}
                        tooltipText={"View address info"}
                        page={"address"}
                      />
                    </div>
                    <div className='flex gap-2'>
                      <div className='text-[15px]'>{d.transactions?.length}</div>
                      <div className='text-[15px]'>1 txn in this block</div>
                    </div>
                  </div>
                ) : (
                  <div className='flex-col gap-2'>
                    <div className='flex gap-2'>
                      <div className='text-[15px]'>From: </div>
                      <Tooltip content={"View address info"}>
                        <Link key={d.from} href={`/address/${d.from}`} passHref>
                          <div
                            className='text-primary hover:cursor-pointer'>
                            {shortenAddress(d.from)}
                          </div>
                        </Link>
                      </Tooltip>
                    </div>
                    <div className='flex gap-2'>
                      <div className='text-[15px]'>To: </div>
                      <Tooltip content={"View address info"}>
                        <Link key={d.to} href={`/address/${d.to}`} passHref>
                          <div className='text-primary hover:cursor-pointer text-[15px]'>
                            {shortenAddress(d.to)}
                          </div>
                        </Link>
                      </Tooltip>
                    </div>
                  </div>
                )}

                {width >= Breakpoints.sm ? (
                  <div className='gap-2 flex flex-col'>
                    <div className={`flex gap-2 bg-grey-600 px-2 rounded-xl py-1`}>
                      {isBlock ? (
                        <div className='text-xs flex gap-2 items-center justify-center'>
                          <span>{blockConfirmations}</span>
                          <span>{blockConfirmations == 0 ? "conf" : "confs"}</span>
                        </div>
                      ) : (
                        <div className='text-xs flex gap-2'>
                          <span>{Web3.utils.fromWei(hexToNumber(d.value).toString())}</span>
                          <span>Ether</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
          );
        })}
      </div>
    </div>
  );
};

export default DataSummaryContainer;
