import { useTranslation } from "next-i18next";
import React, { useEffect, useRef } from "react";

import { formatCatId } from "../../utils/misc";
import Icon from "./Icon";

interface InputProps {
  children?: React.ReactNode;
  Icon?: any;
  suffix?: string;
  value: string;
  debouncedOnChangeInput?: (text: string) => void;
  onChangeText: (text: string) => void;
  validate?: (text: string) => boolean;
  inputProps?: any;
  inputClassName?: string;
  error?: any;
  overrideSmallScreenStyle?: boolean;
}

const Input = (props: InputProps) => {
  const { t } = useTranslation();
  const {
    Icon: IconSymbol,
    suffix = "",
    onChangeText,
    validate,
    debouncedOnChangeInput,
    value,
    inputProps,
    inputClassName = "text-lg font-medium",
    error,
    overrideSmallScreenStyle = false,
  } = props;
  const inputChangeRef = useRef<any>(null);

  const isCatId = suffix === ".cat";

  useEffect(() => {
    inputChangeRef.current = setTimeout(() => {
      debouncedOnChangeInput?.(value);
    }, 700);

    return () => {
      clearTimeout(inputChangeRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleOnChangeInput = (e: any) => {
    let text = e.target.value;
    if (isCatId) text = formatCatId(text);
    if (validate) {
      if (validate(text)) onChangeText(text);
      else e.preventDefault();
    } else {
      onChangeText(text);
    }
  };

  return (
    <div
      className={`flex flex-col ${
        overrideSmallScreenStyle ? "bg-black-800" : "bg-black-900"
      }  md:bg-black-800 rounded-xl`}>
      <div className='flex items-center py-4 pl-4 pr-4'>
        {IconSymbol && (
          <div className='flex items-center justify-center w-10 h-10 rounded-full'>
            <Icon className='!p-2 mr-4' Icon={IconSymbol} type='primary' />
          </div>
        )}

        <span className='relative flex flex-1'>
          {suffix && (
            <input
              disabled
              className={`select-none w-full absolute self-center flex-1 ${inputClassName} tracking-wide bg-transparent outline-none opacity-20 placeholder:text-white`}
              placeholder={`${value} ${suffix}`}
            />
          )}
          <input
            value={value}
            onChange={handleOnChangeInput}
            className={`z-10 w-full flex-1 ${inputClassName} tracking-wide text-white bg-transparent border-b outline-none border-black-600 placeholder:text-grey-500`}
            {...inputProps}
          />
        </span>
      </div>
      <div>
        {error && (
          <p className='-mt-1 pb-2 pr-4 md:-mt-2 md:pb-1 md:pr-4 text-accent text-xs leading-[14px] font-semibold text-right '>
            {t(error)}
          </p>
        )}
      </div>
    </div>
  );
};

export default Input;
