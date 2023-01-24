import { UilSpinnerAlt } from "@iconscout/react-unicons";
import { useTranslation } from "next-i18next";

interface LoadingProps {
  className?: string;
  showLoadingLabel?: boolean;
  spinnerStyleClassName?: string;
}
export const LoadingIndicator = ({
  showLoadingLabel,
  className = "",
  spinnerStyleClassName = "",
}: LoadingProps) => {
  const { t } = useTranslation();

  return (
    <div className={`flex justify-center gap-2 capitalize ${className}`}>
      {showLoadingLabel && t("txAndOtherStatuses.loading")}
      <div className='ease-in-out w-max spin animate-spin '>
        <UilSpinnerAlt className={spinnerStyleClassName} />
      </div>
    </div>
  );
};
