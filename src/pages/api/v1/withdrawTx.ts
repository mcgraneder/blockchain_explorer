import type { NextApiRequest, NextApiResponse } from "next";

import Collections from "../../../constants/Collections";
import { ErrorCodes } from "../../../constants/Errors";
import TxType from "../../../constants/TxType";
import withProtect from "../../../middlewares/withProtect";
import Firebase from "../../services/firebase-admin";

type ResponseData = {
  [x: string]: any;
  errorCode?: string;
};

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const { accountId } = req.body;

  if (!accountId) {
    res.status(400).json({ accountId, errorCode: ErrorCodes.invalidBody });
    return;
  }

  const { userRef } = await Firebase();
  const userSnapshot = await userRef.doc(accountId).get();

  if (!userSnapshot.exists) {
    res.status(204).end();
    return;
  }

  const userDocRef = userSnapshot.ref;
  if (req.method === "PATCH") {
    const { renVMTxId, burnTxId, txId, accountId, accountKey, ...rest } = req.body;

    const dataToPatch = { ...rest };
    if (renVMTxId) dataToPatch.renVMTxId = renVMTxId;

    await userDocRef.collection(Collections.txs).doc(txId).update(dataToPatch);
    res.status(200).json({ success: true });
  } else if (req.method === "POST") {
    const { accountId, accountKey, ...rest } = req.body;

    // CHECK IF burnTxId ALREADY EXISTS
    // const txDocSnapshot = await userDocRef
    //   .collection(Collections.txs)
    //   .where("burnTxId", "==", burnTxId)
    //   .get();
    // if (!txDocSnapshot.empty) {
    //   res.status(200).json({ errorCode: ErrorCodes.txAlreadyExists });
    //   return;
    // }

    const txDoc = await userDocRef.collection(Collections.txs).add({
      type: TxType.withdraw,
      timestamp: Date.now(),
      ...rest,
    });
    res.status(200).json({ success: true, txId: txDoc.id });
    return;
  } else {
    res.status(404).json({});
  }
}

export default withProtect(handler);
