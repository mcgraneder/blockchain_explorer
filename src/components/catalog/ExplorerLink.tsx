import { UilExternalLinkAlt } from "@iconscout/react-unicons";

import { isProduction } from "../../utils/misc";
import Tooltip from "./Tooltip";
import { redirectLinks } from "src/constants/Apis";

interface ExplorerProps {
  txId: string;
  tooltipText: string;
}

function ExplorerLink({ txId, tooltipText }: ExplorerProps) {
  return (
    <div className={`flex justify-center mr-2`}>
      <Tooltip content={tooltipText}>
        <a href={`${redirectLinks.renExplorerLink}${txId}`} rel='noreferrer' target='_blank'>
          <UilExternalLinkAlt size={"24px"} className={`text-blue ml-1`} />
        </a>
      </Tooltip>
    </div>
  );
}

export default ExplorerLink;
