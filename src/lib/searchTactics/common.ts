import { utils } from "@renproject/utils";
const assert = (input: boolean) => {
  if (!input) {
    throw new Error(`'require' failed.`);
  }
};

const doesntError = <T extends any[]>(f: (...p: T) => boolean | void) => {
  return (...p: T) => {
    try {
      const response = f(...p);
      return response === undefined || response === true ? true : false;
    } catch (error: any) {
      return false;
    }
  };
};

export const isBase64 = doesntError(
  (
    input: string,
    options: {
      length?: number;
    } = {}
  ) => {
    const buffer = Buffer.from(input, "base64");
    return (
      (options.length === undefined || buffer.length === options.length) &&
      buffer.toString("base64") === input
    );
  }
);

export const isURLBase64 = doesntError(
  (
    input: string,
    options: {
      length?: number;
    } = {}
  ) => {
    const buffer = Buffer.from(input, "base64");
    assert(options.length === undefined || buffer.length === options.length);
    assert(utils.toURLBase64(buffer) === input);
  }
);
