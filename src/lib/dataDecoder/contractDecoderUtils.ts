import { Catalog } from "@renproject/chains-ethereum";
import { RenNetwork } from "@renproject/utils";
import BoundlessAdapterABI from "./ABIs/BoundlessContracts/BoundlessAdapterABI.json";
import LenderABI from "./ABIs/BoundlessContracts/LenderABI.json";
import GatewayAdapterABI from "./ABIs/BoundlessContracts/GatewayAdapterABI.json";
import OneInchAdapterABI from "./ABIs/BoundlessContracts/OneInchAdapter.json";
import MockOneInchABI from "./ABIs/BoundlessContracts/MockOneInch.json";
import CatalogABI from "./ABIs/CatalogAMM/CatalogRen.json";
import ForwarderABI from "./ABIs/CatalogAMM/Forwarder.json";
import SmartWalletABI from "./ABIs/SmartWallet/smartWalletExactABI.json";
import CatalogSwapAdapterABO from "./ABIs/BoundlessContracts/CatalogSwapAdapter.json";

import { ERC20ABI } from "@renproject/chains-ethereum/contracts";

import RenBTCIcon from "../../../public/svgs/assets/renBTC.svg";
import RenDAIIcon from "../../../public/svgs/assets/renDAI.svg";
import RenETHIcon from "../../../public/svgs/assets/renETH.svg";
import RenUSDCIcon from "../../../public/svgs/assets/renUSDC.svg";
import RenUSDTIcon from "../../../public/svgs/assets/renUSDT.svg";

import { AbiItem } from "@renproject/chains-ethereum//utils/abi";

export const addresses = {
  DAI_Goerli: "0x7EcD62D6f9dD7b0C500330635dF4F171F195D2fF",
  USDC_Goerli: "0x0FEA97153F0AE29CD97fFFd9425002CF68886042",
  USDT_Goerli: "0x6802A54a585A10b02073063fba0eC64026bd920c",
  gETH: "0x13D0ECF0Da19832673cCE704FC5E3cC519B1459B",
  BTC: "0xC5020e9379143F9F586e29a45c7D303f6d8879C2",
  DAI: "0xd5801d470c7e227C4b9E0E454c8A238b40989781",
  USDC: "0xA9C83C05A2d350D210E94b383C362fd9e612a90d",
  USDT: "0xF4A2Ce6552235932d3AA4695985839A457688675",
  ETH: "0x4680Fb30Aa384C15CE6b409A3f6bA9064587c321",
};

export const addressesToToken: { [x: string]: string } = {
  ["0x7EcD62D6f9dD7b0C500330635dF4F171F195D2fF"]: addresses.DAI_Goerli,
  ["0x0FEA97153F0AE29CD97fFFd9425002CF68886042"]: addresses.USDC_Goerli,
  ["0x6802A54a585A10b02073063fba0eC64026bd920c"]: addresses.USDT_Goerli,
  ["0x13D0ECF0Da19832673cCE704FC5E3cC519B1459B"]: addresses.gETH,
  ["0xC5020e9379143F9F586e29a45c7D303f6d8879C2"]: addresses.BTC,
  ["0xd5801d470c7e227C4b9E0E454c8A238b40989781"]: addresses.DAI,
  ["0xA9C83C05A2d350D210E94b383C362fd9e612a90d"]: addresses.USDC,
  ["0xF4A2Ce6552235932d3AA4695985839A457688675"]: addresses.USDT,
  ["0x4680Fb30Aa384C15CE6b409A3f6bA9064587c321"]: addresses.ETH,
};

export const tokensToName: { [x: string]: string } = {
  ["0x7EcD62D6f9dD7b0C500330635dF4F171F195D2fF"]: "DAI_Goerli",
  ["0x0FEA97153F0AE29CD97fFFd9425002CF68886042"]: "USDC_Goerli",
  ["0x6802A54a585A10b02073063fba0eC64026bd920c"]: "USDT_Goerli",
  ["0x13D0ECF0Da19832673cCE704FC5E3cC519B1459B"]: "gETH",
  ["0xC5020e9379143F9F586e29a45c7D303f6d8879C2"]: "BTC",
  ["0xd5801d470c7e227C4b9E0E454c8A238b40989781"]: "DAI",
  ["0xA9C83C05A2d350D210E94b383C362fd9e612a90d"]: "USDC",
  ["0xF4A2Ce6552235932d3AA4695985839A457688675"]: "USDT",
  ["0x4680Fb30Aa384C15CE6b409A3f6bA9064587c321"]: "ETH",
};

export const tokensToIcon: {
  [x: string]: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >;
} = {
  ["0x7EcD62D6f9dD7b0C500330635dF4F171F195D2fF"]: RenDAIIcon,
  ["0x0FEA97153F0AE29CD97fFFd9425002CF68886042"]: RenUSDCIcon,
  ["0x6802A54a585A10b02073063fba0eC64026bd920c"]: RenUSDTIcon,
  ["0x13D0ECF0Da19832673cCE704FC5E3cC519B1459B"]: RenETHIcon,
  ["0xC5020e9379143F9F586e29a45c7D303f6d8879C2"]: RenBTCIcon,
  ["0xd5801d470c7e227C4b9E0E454c8A238b40989781"]: RenDAIIcon,
  ["0xA9C83C05A2d350D210E94b383C362fd9e612a90d"]: RenUSDCIcon,
  ["0xF4A2Ce6552235932d3AA4695985839A457688675"]: RenUSDTIcon,
  ["0x4680Fb30Aa384C15CE6b409A3f6bA9064587c321"]: RenETHIcon,
};

