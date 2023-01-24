import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import ActiveTabIndicator from "public/svgs/active-tab-indicator.svg";
import ExplorerIcon from "../../../public/svgs/explorer-icon.svg";
import { NavItemProps } from "./NavigationBar";
import NamesIcon from "../../../public/svgs/Names.svg";
import TradeIcon from "../../../public/svgs/Trade.svg";
import { UilSync } from "@iconscout/react-unicons";
import { redirectLinks } from "src/constants/Apis";

interface BottomNavigationBarProps {
  inMaintenance?: boolean;
}

const NavItem = ({ route, Icon, label, inMaintenance = false }: NavItemProps) => {
  const { pathname } = useRouter();

  return (
    <div className='flex-1'>
      <Link href={route} passHref>
        <a
          className={`relative  flex flex-col items-center ${
            inMaintenance ? "pointer-events-none" : ""
          } p-4`}>
          {pathname === route && <ActiveTabIndicator className='absolute top-0 rotate-180' />}
          <span
            className={`flex flex-col items-center gap-2 font-semibold ${
              inMaintenance ? "text-grey-450" : pathname === route ? `text-primary ` : ""
            }`}>
            <Icon color={inMaintenance ? "#7A7A7A" : pathname === route ? "#2CC995" : "#FAFAFA"} />
            {label}
          </span>
        </a>
      </Link>
    </div>
  );
};

function BottomNavigationBar({ inMaintenance = false }: BottomNavigationBarProps) {
  const { t } = useTranslation();
  return (
    <div className='flex justify-around w-full bg-black-800 lg:hidden'>
      <NavItem
        inMaintenance={inMaintenance}
        route={redirectLinks.analytics}
        Icon={UilSync}
        label={t("navigationLabels.analytics")}
      />
      <NavItem
        inMaintenance={inMaintenance}
        route='/explorerHome'
        Icon={ExplorerIcon}
        label={t("navigationLabels.explorer")}
      />
    </div>
  );
}

export default BottomNavigationBar;
