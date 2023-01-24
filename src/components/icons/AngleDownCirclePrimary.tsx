import { UilAngleDown } from "@iconscout/react-unicons";

const AngleDownCirclePrimary = ({
  className,
  iconClassName,
}: {
  className?: string;
  iconClassName?: string;
}) => {
  return (
    <div
      className={`rounded-full border-primary bg-black-900 md:bg-black-800 border-2 border-solid ${className}`}>
      <UilAngleDown className={`w-4 h-4 text-primary ${iconClassName}`} />
    </div>
  );
};

export default AngleDownCirclePrimary;
