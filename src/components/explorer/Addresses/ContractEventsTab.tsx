import { useTranslation } from "next-i18next";
import { TransactionOrNull, TransactionReceiptOrNull } from "@etclabscore/ethereum-json-rpc";
import { useEffect, useState } from "react";
import {
  DecodedEventLogsType,
  decodeContractEventLogs,
} from "src/lib/dataDecoder/contractEventLOgDecoder";
import { LoadingIndicator } from "src/components/icons/LoadingIndicator";
import { isAddress } from "src/utils/misc";
import Tooltip from "src/components/catalog/Tooltip";
import CopyIcon from "src/components/icons/CopyIcon";
import {
  addressesToToken,
  tokensToIcon,
  tokensToName,
} from "../../../lib/dataDecoder/contractDecoderUtils";
import { Catalog } from "@renproject/chains-ethereum";
import { UilArrowRight } from "@iconscout/react-unicons";
import { RenNetwork } from "@renproject/utils";
import { isProduction, getERC20Icon } from "../../../utils/misc";
import { isERC20 } from "src/utils/misc";

interface IEvenetLogRow {
  title: string;
  children: any;
  data?: any;
}

const network = isProduction() ? RenNetwork.Mainnet : RenNetwork.Testnet;
//add classNam prop if nessecary. its fien for now
const EventLogRow = ({ title, children }: IEvenetLogRow) => {
  return (
    <div className='mb-6 mt-4 ietms-center flex flex-col gap-2 sm:flex-row mx-2'>
      <div className='text-left sm:text-right flex-shrink-0 sm:max-w-[15%] max-w-[100%] md2:max-w-[10%] relative px-2 w-full'>
        <span className='text-white'>{title}</span>
      </div>
      <div className=' flex-shrink-0 flex-grow-0 max-w-[100%] sm:max-w-[85%] md2:max-w-[75%] relative sm:px-5 px-4 w-full'>
        {children}
      </div>
    </div>
  );
};

