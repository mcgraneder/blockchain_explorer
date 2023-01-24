import { useTranslation } from "next-i18next";
import DataContainer from "../DataContainer";

function DataSkeletonInner() {
  return (
    <div className='px-5 py-5 border-b border-black-600 flex gap-[30px]'>
      <div className='w-[280px]'>
        <div className='bg-black-600 p-3 w-[120px] rounded-lg' />
      </div>
      <div className='w-[650px] p-[14px] rounded-lg bg-black-600'></div>
    </div>
  );
}

interface IDataSkeleton {
  title: string;
}
const DataSkeleton = ({ title }: IDataSkeleton) => {
  const { t } = useTranslation();
  return (
    <DataContainer title={title}>
      <div className='p-4 mt-2 bg-black-800 rounded-xl'>
        <div className='border-b border-black-600 text-red-500 py-3 items-center justify-center pb-5 pl-5 pr-5'>
          <div className='tracking-widest'>
            {t("[ This is a Catalog-Testnet transaction only ]")}
          </div>
        </div>
        {Array(13)
          .fill(0)
          .map((item: any, i: number) => {
            return (
              <div
                key={i}
                style={{
                  animationFillMode: "backwards",
                  animationDelay: "500ms",
                }}>
                <DataSkeletonInner />
              </div>
            );
          })}
      </div>
    </DataContainer>
  );
};

export default DataSkeleton;
