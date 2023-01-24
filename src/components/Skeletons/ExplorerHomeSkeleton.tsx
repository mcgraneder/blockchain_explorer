interface SkeletonProps {
  buttonCount: number;
}
const ExplorerHomeSkeleton = () => {
  return (
    <>
      <div className=' items-center justify-center w-full gap-8'>
        <div className='bg-black-800 rounded-xl max-w-[100%] max-h-[500px] overflow-hidden w-full'>
          <div className=' px-4 py-3 flex justify-between border-b border-black-600'>
            <div className='  font-semi-bold text-[16px]'>Latest Blocks</div>
            <div className=' font-semi-bold text-[16px] font-semibold  text-primary hover:cursor-pointer'>
              View all blocks
            </div>
          </div>

          <div className='overflow-y-auto coingrid-scrollbar max-h-[580px] px-4'>
            {Array(6)
              .fill(0)
              .map((item: any, i: number) => {
                return (
                  <div key={i} className='flex justify-between py-4  border-b border-black-600'>
                    <div className='flex gap-3 item-center'>
                      <div className='ml-2 p-2 h-[65px] w-[65px] bg-black-600 rounded-lg text-center justify-center'></div>
                      <div className='flex-col justify-center hover:cursor-pointer'>
                        <div className='p-3 my-1 bg-black-600 rounded-lg w-[90px]'></div>
                        <div className='p-3 my-1 bg-black-600 rounded-lg w-[90px]'></div>
                      </div>
                    </div>

                    <div className='flex-col'>
                      <div className='flex'>
                        <div className='p-3 my-1 bg-black-600 rounded-lg w-[185px]'></div>
                      </div>
                      <div className='p-3 bg-black-600 rounded-lg w-[160px]'></div>
                    </div>

                    <div className='flex-col gap-2'>
                      <div className='p-3 my-1 bg-black-600 rounded-lg w-[95px]'></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ExplorerHomeSkeleton;
