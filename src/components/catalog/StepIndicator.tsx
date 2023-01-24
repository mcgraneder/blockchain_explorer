const Step = ({ active }: { active?: boolean }) => {
  return (
    <div className={`w-6 sm:w-10 h-1 rounded-sm ${active ? "bg-primary" : "bg-black-700"}`}></div>
  );
};

const StepIndicator = ({ curr, total }: { curr: number; total: number }) => {
  return (
    <div className='self-start translate-y-1'>
      <p className='mb-1 text-xs font-semibold tracking-wide'>
        Step {curr} of {total}
      </p>
      <div className='flex gap-1'>
        {Array(curr)
          .fill(null)
          .map((_, i) => (
            <Step key={`active-${i}`} active />
          ))}
        {Array(total - curr)
          .fill(null)
          .map((_, i) => (
            <Step key={`inactive-${i}`} />
          ))}
      </div>
    </div>
  );
};

export default StepIndicator;
