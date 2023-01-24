import EthereumJSONRPC, { TransactionOrNull } from "@etclabscore/ethereum-json-rpc";
import { inputDataSignaturesToABI } from "./contractDecoderUtils";
import InputDataDecoder from "ethereum-input-data-decoder";
import { AbiItem } from "@renproject/chains-ethereum//utils/abi";
import { LockGatewayABI } from "@renproject/chains-ethereum/contracts";
const SMART_WALLET_LOG_SIGNATURE =
  "0x202ca0633e9bf52b1d9ffc5784badd7db89fdd8a05bea524c99853429017f7ae";

type NestedArray<T> = T | NestedArray<T>[];

export interface InputData {
  method: string | null;
  types: string[];
  inputs: any[];
  names: NestedArray<string>[];
}

//1 get transaction from tx hash
//isolate the tx input data
//3 in a recursive call do the following logic
//4 check if the first 8 bytes of the input is known
//5 if it is map the sigature to its contract ABI
//6 use the abi and the data signature to decode the input
//7 check this first input for nested input data
//8 we can use the decoded data types array to isolate types of 'bytes' which may be other encoded contract calls
//9 for each item in types array isolate index of types with bytes and recursively call data decoder
export const decodeContractInputData = async (
  txHash: string,
  ethrpc: EthereumJSONRPC
): Promise<Array<InputData>> => {
  const decodedInputDataTxs: InputData[] = [];

  let transactionReceipt: TransactionOrNull = null;
  let transactionData: string | undefined;
  try {
    transactionReceipt = (await ethrpc.eth_getTransactionByHash(txHash)) as TransactionOrNull;
    transactionData = transactionReceipt?.input;
  } catch {
    //do nothing
  }
  console.log("hey");
  if (!transactionReceipt || !transactionData) return [];
  //extract function signature from data
  //check dataSignature with known values
  const txDataSignature = transactionData.substring(0, 10);
  console.log(txDataSignature);
  if (txDataSignature === "0xcd74662f")
    handleForwarderCallData(transactionData, txDataSignature, decodedInputDataTxs);
  else callRecursiveDecoder(transactionData, txDataSignature, decodedInputDataTxs);
  return decodedInputDataTxs;
};

const getTypeOfInput = (input: any) => {
  return typeof input === "object" || input instanceof Object;
};

const recursiveInputTypeCheck = (currentInput: any): any => {
  if (getTypeOfInput(currentInput) === false) return currentInput;
  let internalInput = currentInput;

  for (let i = 0; i < currentInput.length; i++) {
    internalInput = recursiveInputTypeCheck(currentInput[i]);
    if (getTypeOfInput(internalInput) === false) internalInput = currentInput[i];
    else internalInput = internalInput;
  }
  return internalInput;
};

const callRecursiveDecoder = (
  inputToDecode: string,
  txDataSignature: string,
  decodedInputDataTxs: InputData[]
) => {
  if (
    inputDataSignaturesToABI[txDataSignature] &&
    inputDataSignaturesToABI[txDataSignature] !== "Unknown Contract"
  ) {
    //if sig exists decode the data
    const contractABI: AbiItem[] = inputDataSignaturesToABI[txDataSignature];
    const decoder = new InputDataDecoder(contractABI);
    const decodedData: InputData = decoder.decodeData(inputToDecode);
    decodedInputDataTxs.push(decodedData);
    recursvieDataDecoder(decodedData, decodedInputDataTxs);
  } else {
    console.log(`Could not decode instance of transaction data`);
  }
};

const recursvieDataDecoder = (
  decodedData: InputData,
  decodedInputData: InputData[]
): void | null => {
  //get input types array to find nested data entry
  const indexsOfIntrest = decodedData.types
    .map((type: string, index: number) => {
      const typedOf = type.substring(type.length - 2, type.length);
      if (typedOf === "[]" || type === "bytes") return index;
      else return null;
    })
    .filter((index: number | null) => typeof index === "number") as number[];

  if (indexsOfIntrest.length == 0) return null;
  //decoded data may be nested wirh more internal calls. chech input
  //data for other tx data
  indexsOfIntrest.forEach((index: number) => {
    if (
      typeof decodedData.inputs[index] === "object" ||
      decodedData.inputs[index] instanceof Object
    ) {
      decodedData.inputs[index].forEach((input: Array<string>) => {
        input.forEach((item: Array<string> | string) => {
          if (item.length >= 10 && typeof item === "string") {
            const txDataSignature: string = item.substring(0, 10);
            callRecursiveDecoder(item, txDataSignature, decodedInputData);
          }
        });
      });
    } else if (
      decodedData.inputs[index].length >= 10 &&
      typeof decodedData.inputs[index] === "string"
    ) {
      const inputOfIntrest: string = decodedData.inputs[index];
      const txDataSignature: string = decodedData.inputs[index].substring(0, 10);
      callRecursiveDecoder(inputOfIntrest, txDataSignature, decodedInputData);
    } else {
      // undhandled edge case
      console.log(`Could not decode instance of transaction 
                data due to incorrect or unknown type`);
    }
  });
};

const handleForwarderCallData = (
  inputToDecode: string,
  txDataSignature: string,
  decodedInputDataTxs: InputData[]
) => {
  if (
    inputDataSignaturesToABI[txDataSignature] &&
    inputDataSignaturesToABI[txDataSignature] !== "Unknown Contract"
  ) {
    const contractABI: AbiItem[] = inputDataSignaturesToABI[txDataSignature];
    const decoder = new InputDataDecoder(contractABI);
    const decodedData: InputData = decoder.decodeData(inputToDecode);
    decodedInputDataTxs.push(decodedData);
    const forwaderInputs = decodedData.inputs[0];
    if (forwaderInputs.length != 8) return;
    else
      handleForwarderCallData(
        forwaderInputs[forwaderInputs.length - 1],
        forwaderInputs[forwaderInputs.length - 1].substring(0, 10),
        decodedInputDataTxs
      );
  }
};
