import { UilCheckCircle, UilClipboardNotes } from "@iconscout/react-unicons";
import React, { useEffect, useState } from "react";

interface CopyIconProps {
  text: string;
  onCopy?: (text: string) => void;
}

function CopyIcon({ text, onCopy }: CopyIconProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (copied) timer = setTimeout(() => setCopied(false), 3000);
    return () => {
      clearTimeout(timer);
    };
  }, [copied]);

  async function handleCopy(e: any) {
    e.stopPropagation();
    e.preventDefault();

    try {
      await navigator.clipboard.writeText(text);
      onCopy?.(text);
      setCopied(true);
    } catch (e) {}
  }

  return (
    <button className='p-[5px] rounded-full bg-black-600' onClick={handleCopy}>
      {!copied && <UilClipboardNotes className='w-3 h-3 text-grey-400 ' />}
      {copied && <UilCheckCircle className='w-3 h-3 text-primary ' />}
    </button>
  );
}

export default CopyIcon;
