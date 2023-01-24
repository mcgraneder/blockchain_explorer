import EthereumJSONRPC, {
  Log,
  Logs,
  TransactionReceiptOrNull,
  LogTopics,
} from "@etclabscore/ethereum-json-rpc";
import { contractToABI } from "./contractDecoderUtils";
import Web3 from "web3";
import SMART_WALLET_ABI from "./ABIs/SmartWallet/smartWalletExactABI.json";

const SMART_WALLET_LOG_SIGNATURE =
  "0x202ca0633e9bf52b1d9ffc5784badd7db89fdd8a05bea524c99853429017f7ae";

export type DecodedEventLogsType = {
  topics: string[] | null;
  data: string | null;
  decodedLogs: {
    [log: string]: string;
  } | null;
  eventSignature: string | null;
  logAddress: string | undefined;
};

type EventDataType = {
  eventSignature: string | null;
  signatureHash: string | null;
  item: any;
  itemName: any;
};
//1 loop through all logs
//2 for each log check and match with ABI
//3 once matched filter abi events
//4 for each event get signature and signature hash
//5 assign vars to the log data and topics[0] (event sig)
//6 match sigHash with topics[0] to identify correct event
//7 once matched use abi decoder to decode log info
export const decodeContractEventLogs = async (
  txHash: string,
  ethrpc: EthereumJSONRPC
): Promise<Array<DecodedEventLogsType>> => {
  const web3 = new Web3("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");

  //get transaction receipt
  let transactionReceipt: TransactionReceiptOrNull = null;
  let transactionEventLogs: Logs | undefined;
  try {
    transactionReceipt = (await ethrpc.eth_getTransactionReceipt(
      txHash
    )) as TransactionReceiptOrNull;
    transactionEventLogs = transactionReceipt?.logs;
  } catch {
    //do nothing
  }
  //if theres no logs return immediately
  if (transactionEventLogs?.length === 0 || !transactionEventLogs) return [];
  let decodedLogs: DecodedEventLogsType[] = [];

  //loop through all logs
  let eventData: EventDataType[] = [];
  transactionEventLogs.forEach((log: Log) => {
    if (!log.address || !log.topics) {
      return { eventSignature: null, signatureHash: null, item: null };
    }
    //match the log source address with address=>abi mapping
    //get the event signature and signature hash
    const contractToabi = contractToABI[log?.address!.toLowerCase()];
    if (contractToabi) {
      const eventABI = contractToabi;

      eventData = eventABI.map((item: any): EventDataType => {
        var eventSignature =
          item.name +
          "(" +
          item?.inputs
            ?.map(function (input: any) {
              return input.type;
            })
            .join(",") +
          ")";

        const signatureHash = Web3.utils.sha3(eventSignature);
        return { eventSignature, signatureHash, item, itemName: item.name };
      });

      //special case for smart wallet addresses. we know the smart wallet
      //only has two events. we can detect unique SW contracts by comparing the
      //log signatures with th eknown values
    } else if (log.topics[0] === SMART_WALLET_LOG_SIGNATURE) {
      const eventABI = SMART_WALLET_ABI;

      eventData = eventABI.map((item): EventDataType => {
        var eventSignature =
          item.name +
          "(" +
          item?.inputs
            ?.map(function (input: any) {
              return input.type;
            })
            .join(",") +
          ")";

        const signatureHash = Web3.utils.sha3(eventSignature);
        return { eventSignature, signatureHash, item, itemName: item.name };
      });
    } else {
      console.log("unable to decode events");
    }

    //assign varaiables to log data and topics 0
    const data = log.data as string;
    const logSignature = log.topics[0];

    //once sig and sig hashes are known, use thiese with the specfic event topic[0]
    //and data to decode the original input info for that event
    eventData.forEach((dataItems: EventDataType) => {
      if (!log.topics) return;

      if (dataItems.signatureHash === logSignature) {
        //if match decode event
        const filteredTopics = log.topics.slice(1) as LogTopics;
        const decodedLog = web3.eth.abi.decodeLog(
          dataItems.item.inputs,
          data as string,
          filteredTopics
        );
        const logInformation: DecodedEventLogsType = {
          topics: log.topics,
          data: data,
          decodedLogs: decodedLog,
          eventSignature: dataItems.eventSignature,
          logAddress: log.address,
        };
        decodedLogs.push(logInformation);
      }
    });
  });
  return decodedLogs;
};
