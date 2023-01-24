import React, { useState } from "react";
import { UilArrowLeft, UilSearch } from "@iconscout/react-unicons";
import PrimaryButton from "src/components/catalog/PrimaryButton";
import { useRouter } from "next/router";
import { TransactionOrNull } from "@etclabscore/ethereum-json-rpc";
import EthereumJSONRPC from "@etclabscore/ethereum-json-rpc";
import { BlockOrNull } from "@etclabscore/ethereum-json-rpc";
import { Toast } from "../../Notification/Toast";
import { useRPCClient } from "src/contexts/useRPCClient";
import { queryMintOrBurn } from "../../../lib/searchTactics/searchRenVMHash";
import { useRenProvider } from "src/contexts/useRenProvider";
import { isAddress, isBlockNumber, isKeccakHash } from "src/utils/misc";

interface CardProps {
  children: React.ReactNode;
  ExitIcon?: any;
  dialog?: boolean;
  className?: string;
  onExitIconClick?: any;
  responsiveOverride?: string;
  overrideWidth?: string;
}

interface CardTitle {
  children: React.ReactNode;
  small?: boolean;
  className?: string;
}

interface CardDescription {
  children: React.ReactNode;
  className?: string;
}

const Card = ({
  children,
  ExitIcon,
  onExitIconClick,
  className = "",
  dialog = false,
  responsiveOverride = "",
  overrideWidth = "",
}: CardProps) => {
  function handleOnExitIconClick(e: any) {
    e?.preventDefault();
    e?.stopPropagation();
    onExitIconClick?.();
  }

  return (
    <div
      className={`relative pt-12 md:w-[650px] px-8 sm:px-14 bg-black-800 h-fit rounded-32px pb-[30px] sm:pb-[40px] w-full`}>
      {ExitIcon && (
        <button
          className='absolute flex items-center w-8 h-8 p-1 rounded-full bg-black-900 md:p-2 md:w-10 md:h-10 sm:top-6 right-4 xs:right-6 sm:right-24'
          onClick={handleOnExitIconClick}>
          <ExitIcon className='flex w-full h-full m-auto text-gray-400' />
        </button>
      )}
      {children}
    </div>
  );
};

const Title = ({ children, small = false, className = "" }: CardTitle) => {
  return (
    <p
      className={`racking-wide md:text-[22px] md:leading-9 text-[22px] font-bold text-white capitalize mb-2 `}>
      {children}
    </p>
  );
};

const Description = ({ children, className = "" }: CardDescription) => {
  return (
    <p
      className={`w-auto md:text-[15px] text-[14px] font-medium tracking-wide text-grey-400 ${className}`}>
      {children}
    </p>
  );
};

function Separator({ className = "" }: { className?: string }) {
  return <hr className={` ${className} my-6 border-black-600`} />;
}

Card.Title = Title;
Card.Description = Description;
Card.Separator = Separator;

interface SearchInterface {
  ethrpc: EthereumJSONRPC;
}
const Search = ({ ethrpc }: SearchInterface) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { renJS, getChain } = useRenProvider();
  const { setAddress } = useRPCClient();
  const { push } = useRouter();

  const handleSearch = async (searchQuery: string | undefined) => {
    if (searchQuery === undefined) {
      return;
    }
    const trimmedSearchQuery: string = searchQuery.trim();
    //first check if the tx is a renVM hash
    let queryTx;
    try {
      queryTx = await queryMintOrBurn(renJS.provider, searchQuery, getChain);
    } catch (error) {
      //do nothing
    }
    if (queryTx) {
      push({
        pathname: `/renTransactions/${trimmedSearchQuery}`,
      });
      return;
    }
    if (isAddress(trimmedSearchQuery)) {
      setAddress(trimmedSearchQuery);
      push({
        pathname: `/address/${trimmedSearchQuery}`,
      });
      return;
    } else if (isKeccakHash(trimmedSearchQuery)) {
      ethrpc
        .eth_getTransactionByHash(trimmedSearchQuery)
        .then((transaction: TransactionOrNull) => {
          if (!transaction) {
            Toast.error("Invalid Transaction hash");
            return;
          }
          push({
            pathname: `/transactions/${transaction.hash}`,
          });
          return;
        })
        .catch((error: Error) => console.error(error));

      ethrpc
        .eth_getBlockByHash(trimmedSearchQuery, true)
        .then((block: BlockOrNull) => {
          if (!block) return;
          push({
            pathname: `/block/${block.hash}`,
          });
          return;
        })
        .catch((error: Error) => console.error(error));
    } else if (isBlockNumber(trimmedSearchQuery)) {
      ethrpc
        .eth_getBlockByNumber(`0x${parseInt(trimmedSearchQuery, 10).toString(16)}`, false)
        .then((block: BlockOrNull) => {
          if (!block) {
            Toast.error("Invalid block number");
            return;
          }
          push({
            pathname: `/block/${block.hash}`,
          });
          return;
        })
        .catch((error: Error) => console.error(error));
    } else Toast.error("Invalid search entry");
  };

  return (
    <div className='w-full flex items-center justify-center pb-4'>
      <Card onExitIconClick={UilArrowLeft} className={`w-[650px]`}>
        <Card.Title>Search The Catalog Network</Card.Title>
        <Card.Description>Enter a transaction or RenVM hash</Card.Description>
        <Card.Separator />
        <div className='flex pl-4 mb-2 items-center justify-center rounded-full bg-black-900'>
          <UilSearch className='w-6 h-6 mr-2 text-grey-400' />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='flex-1 text-[14px] font-medium tracking-wide bg-transparent outline-none placeholder:text-grey-400'
            placeholder={"Serach by address, txn hash, block, or renVM hash"}
          />
          <PrimaryButton
            className='mt-[2px] px-3 xs:px-8 py-[10px] bg-black'
            onClick={() => handleSearch(searchTerm)}>
            Search
          </PrimaryButton>
        </div>
      </Card>
    </div>
  );
};

export default Search;