export const ERC20AddressesToABI: { [x: string]: AbiItem[] } = {
  [addresses.DAI_Goerli]: ERC20ABI,
  [addresses.USDC_Goerli]: ERC20ABI,
  [addresses.USDT_Goerli]: ERC20ABI,
  [addresses.gETH]: ERC20ABI,
  [addresses.BTC]: ERC20ABI,
  [addresses.DAI!]: ERC20ABI,
  [addresses.USDC!]: ERC20ABI,
  [addresses.USDT!]: ERC20ABI,
  [addresses.ETH!]: ERC20ABI,
};

export const contractAddresses = {
  boundlessAdapter: "0xbeBf316627C68F0dDc9f662653E23cA398D0e478",
  oneInchAdapter: "0xb83efe085480cEdbf42DBff694c6ec2501F8b100",
  oneInch: "0x1111111254fb6c44bac0bed2854e76f90643097d",
  gatewayAdapter: "0xb6E3ea8333fc9DA481eceC4a168AB9E56611EA3b",
  forwarder: "0x71A49976acD3b99F7b9473BE41A4ba71f78cFfdA",
  catalogAdapter: "0xB357Ad84213FF7972312Fff5767dE5819996f74C",
  catalogRen: "0x96081a4e7C3617a4d7dAc9AC84D97255d63773d2",
  boundlessAdapterTestnet: "0x41725e37Db5C4588e1Af8fBAfF80780eD790468E",
  oneInchAdapterTestnet: "0xEd8E8A59102380Fd048F1501b1B88C42bbF6fA9a",
  oneInchTestnet: "0x852Af2C10786F7c9B3CaD6327f61FEf97C5574F7",
  gatewayAdapterTestnet: "0x2C54BE43bec90EC8517be0e93927684E0C0a7053",
  forwarderTestnet: "0x71A49976acD3b99F7b9473BE41A4ba71f78cFfdA",
  catalogAdapterTestnet: "0xB345d5016D3dDFBEB5CB03b7A9080d75144C4Cd6",
  catalogRenTestnet: "0xa3DEB3F1A03A505502C1b7D679521f93F1105542",
};

export const contractToABI: { [x: string]: any } = {
  [contractAddresses.boundlessAdapter!.toLowerCase()!]: BoundlessAdapterABI,
  [contractAddresses.oneInchAdapter!.toLowerCase()!]: OneInchAdapterABI,
  [contractAddresses.oneInch!.toLowerCase()!]: MockOneInchABI,
  [contractAddresses.gatewayAdapter!.toLowerCase()!]: GatewayAdapterABI,
  [contractAddresses.catalogAdapter!.toLowerCase()!]: CatalogSwapAdapterABO,
  [contractAddresses.catalogRen!.toLowerCase()!]: CatalogABI,
  [contractAddresses.forwarder!.toLowerCase()!]: ForwarderABI,
  [addresses.BTC.toLowerCase()]: ERC20ABI,
  [addresses.USDT.toLowerCase()]: ERC20ABI,
  [addresses.USDC.toLowerCase()]: ERC20ABI,
  [addresses.DAI.toLowerCase()]: ERC20ABI,
  [addresses.ETH.toLowerCase()]: ERC20ABI,
  [contractAddresses.boundlessAdapterTestnet!.toLowerCase()!]: BoundlessAdapterABI,
  [contractAddresses.oneInchAdapterTestnet!.toLowerCase()!]: OneInchAdapterABI,
  [contractAddresses.oneInchTestnet!.toLowerCase()!]: MockOneInchABI,
  [contractAddresses.gatewayAdapterTestnet!.toLowerCase()!]: GatewayAdapterABI,
  [contractAddresses.catalogAdapterTestnet!.toLowerCase()!]: CatalogSwapAdapterABO,
  [contractAddresses.catalogRenTestnet!.toLowerCase()!]: CatalogABI,
  [contractAddresses.forwarderTestnet!.toLowerCase()!]: ForwarderABI,
  [addresses.USDT_Goerli.toLowerCase()]: ERC20ABI,
  [addresses.USDC_Goerli.toLowerCase()]: ERC20ABI,
  [addresses.DAI_Goerli.toLowerCase()]: ERC20ABI,
  [addresses.gETH.toLowerCase()]: ERC20ABI,
};

export const inputDataSignaturesToABI: { [x: string]: any } = {
  ["0xf486e492"]: BoundlessAdapterABI,
  ["0xd78af5f1"]: BoundlessAdapterABI,
  ["0x2f2ff15d"]: BoundlessAdapterABI,
  ["0x72d87c8f"]: SmartWalletABI,
  ["0x00babbd9"]: BoundlessAdapterABI,
  ["0x73406496"]: GatewayAdapterABI,
  ["0x095ea7b3"]: ERC20ABI,
  ["0x6ffe492e"]: CatalogSwapAdapterABO,
  ["0x7d607cfa"]: "Unknown Contract",
  ["0x28967fe2"]: BoundlessAdapterABI,
  ["0x72b6394b"]: CatalogSwapAdapterABO,
  ["0x60806040"]: "Unknown Contract",
  ["0xce8d6204"]: CatalogABI,
  ["0xc45b71de"]: CatalogABI,
  ["0xbeabacc8"]: CatalogABI,
  ["0xcd74662f"]: ForwarderABI,
  ["0x31de7d15"]: ForwarderABI,
};
