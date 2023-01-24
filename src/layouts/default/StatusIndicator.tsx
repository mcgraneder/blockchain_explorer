import { Transition } from "@headlessui/react";
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";

import API from "../../constants/Apis";
import { get } from "../../services/axios";

export enum Status {
  Success = "success",
  FailSome = "failSome",
  FailAll = "failAll",
}

export type StatusResponseData = {
  global: Status;
  lightnodeIsConnected: boolean;
  catalogIsConnected: boolean;
  timestamp: number;
  errorCode?: string;
};

const initialStatus = {
  global: Status.FailAll,
  lightnodeIsConnected: false,
  catalogIsConnected: false,
  timestamp: Date.now(),
};

function StatusIndicator() {
  const [status, setStatus] = useState<StatusResponseData>(initialStatus);
  const [isShowing, setIsShowing] = useState(false);
  const { t } = useTranslation();
  const statusDetails = [
    {
      listTitle: t("status.failSome.renNetwork"),
      status: status.lightnodeIsConnected,
    },
    {
      listTitle: t("status.failSome.catalogServices"),
      status: status.catalogIsConnected,
    },
  ];

  useEffect(() => {
    let timer: NodeJS.Timer;
    const getStatus = async () => {
      const response = await get<StatusResponseData>(API.next.status);
      if (response) {
        setStatus(response);
      }
    };
    try {
      getStatus();
      timer = setInterval(() => {
        getStatus();
      }, 1000 * 60 * 5); // refresh every 5 mins
    } catch (err) {
      console.error("Fail to call Status API.");
    }

    return () => {
      clearInterval(timer);
    };
  }, []);

  const getColorClass = (_status: Status | boolean) => {
    let color = "white";
    switch (_status) {
      case Status.Success:
      case true:
        color = "primary";
        break;
      case Status.FailSome:
      case false:
        color = "warning";
        break;
      case Status.FailAll:
        color = "danger";
        break;
      default:
        break;
    }
    return color;
  };

  const getLastUpdate = () => {
    const sec = Math.floor((Date.now() - status.timestamp) / 1000);
    if (sec < 5) {
      return t("timestamp.now");
    } else if (sec < 60) {
      return t("timestamp.fewSecAgo");
    } else if (sec < 120) {
      return t("timestamp.oneMinute");
    } else {
      return `${Math.floor(sec / 60)} ${t("timestamp.minutes")}`;
    }
  };

  return (
    <div
      className='relative z-10 mx-3'
      onMouseEnter={() => setIsShowing(true)}
      onMouseLeave={() => setIsShowing(false)}>
      <span
        className={`cursor-pointer block rounded-full w-5 h-5 bg-${getColorClass(
          status.global
        )}`}></span>
      <Transition
        show={isShowing}
        enter='transition duration-150'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='transition duration-150'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'>
        <div className='absolute right-0 z-10 pt-4 w-[260px] transform lg:translate-x-5'>
          <div className='p-4 overflow-hidden rounded-2xl bg-black-600'>
            <p className={`font-bold text-lg text-${getColorClass(status.global)}`}>
              {t(`status.${status.global}.title`)}
            </p>
            {status.global == Status.Success && (
              <p className='mt-1 text-sm text-grey-400'>
                {t("status.success.havingTrouble")}{" "}
                <a
                  href='https://discord.gg/hENQGUcPaf'
                  target='_blank'
                  rel='noreferrer'
                  className='font-bold'>
                  {t("status.success.joinTheDiscord")}
                </a>
              </p>
            )}
            {status.global == Status.FailSome && (
              <ul className='text-sm text-grey-400'>
                {statusDetails.map((item) => (
                  <li key={item.listTitle} className='flex items-center justify-between mt-1'>
                    <span>{item.listTitle}</span>
                    <div className={`rounded-full w-3 h-3 bg-${getColorClass(item.status)}`}></div>
                  </li>
                ))}
              </ul>
            )}
            {status.global == Status.FailAll && (
              <p className='mt-1 text-sm text-grey-400'>{t("status.failAll.info")}</p>
            )}

            <div className='flex justify-between mt-4 text-xs'>
              <span className='text-grey-500'>{t("lastChecked")}</span>
              <span className='text-grey-500'>{getLastUpdate()}</span>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
}

export default StatusIndicator;
