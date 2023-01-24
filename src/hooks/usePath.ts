import React, { useState, useCallback, useEffect } from "react";
import { Flow } from "../types/flow";
import { useRouter } from "next/router";

const usePath = () => {
  const [flow, setFlow] = useState<Array<string>>([]);
  const { asPath } = useRouter();

  useEffect(() => {
    if (asPath) pushFlow(asPath);
  }, []);

  const pushFlow = useCallback((nf: string) => setFlow((f) => [...f, nf]), []);
  const popFlow = useCallback(
    () =>
      setFlow((f) => {
        const fl = [...f];
        fl.pop();
        return fl;
      }),
    []
  );
  const resetFlow = useCallback(() => setFlow(["/explorerHome"]), []);

  return { flow, setFlow, pushFlow, popFlow, resetFlow };
};

export default usePath;
