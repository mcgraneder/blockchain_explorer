import SpinnerDots from "/public/svgs/spinner-dots.svg";
import { useTranslation } from "next-i18next";

import Modal from "../../components/modals/Modal";
import { Breakpoints } from "src/utils/Breakpoints";
import { useViewport } from "../../hooks/useViewport";
import Card from "../catalog/Card";
import BottomSheetOptions from "../catalog/BottomSheetOptions";

interface SimpleLoadingModalProps {
  label: string;
  subLabel?: string;
  open: boolean;
}

const SimpleLoadingModal = ({ label, subLabel, open }: SimpleLoadingModalProps) => {
  const { t } = useTranslation();
  const { width } = useViewport();

  return (
    <>
      {width > 0 && width >= Breakpoints.sm1 ? (
        <Modal open={open} onClose={() => null}>
          <Card dialog>
            <div className='flex flex-col items-center justify-center p-4 mx-auto rounded-2xl bg-black-800'>
              <h1 className='text-2xl font-semibold tracking-wide text-center capitalize md:text-2xl'>
                {label}
              </h1>
              <p className='mt-2 mb-8 text-sm text-center md:text-normal'>{subLabel}</p>
              <div className='mt-2 animate-spin'>
                <SpinnerDots />
              </div>
            </div>
          </Card>
        </Modal>
      ) : (
        <div>
          <BottomSheetOptions
            hideCloseIcon
            open={open}
            setOpen={() => null}
            title={t("loadingModalCopy.processingTxn")}>
            <div className='flex flex-col items-center justify-center p-4 mx-auto rounded-2xl bg-black-800 '>
              <h1 className='text-2xl font-semibold tracking-wide text-center capitalize md:text-2xl'>
                {label}
              </h1>
              <p className='mt-2 mb-8 text-sm text-center md:text-normal'>{subLabel}</p>
              <div className='mt-2 animate-spin'>
                <SpinnerDots />
              </div>
            </div>
          </BottomSheetOptions>
        </div>
      )}
    </>
  );
};

export default SimpleLoadingModal;
