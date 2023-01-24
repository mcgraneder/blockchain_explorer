import React from "react";

interface CardProps {
  children: React.ReactNode;
  ExitIcon?: any;
  dialog?: boolean;
  className?: string;
  onExitIconClick?: any;
  responsiveOverride?: string;
  overrideWidth?: string;
}

interface CardTitle {
  children: React.ReactNode;
  small?: boolean;
  className?: string;
}

interface CardDescription {
  children: React.ReactNode;
  className?: string;
}

const Card = ({
  children,
  ExitIcon,
  onExitIconClick,
  className = "",
  dialog = false,
  responsiveOverride = "",
  overrideWidth = "",
}: CardProps) => {
  function handleOnExitIconClick(e: any) {
    e?.preventDefault();
    e?.stopPropagation();
    onExitIconClick?.();
  }
  const width = overrideWidth === "" ? (dialog ? "w-550px" : "w-630px") : overrideWidth;

  return (
    <div
      className={`relative pt-6 md:pt-12 ${
        dialog
          ? ` xl:mt-0 md:${width} px-6 pb-6 md:px-12`
          : ` md:${width} px-4 pb-4 sm:px-6 sm:pb-6 md:px-14`
      } md:bg-black-800 h-fit rounded-32px w-full md:pb-[40px] ${className} ${responsiveOverride}`}>
      {ExitIcon && (
        <button
          className='absolute flex items-center w-8 h-8 p-1 rounded-full bg-black-900 md:p-2 md:w-10 md:h-10 sm:top-6 right-4 xs:right-6 sm:right-24'
          onClick={handleOnExitIconClick}>
          <ExitIcon className='flex w-full h-full m-auto text-gray-400' />
        </button>
      )}
      {children}
    </div>
  );
};

const Title = ({ children, small = false, className = "" }: CardTitle) => {
  return (
    <p
      className={`${
        !small && "md:text-2xl font-extrabold"
      } tracking-wide md:text-[22px] md:leading-9 text-[22px] font-bold text-white capitalize mb-2 ${className}`}>
      {children}
    </p>
  );
};

const Description = ({ children, className = "" }: CardDescription) => {
  return (
    <p
      className={`w-auto md:text-[15px] text-[14px] font-medium tracking-wide text-grey-400 ${className}`}>
      {children}
    </p>
  );
};

function Separator({ className = "" }: { className?: string }) {
  return <hr className={` ${className} my-6 border-black-600`} />;
}

Card.Title = Title;
Card.Description = Description;
Card.Separator = Separator;

export default Card;
