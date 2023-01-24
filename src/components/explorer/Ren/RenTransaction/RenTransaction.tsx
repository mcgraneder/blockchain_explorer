import { Gateway, GatewayTransaction } from "@renproject/ren";
import { RenVMCrossChainTxSubmitter } from "@renproject/ren//renVMTxSubmitter";
import { ChainTransactionStatus, utils } from "@renproject/utils";
import { useCallback, useEffect, useState } from "react";
import { SummarizedTransaction } from "src/lib/searchResult";
import { TransactionType } from "src/lib/searchResult";
import { getTransactionDepositInstance } from "src/lib/searchTransaction";
import { useRenProvider } from "src/contexts/useRenProvider";
import { CrossChainTransaction, LoadingTransaction } from "./CrossChainTransaction";
import { useRouter } from "next/router";
import DataSkeleton from "../../../Skeletons/DataSkeleton";

export const RenTransaction = () => {
  const { transaction, handleTransactionUrl, renJS } = useRenProvider();
  const { query } = useRouter();
  const [hash, setHash] = useState<any>();

  useEffect(() => {
    if (!query.renTransactionId) return;
    setHash(query.renTransactionId);
    if (query.renTransactionId || hash) {
      handleTransactionUrl(query.renTransactionId as string);
    } else {
      throw new Error(`Not implemented - legacy tx: ${hash}`);
    }
  }, [query, hash]);

  const queryTx: SummarizedTransaction | undefined =
    transaction &&
    !(transaction instanceof Error) &&
    transaction.queryTx &&
    transaction.txHash === hash
      ? (transaction.queryTx as SummarizedTransaction)
      : undefined;

  const [transactionInstance, setTransactionInstance] = useState<
    GatewayTransaction | Error | null | undefined
  >(undefined);
  const [gatewayInstance, setGatewayInstance] = useState<Gateway | Error | null | undefined>(
    undefined
  );

  const loadAdditionalDetails = useCallback(async () => {
    if (
      queryTx &&
      !(queryTx instanceof Error) &&
      queryTx.transactionType === TransactionType.Mint
    ) {
      setTransactionInstance(undefined);
      const { deposit, gateway } = await getTransactionDepositInstance(
        renJS,
        queryTx.result,
        queryTx.summary
      );
      setTransactionInstance(deposit);
      setGatewayInstance(gateway);
    }
  }, [renJS, queryTx, setTransactionInstance, setGatewayInstance]);

  useEffect(() => {
    loadAdditionalDetails();
  }, [loadAdditionalDetails]);

  // Re-render when a progress event is emitted.
  const [, setToggle] = useState(false);

  const handleRenVMTx = useCallback(async () => {
    if (!transactionInstance || transactionInstance instanceof Error) {
      return;
    }

    transactionInstance.renVM.eventEmitter.on("progress", (progress) => {
      setToggle((t) => !t);
    });
    await transactionInstance.renVM.wait();
  }, [transactionInstance]);

  const [calledInWait, setCalledInWait] = useState(false);
  useEffect(() => {
    if (calledInWait || !transactionInstance || transactionInstance instanceof Error) {
      return;
    }

    setCalledInWait(true);

    if (transactionInstance.in.progress.status !== ChainTransactionStatus.Done) {
      transactionInstance.in.eventEmitter.on("progress", (progress) => {
        setToggle((t) => !t);
      });
      transactionInstance.in.wait().catch(console.error);
    }
  }, [calledInWait, transactionInstance]);

  if (!hash) {
    return <DataSkeleton title={"RenTx-"} />;
  }

  if (!queryTx || !queryTx.summary) {
    return <DataSkeleton title={"RenTx-"} />;
  }

  const inTx:
    | {
        txHash: string;
        explorerLink: string;
      }
    | undefined =
    (transactionInstance &&
      !(transactionInstance instanceof Error) &&
      transactionInstance.in.progress.transaction) ||
    queryTx.summary.inTx ||
    undefined;

  const outTx:
    | {
        txHash: string;
        explorerLink: string;
      }
    | undefined =
    (transactionInstance &&
      !(transactionInstance instanceof Error) &&
      transactionInstance.out.progress.transaction) ||
    queryTx.summary.outTx ||
    undefined;

  return (
    <>
      <CrossChainTransaction
        hash={hash}
        loadAdditionalDetails={
          queryTx &&
          !(queryTx instanceof Error) &&
          queryTx.transactionType === TransactionType.Mint &&
          (!utils.isDefined(transactionInstance) || transactionInstance instanceof Error)
            ? loadAdditionalDetails
            : undefined
        }
        error={
          transaction instanceof Error
            ? transaction
            : transaction?.queryTx instanceof Error
            ? transaction.queryTx
            : undefined
        }
        summary={queryTx.summary}
        status={
          queryTx.result.status ||
          (
            (transactionInstance &&
              !(transactionInstance instanceof Error) &&
              transactionInstance.renVM) as RenVMCrossChainTxSubmitter | undefined
          )?.progress?.response?.txStatus
        }
        inTarget={
          transactionInstance && !(transactionInstance instanceof Error)
            ? transactionInstance.in.progress.target
            : undefined
        }
        inConfirmations={
          transactionInstance && !(transactionInstance instanceof Error)
            ? transactionInstance.in.progress.confirmations
            : undefined
        }
        revertReason={
          (
            (transactionInstance &&
              !(transactionInstance instanceof Error) &&
              transactionInstance.renVM) as RenVMCrossChainTxSubmitter | undefined
          )?.progress?.revertReason
        }
        fee={
          queryTx.summary.amountIn && queryTx.summary.amountOut
            ? queryTx.summary.amountIn.minus(queryTx.summary.amountOut)
            : undefined
        }
        gatewayAddress={
          (gatewayInstance &&
            !(gatewayInstance instanceof Error) &&
            gatewayInstance.gatewayAddress) ||
          undefined
        }
        toPayload={
          transactionInstance && !(transactionInstance instanceof Error)
            ? transactionInstance.params.to
            : undefined
        }
        toChain={
          transactionInstance && !(transactionInstance instanceof Error)
            ? transactionInstance.toChain
            : undefined
        }
        inTx={inTx}
        outTx={outTx}
        queryTx={queryTx}
        handleRenVMTx={
          transactionInstance &&
          !(transactionInstance instanceof Error) &&
          transactionInstance.renVM.progress.status !== ChainTransactionStatus.Done
            ? handleRenVMTx
            : undefined
        }
      />
    </>
  );
};
