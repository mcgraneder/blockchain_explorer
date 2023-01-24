import { DataRow } from "../components/explorerComponents";
import Tooltip from "src/components/catalog/Tooltip";
import Link from "next/link";
import { UilCheckCircle } from "@iconscout/react-unicons";
import { toFixed } from "../../../utils/misc";
import { hexToNumber } from "@etclabscore/eserialize";
import useNavigation from "../../../hooks/useNavigation";
import EthereumJSONRPC, { Block } from "@etclabscore/ethereum-json-rpc";
import DataSkeleton from "src/components/Skeletons/DataSkeleton";
import { BlockNavigator, TopRow } from "../components/explorerComponents";

interface IBlockDataTab {
  activeBlock: Block;
  ethrpc: EthereumJSONRPC;
  currentBlock: number;
}

const BlockDataTab = ({ activeBlock, ethrpc, currentBlock }: IBlockDataTab) => {
  const { handleAddress, handleBlock } = useNavigation(ethrpc);

  if (!activeBlock) return <DataSkeleton title={"Block"} />;

  const date = `${new Date(hexToNumber(activeBlock?.timestamp!) * 1000)}`;
  const isCurrentBlock = hexToNumber(activeBlock?.number!) == currentBlock;

  return (
    <div className='p-4 mt-2 bg-black-800 rounded-xl text-sm lg:text-sm'>
      <TopRow classNames={"text-red-500"}>{"[ This is a Catalog-Testnet block only ]"}</TopRow>

      {activeBlock.number ? (
        <DataRow rowTitle={"Number"} tootlipContent={"hellowww"}>
          <div className='flex font-bold text-primary text-center items-center'>
            {hexToNumber(activeBlock.number!)}
          </div>
          <BlockNavigator blockNumber={activeBlock.number} isParent={false} />
          {!isCurrentBlock ? (
            <BlockNavigator blockNumber={activeBlock.number} isParent={true} />
          ) : null}
        </DataRow>
      ) : null}

      <DataRow
        rowTitle={"Status"}
        tootlipContent={"hellowww"}
        classNames={"bg-primary text-dark-green px-3 p-[2px] rounded-xl"}>
        <UilCheckCircle className='text-green' />
        <div className='font-semi-bold'>Verified</div>
      </DataRow>

      {activeBlock.baseFeePerGas ? (
        <DataRow rowTitle={"BaseFeePerGas"} tooltipContent={"heloooo"}>
          <div className='text-grey-400'>{toFixed(hexToNumber(activeBlock.baseFeePerGas), 4)}</div>
        </DataRow>
      ) : null}

      {activeBlock.difficulty ? (
        <DataRow rowTitle={"Difficulty"} tooltipContent={"heloooo"}>
          <div className='text-grey-400'>
            <div>{toFixed(hexToNumber(activeBlock.difficulty!), 4)}</div>
          </div>
        </DataRow>
      ) : null}

      {activeBlock.transactions ? (
        <DataRow rowTitle={"Transactions"} tooltipContent={"heloooo"}>
          <div className='rounded-md bg-primary text-dark-green px-2'>
            <div>{`${activeBlock.transactions!.length} transactions`}</div>
          </div>
          <div className='text-grey-400'>in this block</div>
        </DataRow>
      ) : null}

      {activeBlock.gasLimit ? (
        <DataRow rowTitle={"Gas Limit"} tooltipContent={"heloooo"}>
          <div className='text-grey-400'>{hexToNumber(activeBlock.gasLimit!)}</div>
        </DataRow>
      ) : null}

      {activeBlock.hash ? (
        <DataRow rowTitle={"Gas Used"} tootlipContent={"hellowww"}>
          <div className='text-grey-400'>{hexToNumber(activeBlock.gasUsed!)} Wei</div>
        </DataRow>
      ) : null}

      {activeBlock.hash ? (
        <DataRow rowTitle={"Hash"} tooltipContent={"heloooo"} classNames={"w-full"}>
          <div className='text-grey-400'>{activeBlock.hash!}</div>
        </DataRow>
      ) : null}

      {activeBlock.miner ? (
        <DataRow rowTitle={"Miner"} tooltipContent={"heloooo"} classNames={"w-full"}>
          <Tooltip content={"View address info"}>
            <Link key={activeBlock.number} href={`/address/${activeBlock.miner!}`} passHref>
              <div
                className='text-primary font-semibold hover:cursor-pointer'
                onClick={() => handleAddress(activeBlock.miner!)}>
                {activeBlock.miner!}
              </div>
            </Link>
          </Tooltip>
        </DataRow>
      ) : null}

      {activeBlock.parentHash ? (
        <DataRow rowTitle={"Nonce"} tooltipContent={"heloooo"}>
          <div className='text-grey-400'>{hexToNumber(activeBlock.gasUsed!)} Wei</div>
        </DataRow>
      ) : null}

      {activeBlock.parentHash ? (
        <DataRow rowTitle={"Parent Hash"} tooltipContent={"heloooo"} classNames={"text-primary"}>
          <Tooltip content={"View block info"}>
            <Link href={`/block/${activeBlock.parentHash}`} passHref>
              <div
                className='text-primary hover:cursor-pointer'
                onClick={() => handleBlock(activeBlock.parentHash!)}>
                {activeBlock.parentHash!}
              </div>
            </Link>
          </Tooltip>
        </DataRow>
      ) : null}

      {date ? (
        <DataRow rowTitle={"Timestamp"} tooltipContent={"heloooo"}>
          <div className='text-grey-400 tracking-widest'>{date}</div>
        </DataRow>
      ) : null}

      {activeBlock.totalDifficulty ? (
        <DataRow rowTitle={"Total Difficulty"} tooltipContent={"heloooo"}>
          <div className='text-grey-400'>{hexToNumber(activeBlock.totalDifficulty!)}</div>
        </DataRow>
      ) : null}
    </div>
  );
};

export default BlockDataTab;
