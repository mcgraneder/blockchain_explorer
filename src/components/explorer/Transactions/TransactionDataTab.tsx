import Tooltip from "src/components/catalog/Tooltip";
import CopyIcon from "src/components/icons/CopyIcon";
import { DataRow } from "../components/explorerComponents";
import { UilCheck, UilHourglass } from "@iconscout/react-unicons";
import { toFixed } from "../../../utils/misc";
import { hexToNumber } from "@etclabscore/eserialize";
import Web3 from "web3";
import { useTranslation } from "next-i18next";
import { TransactionOrNull } from "@etclabscore/ethereum-json-rpc";
import EthereumJSONRPC from "@etclabscore/ethereum-json-rpc";
import { useNumberOfBlockConfirmations } from "../../../hooks/useBlockNumberConfirmations";
import Link from "next/link";
import { NavLink } from "../components/explorerComponents";

interface ITransactionDataTab {
  ethrpc: EthereumJSONRPC;
  transaction: TransactionOrNull;
  setActiveBlock: any;
  handleAddress: any;
  handleBlock: any;
  decodedInputData: any;
}
const TransactionDataTab = ({
  ethrpc,
  transaction,
  handleAddress,
  handleBlock,
}: ITransactionDataTab) => {
  const { t } = useTranslation();

  const { blockConfirmations } = useNumberOfBlockConfirmations(ethrpc, transaction?.blockNumber!);
  const unixTimestamp = hexToNumber("163542363") * 1000;
  const endTime = new Date(unixTimestamp);
  const date = `${endTime}`;

  return (
    <div className='p-4 mt-2 bg-black-800 rounded-xl text-sm lg:text-sm'>
      <div className='border-b border-black-600 text-red-500 py-3 items-center justify-center pb-5 pl-5 pr-5'>
        <div className='tracking-normal text-sm lg:text-sm sm:tracking-widest'>
          {t("[ This is a Catalog-Testnet transaction only ]")}
        </div>
      </div>

      <DataRow rowTitle={"Transaction Hash"} tooltipContent={"helooooo"}>
        <div className='break-words w-full overflow-hidden flex gap-2 items-center'>
          <div className='text-grey-400 overflow-hidden'>{transaction?.hash}</div>
          <Tooltip content={"Copy Address"}>
            <CopyIcon text={transaction?.hash!} />
          </Tooltip>
        </div>
      </DataRow>

      <DataRow rowTitle={"Date"} tooltipContent={"helooooo"}>
        <div className='text-grey-400 tracking-widest'>{date}</div>
      </DataRow>

      <DataRow rowTitle={"Status"} tooltipContent={"helooooo"}>
        <div className='flex gap-2'>
          <div className=' flex rounded-full bg-primary w-5 h-5 items-center justify-center'>
            <UilCheck className='w-4 h-4 text-white' />
          </div>
          <div className='text-grey-400'>{"Success"}</div>
        </div>
      </DataRow>
      <DataRow rowTitle={"Block"} tooltipContent={"helooooo"}>
        <div className='flex gap-2 '>
          {blockConfirmations > 6 ? (
            <div className=' flex rounded-full bg-primary w-5 h-5 items-center justify-center'>
              <UilCheck className='w-4 h-4 text-white' />
            </div>
          ) : (
            <UilHourglass className='w-5 h-5 text-grey-400' />
          )}
          <NavLink
            href={hexToNumber(transaction?.blockNumber!).toString()}
            display={hexToNumber(transaction?.blockNumber!).toString()}
            tooltipText={"View block info"}
            page={"block"}
          />
        </div>
        <div className='flex gap-2 items-center text-center justify-center bg-grey-500 h-5 px-2 rounded-lg'>
          <div className=''>{blockConfirmations}</div>
          <div className=''>Block Confirmations</div>
        </div>
      </DataRow>

      <DataRow rowTitle={"From"} tooltipContent={"helooooo"}>
        <div className='flex gap-2 items-center overflow-hidden break-words'>
          <NavLink
            href={transaction?.from!}
            display={transaction?.from!}
            tooltipText={"View address info"}
            page={"address"}
          />
          <Tooltip content={"Copy Address"}>
            <CopyIcon text={transaction?.from!} />
          </Tooltip>
        </div>
      </DataRow>

      <DataRow rowTitle={"To"} tooltipContent={"helooooo"}>
        <div className='flex gap-2 items-center overflow-hidden break-words'>
          <NavLink
            href={transaction?.to!}
            display={transaction?.to!}
            tooltipText={"View address info"}
            page={"address"}
          />
          <Tooltip content={"Copy Address"}>
            <CopyIcon text={transaction?.to!} />
          </Tooltip>
        </div>
      </DataRow>

      <DataRow rowTitle={"Value"} tooltipContent={"helooooo"}>
        <div className='flex gap-2 items-center justify-left text-grey-400'>
          <div className=''>{hexToNumber(transaction?.value!)}</div>
          <div className=''>Ether</div>
        </div>
      </DataRow>

      <DataRow rowTitle={"Transaction Fee"} tooltipContent={"helooooo"}>
        <div className='text-grey-400'>
          {toFixed(Number(Web3.utils.fromWei(hexToNumber(transaction?.value!).toString())), 4)}
        </div>
      </DataRow>

      <DataRow rowTitle={"Gas Price"} tooltipContent={"helooooo"}>
        <div className='text-grey-400'>{hexToNumber(transaction?.gasPrice!)}</div>
      </DataRow>

      <DataRow rowTitle={"InputData"} tooltipContent={"helooooo"}>
        <div className='p-2 overflow-hidden break-words bg-black-900 rounded-xl max-h-[200px] overflow-y-scroll coingrid-scrollbar'>
          <div className='m-3 text-grey-400 max-h-[200px]'>{transaction?.input}</div>
        </div>
      </DataRow>
    </div>
  );
};

export default TransactionDataTab;
