import React, { useEffect, useState } from "react";
import { hexToNumber } from "@etclabscore/eserialize";
import { useTranslation } from "react-i18next";
import { Transaction } from "@etclabscore/ethereum-json-rpc";
import EthereumJSONRPC from "@etclabscore/ethereum-json-rpc";
import { isAddress, toFixed } from "../../../utils/misc";
import getBlocks from "../../../helpers/helpers";
import _ from "lodash";
import { useRPCClient } from "src/contexts/useRPCClient";
import { useRouter } from "next/router";
import InternalTransactions from "./InternalTransactions";
import AddressDataTab from "./AddressDataTab";
import { Tab } from "../types/explorerTypes";
import DataContainer from "src/components/DataContainer";
import useNavigation from "../../../hooks/useNavigation";
import { fetchEventSignarutes } from "src/lib/dataDecoder/simpleContractMethodFetcher";
import ContractDataTab from "./ContractData";
import ContractEventsTab from "./ContractEventsTab";
import { AddressPageLoadingHeader, LoadingHeader } from "../components/explorerComponents";
import Web3 from "web3";

export interface IBlockViewProps {
  ethrpc: EthereumJSONRPC;
}

type InternalTransaction = {
  No: number;
  from: string;
  to: string;
  blockNumber: string;
  hash: string;
  value: string;
  method: any;
};

function AddressData(props: IBlockViewProps) {
  const { ethrpc } = props;

  const [code, setCode] = useState<string | undefined>();
  const [fetched, setFetched] = useState<boolean>(false);
  const [InternalAddressTransactions, setInternalAddressTransactions] = React.useState<any[]>([]);
  const [balance, setBalance] = React.useState<number>();
  const [addressTransactions, setAddressTransactions] = React.useState<Transaction[]>([]);

  const { address, setAddress, blockNumber } = useRPCClient();
  const { handleAddress, handleTransaction } = useNavigation(ethrpc);
  const { t } = useTranslation();
  const { query, push } = useRouter();

  const addressTabs: Tab[] = [
    {
      tabName: "Txns",
      tabNumber: 0,
      component: (
        <AddressDataTab
          ethrpc={ethrpc}
          allTransactions={addressTransactions}
          handleAddress={handleAddress}
          handleTransaction={handleTransaction}
          address={address}
        />
      ),
    },
    {
      tabName: "Internal Txns",
      tabNumber: 1,
      component: (
        <InternalTransactions ethrpc={ethrpc} addressTransactions={InternalAddressTransactions} />
      ),
    },
  ];

  const contractTabs: Tab[] = [
    {
      tabName: "Contract",
      tabNumber: 2,
      component: <ContractDataTab code={code!} address={address!} />,
    },
    {
      tabName: "Events",
      tabNumber: 3,
      component: (
        <ContractEventsTab transaction={addressTransactions} ethrpc={ethrpc} address={address} />
      ),
    },
  ];
  const tabs = code !== "0x" ? [...addressTabs, ...contractTabs] : addressTabs;

  const [currentTab, setCurrentTab] = useState<any>(tabs[0].tabNumber);

  useEffect(() => {
    if (!query.address) return;
    const isAdd = isAddress(query.address as string);
    if (!isAdd) push("/404");
    setAddress(query.address);
  }, [query, push, setAddress]);

  useEffect(() => {
    if (blockNumber === undefined) return;
    const hexBlockNumber = `0x${blockNumber.toString(16)}`;

    ethrpc.eth_getCode(address, hexBlockNumber).then((code: string) => {
      setCode(code);
    });
    ethrpc.eth_getBalance(address, hexBlockNumber).then((b) => {
      setBalance(b === null ? 0 : Number(Web3.utils.fromWei(b)));
    });
  }, [blockNumber, address]);

  useEffect(() => {
    getBlocks(blockNumber - 165, blockNumber, ethrpc).then((blcks) => {
      const txes = _.flatMap(blcks, "transactions");
      const filteredTxes = _.filter(txes, (tx: any) => {
        if (!tx) return false;
        return tx.to === String(address).toLowerCase() || tx.from === String(address).toLowerCase();
      });
      const sortedTxes = _.sortBy(filteredTxes, (tx: any) => {
        return hexToNumber(tx.blockNumber);
      }).reverse();

      setAddressTransactions(sortedTxes);
      setTimeout(() => {
        setFetched(true);
      }, 1000);
    });
  }, [address, blockNumber]);

  useEffect(() => {
    (async () => {
      let internalTxes: InternalTransaction[] = [];
      setFetched(true);
      const limit = addressTransactions.length <= 20 ? 20 : addressTransactions.length - 1;
      for (let i = 0; i < limit; i++) {
        const receipt = await ethrpc.eth_getTransactionReceipt(addressTransactions[i]?.hash!);
        const eventLogs = await fetchEventSignarutes(receipt?.logs!);

        for (let z = 0; z < receipt?.logs?.length!; z++) {
          const internalTx: InternalTransaction = {
            No: z + 1,
            from: addressTransactions[i]?.from!,
            to: receipt?.logs[z]?.address!,
            blockNumber: addressTransactions[i]?.blockNumber!,
            hash: addressTransactions[i]?.hash!,
            value: addressTransactions[i]?.value!,
            method: eventLogs[z],
          };
          internalTxes.push(internalTx);
        }
      }
      setInternalAddressTransactions(internalTxes);
      setFetched(false);
    })();
  }, [addressTransactions, address]);

  if (addressTransactions.length == 0 && fetched) {
    return <AddressPageLoadingHeader />;
  }

  return (
    <div className=''>
      <div className='flex flex-col lg:flex-row gap-5 mb-8'>
        <div className='bg-black-900 min-w-[49%] rounded-xl'>
          <div className=' p-4 px-6 flex gap-2 items-center text-center border-b border-black-600'>
            <div className='  font-semibold text-lg text-center text-primary '>Overview</div>
          </div>
          <div className='px-5 py-5  bg-black-800 rounded-b-xl flex gap-[20px] justtify-between items-stretch'>
            <div className='flex gap-2 items-center'>
              <div className='w-[220px] text-white'>{t("Balance")}</div>
            </div>
            {balance && (
              <div className='text-grey-400 tracking-wide'>{`${toFixed(balance, 4)}`}</div>
            )}
          </div>
        </div>

        <div className='bg-black-900 min-w-[49%] rounded-xl '>
          <div className=' p-4 px-6 flex justify-between border-b border-black-600'>
            <div className='  font-semibold text-lg text-primary'>More info</div>
          </div>
          <div className='px-5 py-5 bg-black-800 rounded-b-xl flex gap-[20px] justtify-between items-stretch'>
            <div className='flex gap-2 items-center'>
              <div className='w-[220px] text-white'>{t("Name Tag")}</div>
            </div>
            <div className='text-grey-400'>Not available</div>
          </div>
        </div>
      </div>

      <DataContainer
        title={"Address"}
        titleData={address}
        data={address}
        currentTab={currentTab}
        tabs={tabs}
        setCurrentTab={setCurrentTab}>
        {tabs.map((tabData: Tab) => {
          return <>{currentTab === tabData.tabNumber ? tabData.component : null}</>;
        })}
      </DataContainer>
    </div>
  );
}

export default AddressData;
