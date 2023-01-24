import { useTranslation } from "next-i18next";

interface IContractDataTab {
  code: string;
  address: string;
}
const ContractDataTab = ({ code, address }: IContractDataTab) => {
  const { t } = useTranslation();

  return (
    <div className='p-4 mt-2 bg-black-800 rounded-xl text-sm lg:text-base'>
      <div className='border-b border-black-600 text-grey-400 py-3 items-center justify-center pb-5 pl-5 pr-5'>
        <div className='text-sm lg:text-sm '>
          {t(
            `below is the bytecode of contract ${address}. This contract was created by This contract was created by 0x4e32377bc7d7451af6e4d59e6ad5348e2589c9de`
          )}
        </div>
      </div>

      <div className='flex-col gap-2 border-b border-black-600'>
        <div className='px-5 py-5 border-b border-black-600 flex flex-col md:flex-row  gap-[30px]'>
          <div className={`flex gap-2 break-words overflow-hidden`}>
            <div className='p-2 overflow-hidden break-words bg-black-900 rounded-xl max-h-[200px] overflow-y-scroll coingrid-scrollbar text-sm'>
              <div className='m-3 text-grey-400 max-h-[200px]'>{code}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDataTab;
