import { MintToTokenAddress } from "@renproject/chains";
import { EVMAddressPayload } from "@renproject/chains-ethereum/utils/payloads/evmAddressPayload";
import { EVMContractPayload } from "@renproject/chains-ethereum/utils/payloads/evmContractPayload";
import { Chain } from "@renproject/utils";
import { ethers } from "ethers";
import React, { PropsWithChildren } from "react";

const classNames = (...classes: Array<string | undefined>) => classes.filter(Boolean).join(" ");

export const TableRow: React.FC<any & { title: React.ReactNode; className?: string }> = ({
  title,
  children,
  className,
}) => (
  <div className={classNames("p-2 sm:grid sm:grid-cols-4 sm:gap-4", className)}>
    <dt className='text-sm font-medium text-grey-400 flex items-center'>{title}</dt>
    <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3 truncate'>{children}</dd>
  </div>
);

export const Divider: React.FC = () => (
  <svg
    className='flex-shrink-0 h-5 w-5 text-grey-400'
    xmlns='http://www.w3.org/2000/svg'
    fill='currentColor'
    viewBox='0 0 20 20'
    aria-hidden='true'>
    <path d='M5.555 17.776l8-16 .894.448-8 16-.894-.448z' />
  </svg>
);

export const RenderPayload: React.FC<{
  chain: Chain;
  payload: {
    chain: string;
    txConfig?: any;
    type?: string;
  };
}> = ({ chain, payload }) => {
  switch (payload.type) {
    case "mintToAddress":
    case "mintToTokenAddress":
      return <div className='text-primary'>{(payload as MintToTokenAddress).params.to}</div>;
    case "address":
      return <div className='text-primary'>{(payload as EVMAddressPayload).params.address}</div>;
    case "contract": // EVM contract
      let params = (payload as EVMContractPayload).params.params;
      if (
        params[params.length - 3].name === "amount" &&
        params[params.length - 2].name === "nHash" &&
        params[params.length - 1].name === "signature"
      ) {
        params = params.slice(0, params.length - 3);
      }
      return (
        <>
          <div className=' w-[300px] md:w-[600px]'>
            <div className=' p-2 '>
              <div className='flex'>
                <div className='flex items-center font-bold pl-2'>Contract</div>
                <Divider />
                <div className='text-primary'>{(payload as EVMContractPayload).params.to}</div>
                <Divider />
                <div className='italic'>{(payload as EVMContractPayload).params.method}</div>
              </div>
            </div>
            <div className='p-2'>
              {params.map((param, index) => {
                const href =
                  param.type === "address" && param.value.slice(0, 6) !== "__EVM_"
                    ? chain.addressExplorerLink(param.value)
                    : undefined;
                return (
                  <TableRow
                    key={param.name}
                    title={<span className='italic truncate'>{param.name}</span>}>
                    <span className='font-mono'>
                      {href ? (
                        <div className='text-primary'>{param.value}</div>
                      ) : ethers.BigNumber.isBigNumber(param.value) ? (
                        param.value.toString()
                      ) : (
                        JSON.stringify(param.value)
                      )}
                    </span>
                  </TableRow>
                );
              })}
            </div>
          </div>
        </>
      );
    default:
      return (
        <span className='font-mono'>
          <span className='opacity-30'>{JSON.stringify(payload)}</span>
        </span>
      );
  }
};
