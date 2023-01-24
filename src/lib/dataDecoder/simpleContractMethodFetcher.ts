import EthereumJSONRPC, { Log } from "@etclabscore/ethereum-json-rpc";
import { contractToABI } from "./contractDecoderUtils";
import Web3 from "web3";
import { ethers } from "ethers";
import SMART_WALLET_ABI from "./ABIs/SmartWallet/smartWalletExactABI.json";

const SMART_WALLET_LOG_SIGNATURE =
  "0x202ca0633e9bf52b1d9ffc5784badd7db89fdd8a05bea524c99853429017f7ae";

export type AbiType = "function" | "constructor" | "event" | "fallback";
export type StateMutabilityType = "pure" | "view" | "nonpayable" | "payable";

export interface AbiItem {
  anonymous?: boolean;
  constant?: boolean;
  inputs?: AbiInput[];
  name?: string;
  outputs?: AbiOutput[];
  payable?: boolean;
  stateMutability?: StateMutabilityType | string;
  type: AbiType | string;
  gas?: number;
}

export interface AbiInput {
  name: string;
  type: string;
  indexed?: boolean;
  components?: AbiInput[];
  internalType?: string;
}

export interface AbiOutput {
  name: string;
  type: string;
  components?: AbiOutput[];
  internalType?: string;
}

export const fetchEventSignarutes = async (
  transactionEventLogs: Log[]
): Promise<Array<AbiItem>> => {
  if (transactionEventLogs?.length === 0) return [];
  let eventData: AbiItem[] = [];
  transactionEventLogs.forEach((log: Log) => {
    const contractToabi = contractToABI[log?.address!.toLowerCase()];
    if (contractToabi) {
      const eventABI = contractToabi;

      eventData = eventABI.map((item: AbiItem) => {
        return item.name;
      });
    } else if (log.topics?.[0] === SMART_WALLET_LOG_SIGNATURE) {
      const eventABI = SMART_WALLET_ABI;

      eventData = eventABI.map((item: AbiItem) => {
        return item.name;
      }) as any;
    } else {
      console.log("unable to decode events");
      return "Unknown method";
    }
  });
  return eventData;
};
