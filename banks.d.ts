import type { Bank } from "./index";

/** Raw bank data: everything in `Bank` except the resolved `icon`. Frozen at runtime. */
export type BankData = Readonly<Omit<Bank, "icon" | "bins">> & {
  readonly bins: readonly string[];
};

export const BANKS: readonly BankData[];