interface IContractLogs {
  transaction: TransactionOrNull[];
  ethrpc: any;
  address: string;
}
const ContractEventsTab = ({ transaction, ethrpc, address }: IContractLogs) => {
  const [decodedEventLogs, setDecodedEventLogs] = useState<Array<DecodedEventLogsType>>([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (!transaction) return;
    (async () => {
      let events: DecodedEventLogsType[] = [];
      const eventPromises = transaction.slice(1, 8).map((tx: TransactionOrNull) => {
        const events = decodeContractEventLogs(tx?.hash as string, ethrpc);
        return events;
      });

      const resolvedEventPromises = await Promise.all(eventPromises);
      const filteredEvents = resolvedEventPromises.map((events: any) => {
        return events.filter(
          (event: any) => event.logAddress.toLowerCase() === address.toLowerCase()
        );
      });
      filteredEvents.forEach((even: any) => {
        events.push(...even);
      });
      setDecodedEventLogs(events);
    })();

    // setDecodedEventLogs(events)
  }, [transaction]);

  if (!decodedEventLogs) {
    return <LoadingIndicator />;
  }
  return (
    <div className='p-0 sm:p-4 mt-2 bg-black-800 rounded-xl text-xs lg:text-[13px]'>
      <div className='border-b border-black-600 text-grey-400 py-3 items-center justify-center pb-5 pl-5 pr-5'>
        {decodedEventLogs.length == 0 ? (
          <div className='tracking-normal text-sm lg:text-sm sm:tracking-wide'>
            {t("This contract has no recent events to show")}
          </div>
        ) : (
          <div className='tracking-normal text-sm lg:text-sm sm:tracking-wide'>
            {t("Below are a collection of recent events associated with this contract")}
          </div>
        )}
      </div>

      <div className='block box-border break-words'>
        <div className='p-2 px-0 md2:px-5 block box-border break-words'>
          {decodedEventLogs.map((decodedLog: DecodedEventLogsType, index: number) => {
            const sepertorIndex = Object.keys(decodedLog?.decodedLogs!).indexOf("__length__");
            const lastIndex = Object.keys(decodedLog?.decodedLogs!).length;
            const methodNames = Object.keys(decodedLog?.decodedLogs!).slice(
              sepertorIndex + 1,
              lastIndex
            );

            const topics = decodedLog.topics;
            return (
              <div
                key={index}
                className='block md2:flex break-words items-start border-b border-grey-600 py-5'>
                <div className=' hidden md2:block mt-3 mr-1'>
                  <span className='flex rounded-full bg-grey-500 relative h-10 w-10 text-center justify-center items-center'>
                    {index}
                  </span>
                </div>
                <div className='flex-1'>
                  {decodedLog.logAddress ? (
                    <EventLogRow title={"Name:"}>
                      <span className='text-grey-400'>{decodedLog.logAddress}</span>
                    </EventLogRow>
                  ) : null}

                  {decodedLog.eventSignature ? (
                    <EventLogRow title={"Method:"}>
                      <span className='font-semibold tracking-wider text-red-500'>
                        {decodedLog.eventSignature}
                      </span>
                    </EventLogRow>
                  ) : null}

                  {decodedLog.decodedLogs ? (
                    <EventLogRow title='Values:'>
                      <ul className='block border-box list-none'>
                        {methodNames.map((name: string, index: number) => {
                          const isNameAddress =
                            isAddress(decodedLog?.decodedLogs![name]) &&
                            decodedLog?.decodedLogs![name] !==
                              "0x0000000000000000000000000000000000000000";

                          const isERC20Token = isERC20(decodedLog?.decodedLogs![name]);
                          const Icon = getERC20Icon(decodedLog?.decodedLogs![name], isERC20Token);
                          return (
                            <li
                              key={index}
                              className='mb-4 sm:mb-2 list-item justify-center items-center '>
                              <div className='flex items-center'>
                                <span className='text-grey-400 leading-tight bg-grey-600 inline-block px-1 py-1 mr-5 rounded-lg border-box w-6 h-6 min-w-6 min-h-6 text-center'>
                                  {index}
                                </span>
                                <span
                                  className={`whitespace-normal overflow-hidden ${
                                    isNameAddress ? "text-primary" : "text-grey-400"
                                  } mr-4`}>
                                  {decodedLog?.decodedLogs![name].length > 76
                                    ? `${decodedLog?.decodedLogs![name].substring(0, 75)}......`
                                    : decodedLog?.decodedLogs![name]}
                                </span>
                                {isERC20Token && Icon ? (
                                  <>
                                    <Icon className={"w-5 h-5 mr-2"} />
                                    <span className='text-white mr-4'>
                                      {`Asset ${tokensToName[decodedLog?.decodedLogs![name]]}`}
                                    </span>
                                  </>
                                ) : null}
                                {isNameAddress && !isERC20 ? (
                                  <Tooltip content={"Copy Address"}>
                                    <CopyIcon text={decodedLog?.decodedLogs![name]} />
                                  </Tooltip>
                                ) : null}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </EventLogRow>
                  ) : null}

                  {decodedLog.topics ? (
                    <EventLogRow title={"topics"}>
                      <ul className='block border-box list-none'>
                        {topics?.map((topic: string, index: number) => {
                          return (
                            <li
                              key={index}
                              className='mb-6 sm:mb-2 flex flex-col sm:flex-row gap-3 sm:gap-0 '>
                              <span className='text-grey-400 leading-tight bg-grey-600 inline-block px-1 py-1 mr-5 rounded-lg border-box w-6 h-6 text-center'>
                                {index}
                              </span>
                              <UilArrowRight
                                className={"text-grey-400 w-6 h-6 mr-5 hidden sm:block"}
                              />
                              <span
                                className={`whitespace-normal overflow-hidden ${
                                  index === 0 ? "text-primary" : "text-grey-400"
                                }`}>
                                {index === 0 ? `[${topic}][0]` : topic}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </EventLogRow>
                  ) : null}

                  {decodedLog.data ? (
                    <div className='mb-6 mt-4 ietms-center flex flex-wrap mx-2 break-words gap-3 sm:gap-0'>
                      <div className='text-left sm:text-right flex-shrink-0 sm:max-w-[15%] max-w-[100%] md2:max-w-[10%] relative px-2 w-full'>
                        <span className='text-white'>Data</span>
                      </div>
                      <div className=' flex-shrink-0 flex-grow-0 max-w-[100%] sm:max-w-[85%] md2:max-w-[75%] relative px-5 w-full'>
                        <div className='p-2 py-3 ml-5 overflow-hidden break-words coingrid-scrollbar bg-black-900 rounded-xl max-h-[580px] overflow-x-scroll max-w-[800px]'>
                          <div className='m-3 text-grey-400 max-h-[580px]'>{decodedLog.data}</div>
                        </div>
                      </div>
                    </div>
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

export default ContractEventsTab;
