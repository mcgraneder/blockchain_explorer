import { useTranslation } from "next-i18next";
import DataContainer from "../DataContainer";
import { ColumnHeader } from "../explorer/components/explorerComponents";

function TransactionsSkeletonInner() {
  return (
    <>
      <tr
        style={{
          animationFillMode: "backwards",
          animationDelay: "500ms",
        }}
        className={` cursor-pointer border-b border-black-600`}>
        <td className='px-5 py-4 text-left text-white align-left'>
          <div className='w-[350px] '>
            <div className='ml-2 mt-1 p-3 bg-black-600 w-[280px] rounded-lg font-[500] leading-6'></div>
          </div>
        </td>
        <td className='px-5 py-4 text-left text-white align-middle'>
          <div className='ml-2 mt-1 p-3 bg-black-600 w-[100px] rounded-lg font-[500] leading-6' />
        </td>
        <td className='px-5 py-4 text-left tabular-nums text-grey-400'>
          <div className='ml-2 mt-1 p-3 bg-black-600 w-[80px] rounded-lg font-[500] leading-6' />
        </td>
        <td className='px-5 py-4 text-left tabular-nums text-grey-400'>
          <div className='ml-2 mt-1 p-3 bg-black-600 w-[220px] rounded-lg font-[500]' />
        </td>
        <td className='px-5 py-4 text-left tabular-nums text-primary'>
          <div className='ml-2 mt-1 p-3 bg-black-600 w-[220px] rounded-lg font-[500]' />
        </td>

        <td className='px-5 py-4 text-left tabular-nums text-grey-400'>
          <div className='ml-2 mt-1 p-3 bg-black-600 w-[80px] rounded-lg font-[500] leading-6' />
        </td>
        <td className='px-5 py-4 text-left tabular-nums text-grey-400'>
          <div className='ml-2 mt-1 p-3 bg-black-600 w-[80px] rounded-lg font-[500] leading-6' />
        </td>
      </tr>
    </>
  );
}

interface ITransactionSkeleton {
  title: string;
}

const TransactionSkeleton = ({ title }: ITransactionSkeleton) => {
  const { t } = useTranslation();
  return (
    <DataContainer title={title}>
      <div className='p-4 mt-2 bg-black-800 rounded-xl'>
        <div className='border-b border-black-600 text-grey-400 py-2 items-center justify-center pb-5 pl-5 pr-5'>
          <div className='tracking-wide'>{t("Showing 15 of recent 50 allTransactions")}</div>
        </div>
        <div className='p-4 mt-2 bg-black-800 rounded-xl'>
          <div className='overflow-x-auto .coingrid-scrollbar items-stretch'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-black-600 '>
                  <ColumnHeader>{t("Txn Hash")}</ColumnHeader>
                  <ColumnHeader>{t("Method")}</ColumnHeader>
                  <ColumnHeader>{t("Block")}</ColumnHeader>
                  <ColumnHeader>{t("From")}</ColumnHeader>
                  <ColumnHeader>{t("To")}</ColumnHeader>
                  <ColumnHeader>{t("Value")}</ColumnHeader>
                  <ColumnHeader>{t("Txn Fee")}</ColumnHeader>
                </tr>
              </thead>
              <tbody>
                {Array(13)
                  .fill(0)
                  .map((item: any, i: number) => {
                    return <TransactionsSkeletonInner key={i} />;
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DataContainer>
  );
};

export default TransactionSkeleton;
