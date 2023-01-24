import React from "react";
import { useTranslation } from "react-i18next";
import { Block } from "@etclabscore/ethereum-json-rpc";
import Tooltip from "src/components/catalog/Tooltip";
import { UilQuestionCircle } from "@iconscout/react-unicons";
import { DataRow } from "../components/explorerComponents";
import { TopRow } from "../components/explorerComponents";

export interface IBlockViewProps {
  block: Block;
}

function BlockExtraInfo(props: IBlockViewProps) {
  const { block } = props;
  const { t } = useTranslation();

  return (
    <div className='p-4 mt-2 bg-black-800 rounded-xl text-sm'>
      <TopRow classNames={"text-red-500"}>{"[ This is a Catalog-Testnet block only ]"}</TopRow>
      <div className='px-5 py-5 border-b border-black-700 flex gap-[30px]'>
        <div className='flex gap-2'>
          <Tooltip
            content={
              "Post london upgrade this represents the minimum gas used multiplier for a tx to be included in the block"
            }>
            <UilQuestionCircle className='w-5 h-5 text-grey-400' />
          </Tooltip>
          <div className='w-[280px] text-white'>{t("Logs Bloom")}</div>
        </div>
        <div className='p-2 overflow-hidden break-words bg-black-900 rounded-xl max-h-[200px] overflow-y-scroll coingrid-scrollbar'>
          <div className='m-3 text-grey-400 max-h-[200px]'>{block.logsBloom}</div>
        </div>
      </div>

      {block.mixHash ? (
        <DataRow rowTitle={"Mix Hash"} tooltipContent={"heloooo"}>
          <div className='text-grey-400'>{block.mixHash}</div>
        </DataRow>
      ) : null}

      {block.receiptsRoot ? (
        <DataRow rowTitle={"Receipts Root"} tooltipContent={"heloooo"}>
          <div className='text-grey-400'>{block.receiptsRoot}</div>
        </DataRow>
      ) : null}

      {block.Sha3Uncles ? (
        <DataRow rowTitle={"Sha3 Uncles"} tooltipContent={"heloooo"}>
          <div className='text-grey-400'>{block.sha3Uncles}</div>
        </DataRow>
      ) : null}

      {block.stateRoot ? (
        <DataRow rowTitle={"Receipts Root"} tooltipContent={"heloooo"}>
          <div className='text-grey-400'>{block.stateRoot}</div>
        </DataRow>
      ) : null}
    </div>
  );
}

export default BlockExtraInfo;
