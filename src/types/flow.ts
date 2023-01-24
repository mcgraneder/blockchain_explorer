
const blockArray = ["recentBlocks", "block"] as const;
type BlockTypes = typeof blockArray[number];

const transactionArray = ["recentTransactions", "transaction"] as const;
type TransactionTypes = typeof transactionArray[number];

const addressesArray = ["address", "contract"] as const;
type AddressTypes = typeof addressesArray[number];

const approveArray = ["approve"] as const;
type ApproveTypes = typeof approveArray[number];

type CommonTypes = "fund" | "txPending" | "txRejected" | "txProcessing" | "txNetworkIssue";
export type Flow = BlockTypes | TransactionTypes | AddressTypes
