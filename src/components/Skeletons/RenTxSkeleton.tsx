import { ColumnHeader } from "../explorer/components/explorerComponents";
import { useTranslation } from "react-i18next";

const RenTxSkeleton = () => {
  const { t } = useTranslation();
  return (
    <div className='bg-black-800 min-w-[47%] rounded-xl mb-10 '>
      <div className=' px-6 py-3 flex justify-between border-b border-black-600'>
        <div className='  text-base'>Bridged Transactions</div>
        <div className='text-primary'>{"View all Bridged transactions"}</div>
      </div>

      <div className='overflow-y-auto coingrid-scrollbar max-h-[580px] px-2'>
        <div className='overflow-x-auto .coingrid-scrollbar items-stretch rounded-xl'>
          <table className='w-full rouned-lg bg-black-800'>
            <thead className='h-16 text-white '>
              <tr className='border-b border-black-600 py-5 h-[20px]'>
                <ColumnHeader>{t("Txn Hash")}</ColumnHeader>
                <ColumnHeader className='lg:block hidden'>{t("From Chain")}</ColumnHeader>
                <ColumnHeader className='md:block hidden'>{t("To Chain")}</ColumnHeader>
                <ColumnHeader>{t("Asset")}</ColumnHeader>
              </tr>
            </thead>
            <tbody>
              {Array(16)
                .fill(0)
                .map((d: any, i: number) => {
                  return (
                    <tr key={i} className={` cursor-pointer border-b border-black-600`}>
                      <td className='pl-5 py-5 text-sm sm:text-base text-left tabular-nums text-primary font-semibold overflow-hidden'>
                        <div className='w-[350px] '>
                          <div className='ml-2 mt-1 p-3 bg-black-600 w-[280px] rounded-lg font-[500] leading-6'></div>
                        </div>
                      </td>

                      <td className='px-5 py-5 text-left tabular-nums text-grey-400'>
                        <div className='ml-2 mt-1 p-3 bg-black-600 w-[120px] rounded-lg font-[500] leading-6' />
                      </td>

                      <td className='px-5 py-5 text-left tabular-nums text-primary'>
                        <div className='ml-2 mt-1 p-3 bg-black-600 w-[120px] rounded-lg font-[500] leading-6' />
                      </td>

                      <td className='px-5 py-5 text-left tabular-nums text-grey-400'>
                        <div className='ml-2 mt-1 p-3 bg-black-600 w-[90px] rounded-lg font-[500] leading-6' />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RenTxSkeleton;
