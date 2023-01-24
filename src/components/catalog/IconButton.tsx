import Tooltip from "./Tooltip";

interface IconProps {
  type?: "secondary" | "primary";
  Icon: any;
  toolTipText?: string;
  onClick?: () => void;
  disabled?: boolean;
}

function IconButton({ Icon, type = "primary", toolTipText, disabled, ...rest }: IconProps) {
  const colors =
    type === "primary"
      ? "text-primary bg-black-900"
      : `bg-black-700 ${disabled ? "text-grey-500" : "text-white hover:bg-black-600"}`;
  return (
    <Tooltip disabled={disabled} content={toolTipText}>
      <button
        className={`${colors} flex items-center gap-2 p-3 font-semibold rounded-full`}
        disabled={disabled}
        {...rest}>
        <span className='flex items-center justify-center w-6 h-6'>
          <Icon width={24} height={24} viewBox={"0 0 24 24"} />
        </span>
      </button>
    </Tooltip>
  );
}

export default IconButton;
