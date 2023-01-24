import { useTranslation } from "next-i18next";
import DataContainer from "../DataContainer";
import { ColumnHeader } from "../explorer/components/explorerComponents";

function BlockSkeletonInner() {
  return (
    <>
      <tr
        style={{
          animationFillMode: "backwards",
          animationDelay: "500ms",
        }}
        className={` cursor-pointer border-b border-black-600`}>
        <td className='px-5 py-4 text-left text-white align-left'>
          <div className='ml-2 mt-1 p-3 bg-black-600 w-[50px] rounded-lg font-[500] leading-6'></div>
        </td>
        <td className='px-5 py-4 text-left text-white align-middle'>
          <div className='ml-2 mt-1 p-3 bg-black-600 w-[90px] rounded-lg font-[500] leading-6'></div>
        </td>

        <td className='px-5 py-4 text-left tabular-nums text-grey-400'>
          <div className='ml-2 mt-1 p-3 bg-black-600 w-[5px] rounded-lg font-[500] leading-6'></div>
        </td>

        <td className='px-5 py-4 text-left tabular-nums text-grey-400'>
          <div className=' w-[350px]'>
            <div className='ml-2 mt-1 p-3 bg-black-600 w-[250px] rounded-lg font-[500] leading-6'></div>
          </div>
        </td>

        <td className='px-5 py-4 text-left tabular-nums text-primary'>
          <div className='ml-2 mt-1 p-3 bg-black-600 w-[100px] rounded-lg font-[500] leading-6'></div>
        </td>

        <td className='px-5 py-4 text-left tabular-nums text-grey-400'>
          <div className='ml-2 mt-1 p-3 bg-black-600 w-[130px] rounded-lg font-[500] leading-6'></div>
        </td>

        <td className='px-5 py-4 text-left tabular-nums text-grey-400'>
          <div className='ml-2 mt-1 p-3 bg-black-600 w-[10px] rounded-lg font-[500] leading-6'></div>
        </td>
        <td className='px-5 py-4 text-left tabular-nums text-grey-400'>
          <div className='ml-2 mt-1 p-3 bg-black-600 w-[100px] rounded-lg font-[500] leading-6'></div>
        </td>
      </tr>
    </>
  );
}

interface IBlockSkeleton {
  title: string;
}
const BlockSkeleton = ({ title }: IBlockSkeleton) => {
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
                  <ColumnHeader>{t("Block")}</ColumnHeader>
                  <ColumnHeader>{t("Age")}</ColumnHeader>
                  <ColumnHeader>{t("Txns")}</ColumnHeader>
                  <ColumnHeader>{t("Fee Recipient")}</ColumnHeader>
                  <ColumnHeader>{t("Gas Used")}</ColumnHeader>
                  <ColumnHeader>{t("Gas Limit")}</ColumnHeader>
                  <ColumnHeader>{t("Base Fee")}</ColumnHeader>
                  <ColumnHeader>{t("Reward")}</ColumnHeader>
                </tr>
              </thead>
              <tbody>
                {Array(13)
                  .fill(0)
                  .map((item: any, i: number) => {
                    return <BlockSkeletonInner key={i} />;
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DataContainer>
  );
};

export default BlockSkeleton;
