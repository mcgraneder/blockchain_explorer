interface IconProps {
  Icon: any;
  type?: "secondary" | "primary";
  className?: string;
}

function Icon({ Icon, type = "primary", className = "", ...rest }: IconProps) {
  const colors = type === "primary" ? "text-primary bg-black-900" : "text-grey-600 bg-black-700";

  return (
    <div className={`p-2 rounded-full ${colors} ${className}`} {...rest}>
      <Icon className='w-6 h-6' />
    </div>
  );
}

export default Icon;
