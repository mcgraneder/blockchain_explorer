import React, { useState, useEffect, useCallback } from "react";
import { hexToNumber } from "@etclabscore/eserialize";
import BlockExtraInfo from "./BlockExtraInfo";
import { UilQuestionCircle } from "@iconscout/react-unicons";
import EthereumJSONRPC, { BlockOrNull } from "@etclabscore/ethereum-json-rpc";
import Tooltip from "src/components/catalog/Tooltip";
import { useRPCClient } from "src/contexts/useRPCClient";
import { useRouter } from "next/router";
import DataSkeleton from "../../Skeletons/DataSkeleton";
import DataContainer from "src/components/DataContainer";
import BlockDataTab from "./BlockDataTab";
import { Tab } from "../types/explorerTypes";

export interface IBlockViewProps {
  ethrpc: EthereumJSONRPC;
}

function BlockView({ ethrpc }: IBlockViewProps) {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const { setActiveBlock, activeBlock: activeBlock, blockNumber } = useRPCClient();
  const { query } = useRouter();

  //need better way to do this cant make global var as props are undefined
  //CC @Gowtham
  const tabs: Tab[] = [
    {
      tabName: "Block Data",
      tabNumber: 0,
      component: (
        <BlockDataTab activeBlock={activeBlock} ethrpc={ethrpc} currentBlock={blockNumber} />
      ),
    },
    { tabName: "Extra Info", tabNumber: 1, component: <BlockExtraInfo block={activeBlock} /> },
  ];

  useEffect(() => {
    if (!query.blockId) return;
    const hexlified = `0x${Number(query.blockId as string).toString(16)}`;
    if (query.blockId.slice(0, 2) === "0x") {
      ethrpc
        .eth_getBlockByHash(query.blockId as string, true)
        .then((block: BlockOrNull) => {
          if (!block) return;
          setActiveBlock(block);
        })
        .catch((error: Error) => console.error(error));
    } else {
      ethrpc
        .eth_getBlockByNumber(hexlified, true)
        .then((block: BlockOrNull) => {
          if (!block) return;
          setActiveBlock(block);
        })
        .catch((error: Error) => console.error(error));
    }
  }, [query, activeBlock, setActiveBlock]);

  if (!activeBlock) {
    return <DataSkeleton title={"Block"} />;
  }

  return (
    <DataContainer
      title={"Block"}
      titleData={hexToNumber(activeBlock.number).toString()}
      currentTab={currentTab}
      tabs={tabs}
      setCurrentTab={setCurrentTab}
      data={activeBlock}>
      {tabs.map((tabData: Tab) => {
        return <>{currentTab === tabData.tabNumber ? tabData.component : null}</>;
      })}
    </DataContainer>
  );
}

export default BlockView;
