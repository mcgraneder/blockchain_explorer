import { UilBitcoinSign } from "@iconscout/react-unicons";
import Image from "next/image";

export type SupportedChain = "Catalog" | "Ethereum" | "BinanceSmartChain";

export type Token = {
  address: string;
  symbol: string;
  underlyingSymbol?: string;
  name: string;
  decimals: number;
  chain: SupportedChain;
  image: string;
  withdrawalFee: number;
  balance: string;
  swbalance: string;
};

const TokenImage = ({
  token,
  className = "",
  svgClassName = "",
}: {
  className?: string;
  svgClassName?: string;
  token?: Token;
}) => {
  return (
    <div
      className={`flex items-center justify-center rounded-full relative w-10 h-10 md:w-16 md:h-16 bg-black-900 ${className}`}>
      {token ? (
        <Image src={token.image} alt={`${token.symbol} image`} layout='fill' />
      ) : (
        <UilBitcoinSign className={`text-grey-600 ${svgClassName}`} />
      )}
    </div>
  );
};

export default TokenImage;
