//NOT FINISHED THE STYLES ON THIS PAGE COMMITING COS IM TIRED NOW AND ITS LATE WILL FINISH TOMOZ

import { useTranslation } from "next-i18next";
import { TransactionOrNull } from "@etclabscore/ethereum-json-rpc";
import { useEffect, useState } from "react";
import { isAddress, isERC20 } from "src/utils/misc";
import { UilArrowRight } from "@iconscout/react-unicons";
import { decodeContractInputData, InputData } from "../../../lib/dataDecoder/contractInputDecoder";
import { tokensToName } from "src/lib/dataDecoder/contractDecoderUtils";
import { LoadingHeader } from "../components/explorerComponents";
import { EventLogRow } from "../components/explorerComponents";
import { getERC20Icon } from "src/utils/misc";
import Tooltip from "src/components/catalog/Tooltip";
import Link from "next/link";

interface ITransactionLogs {
  transaction: TransactionOrNull;
  ethrpc: any;
}

const DecodedTransactionDataTab = ({ transaction, ethrpc }: ITransactionLogs) => {
  const [decodedInputData, setdecodedInputData] = useState<Array<InputData>>([]);
  const [fetched, setFetched] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!transaction) return;
    decodeContractInputData(transaction?.hash as string, ethrpc).then(
      (decodedData: InputData[]) => {
        setdecodedInputData(decodedData);
        setTimeout(() => {
          setFetched(true);
        }, 500);
      }
    );
  }, [transaction]);

  if (decodedInputData.length == 0 && !fetched) {
    return <LoadingHeader />;
  }
  return (
    <div className='p-0 sm:p-4 mt-2 bg-black-800 rounded-xl text-xs lg:text-[14px]'>
      <div className='border-b border-black-600 text-grey-400 py-3 items-center justify-center pb-5'>
        {decodedInputData.length != 0 ? (
          <div className='tracking-normal text-sm lg:text-sm sm:tracking-wide ml-5'>
            {t(
              "Below is a collection of the internal smart contract calls associated with this transaction"
            )}
          </div>
        ) : (
          <div className='tracking-normal text-sm lg:text-sm sm:tracking-wide ml-5'>
            {t("Unable to decode transaction data.")}
          </div>
        )}
      </div>

      <div className='block box-border break-words'>
        <div className='p-2 px-0 md2:px-5 block box-border break-words'>
          {decodedInputData.map((decodedInput: InputData, index: number) => {
            return (
              <div
                key={index}
                className='block md2:flex break-words items-start border-b border-grey-600 py-5'>
                <div className='flex-1'>
                  {decodedInput.method ? (
                    <EventLogRow title={"Function:"}>
                      <div className='tracking-wider text-red-500 font-semibold text-base'>
                        {decodedInput.method}
                      </div>
                    </EventLogRow>
                  ) : null}

                  {transaction?.to! ? (
                    <EventLogRow title={"Address:"}>
                      <Link key={transaction?.to!} href={`/address/${transaction?.to!}`}>
                        <div className='text-primary hover:cursor-pointer'>{transaction?.to!}</div>
                      </Link>
                    </EventLogRow>
                  ) : null}

                  {decodedInput.names ? (
                    <EventLogRow title='Args:'>
                      <ul className='block border-box list-none'>
                        {decodedInput.names?.map((name: any, index: number) => {
                          //handle nested array name types

                          const namesArray: string[] = [];
                          if (typeof name === "object" || name instanceof Object) {
                            name.forEach((internalName: string, i: number) => {
                              namesArray.push(internalName);
                            });
                          }

                          const isNameAddress =
                            isAddress(name) &&
                            name !== "0x0000000000000000000000000000000000000000";

                          return (
                            <div key={name} className='flex pb-2 gap-5 items-center'>
                              <div className={`h-full flex items-center justify-center px-2`}>
                                <div className='flex-col h-7 w-7 bg-grey-600 rounded-lg items-center justify-center text-center'>
                                  <div className='text-grey-400'>{index}</div>
                                </div>
                              </div>
                              <UilArrowRight className={"text-grey-400 w-6 h-6"} />
                              <div className='flex flex-col'>
                                {namesArray.length > 0 ? (
                                  namesArray.map((internalName: string, internalIndex: number) => {
                                    const isNameAddress =
                                      isAddress(internalName) &&
                                      internalName !== "0x0000000000000000000000000000000000000000";
                                    return (
                                      <div
                                        key={internalIndex}
                                        className={`${
                                          isNameAddress ? "text-primary" : "text-grey-400"
                                        } flex-col`}>
                                        {`${internalName}, ${" "}`}
                                      </div>
                                    );
                                  })
                                ) : (
                                  <div
                                    className={`${
                                      isNameAddress ? "text-primary" : "text-grey-400"
                                    } flex-col`}>
                                    {name}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </ul>
                    </EventLogRow>
                  ) : null}

                  {decodedInput.inputs ? (
                    <EventLogRow title={"Arg values"}>
                      <ul className='block border-box list-none'>
                        {decodedInput.inputs?.map((input: any, index: number) => {
                          //handle nested array name types
                          let modifiedInput = input;
                          let inputsArray: any = [];
                          if (typeof input === "object") {
                            if (input._isBigNumber) modifiedInput = Number(input);
                            else {
                              input.forEach((internalInput: any, i: number) => {
                                if (typeof internalInput === "object") {
                                  if (internalInput._isBigNumber)
                                    modifiedInput = Number(internalInput);
                                  else {
                                    internalInput.forEach((item: any) => {
                                      inputsArray.push(item);
                                    });
                                  }
                                } else inputsArray.push(internalInput);
                              });
                            }
                          }
                          const isNameAddress =
                            isAddress(modifiedInput) &&
                            modifiedInput !== "0x0000000000000000000000000000000000000000";

                          return (
                            <div key={input} className='flex pb-5 break-words max-w-[050px]'>
                              <div className='flex pb-5 max-w-[200px] break-words gap-5 items-center'>
                                <div
                                  className={` ${
                                    inputsArray.length > 0 && " bg-black-900 rounded-lg"
                                  } h-full flex items-center justify-center rounded-lg px-2`}>
                                  <div className='flex-col h-7 w-7 bg-grey-600 rounded-lg items-center justify-center text-center'>
                                    <div className='text-grey-400'>{index}</div>
                                  </div>
                                </div>
                                <div className='flex items-center'>
                                  <UilArrowRight className={"text-grey-400 w-6 h-6"} />
                                </div>

                                <div
                                  className={`flex flex-col gap-3 max-w-[210px] md:max-w-[380px] lg:max-w-[550px] mlg:max-w-[750px] ${
                                    inputsArray.length > 0 && "px-3 py-4 bg-black-900 rounded-lg"
                                  }`}>
                                  {inputsArray.length > 0 ? (
                                    inputsArray.map(
                                      (internalName: string, internalIndex: number) => {
                                        //  if (inputsArray[index].length > 75)
                                        const isNameAddress =
                                          isAddress(inputsArray[internalIndex]) &&
                                          inputsArray[internalIndex] !==
                                            "0x0000000000000000000000000000000000000000";

                                        const isERC20Token = isERC20(inputsArray[internalIndex]);
                                        const Icon = getERC20Icon(
                                          inputsArray[internalIndex],
                                          isERC20Token
                                        );
                                        return (
                                          <>
                                            {!isNameAddress ? (
                                              <div key={internalName} className={`text-grey-400`}>
                                                {`${inputsArray[internalIndex]}, ${" "}`}
                                                {isERC20Token && Icon ? (
                                                  <>
                                                    <Icon className={"w-5 h-5 mr-2"} />
                                                    <span className='text-white mr-4'>
                                                      {`Asset ${
                                                        tokensToName[inputsArray[internalIndex]]
                                                      }`}
                                                    </span>
                                                  </>
                                                ) : null}
                                              </div>
                                            ) : (
                                              <div key={internalName} className={`text-primary`}>
                                                <Tooltip content={"View address info"}>
                                                  <Link
                                                    key={name!}
                                                    href={`/address/${inputsArray[internalIndex]}`}>
                                                    <div className=' text-primary font-semibold hover:cursor-pointer'>
                                                      {`${inputsArray[internalIndex]}, ${" "}`}
                                                    </div>
                                                  </Link>
                                                </Tooltip>
                                                {isERC20Token && Icon ? (
                                                  <>
                                                    <Icon className={"w-5 h-5 mr-2"} />
                                                    <span className='text-white mr-4'>
                                                      {`Asset ${
                                                        tokensToName[inputsArray[internalIndex]]
                                                      }`}
                                                    </span>
                                                  </>
                                                ) : null}
                                              </div>
                                            )}
                                          </>
                                        );
                                      }
                                    )
                                  ) : (
                                    <>
                                      {!isNameAddress ? (
                                        <div className={`flex-col text-grey-400`}>
                                          {`${modifiedInput}, ${" "}`}
                                        </div>
                                      ) : (
                                        <Tooltip content={"View address info"}>
                                          <Link
                                            key={modifiedInput!}
                                            href={`/address/${modifiedInput}`}>
                                            <div className=' text-primary font-semibold hover:cursor-pointer'>
                                              {modifiedInput}
                                            </div>
                                          </Link>
                                        </Tooltip>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </ul>
                    </EventLogRow>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DecodedTransactionDataTab;
