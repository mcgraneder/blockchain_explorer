import { TxStatus, utils } from "@renproject/utils";
import React from "react";
import { TransactionType } from "./SearchTypes";
import PrimaryButton from "src/components/catalog/PrimaryButton";
import { UilCheck } from "@iconscout/react-unicons";

const StatusText = {
  [TxStatus.TxStatusNil]: "No status",
  [TxStatus.TxStatusConfirming]: "Confirming",
  [TxStatus.TxStatusPending]: "Queued",
  [TxStatus.TxStatusExecuting]: "Executing",
  [TxStatus.TxStatusReverted]: "Reverted",
  [TxStatus.TxStatusDone]: "Complete",
};

interface IRenVMStatus {
  status: TxStatus | undefined;
  inConfirmations?: number;
  inTarget?: number;
  transactionType: TransactionType;
  revertReason?: string;
  handleRenVMTx?: () => Promise<void>;
}
export const RenderRenVMStatus = ({
  status,
  inConfirmations,
  inTarget,
  transactionType,
  revertReason,
  handleRenVMTx,
}: IRenVMStatus) => {
  switch (status) {
    case TxStatus.TxStatusNil:
    case TxStatus.TxStatusPending:
    case TxStatus.TxStatusExecuting:
    case TxStatus.TxStatusConfirming:
      return (
        <div className='flex items-center'>
          {StatusText[status]}
          {handleRenVMTx ? (
            <PrimaryButton
              onClick={handleRenVMTx}
              className={"opacity-50 py-0 border-none bg-none"}>
              {""}
            </PrimaryButton>
          ) : null}
          {status === TxStatus.TxStatusConfirming ? (
            <>
              {utils.isDefined(inConfirmations) && utils.isDefined(inTarget) ? (
                <span className='ml-1 text-grey-400 text-xs'>
                  {inConfirmations} / {inTarget} confirmations
                </span>
              ) : null}
            </>
          ) : null}
        </div>
      );
    case TxStatus.TxStatusReverted:
      return (
        <span style={{ color: "#E05C52" }}>
          {StatusText[status]}
          {revertReason ? ` - ${revertReason}` : null}
        </span>
      );
    case TxStatus.TxStatusDone:
      return transactionType === TransactionType.Mint ? (
        <div className='text-grey-400'>
          Signed <UilCheck className='text-green-600 h-3 -mt-0.5 inline' />
        </div>
      ) : (
        <span style={{ color: "#7BB662" }}>Complete</span>
      );
    case undefined:
      return <></>;
  }
};
