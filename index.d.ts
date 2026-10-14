export type IconVariant = "color" | "mono";

export interface BankIcons {
  color?: string;
  mono?: string;
}

export type BankStatus = "active" | "merged";

export interface Bank {
  /** English slug, e.g. "melli". Also the icon file name. */
  code: string;
  /** Persian name */
  name: string;
  /** English name */
  nameEn: string;
  /** 6-digit card prefixes */
  bins: string[];
  /** 3-digit bank code inside the IBAN, or null */
  shebaCode: string | null;
  status: BankStatus;
  /** Code of the acquiring bank (only when status is "merged") */
  mergedInto?: string;
  /**
   * Icon locations, or null if there are none. Node: absolute file paths.
   * Browser entry: package subpaths such as "iranbanks/icons/color/melli.svg".
   */
  icon: BankIcons | null;
}

export interface BankInfo extends Omit<Bank, "bins"> {
  /** The 6 digits that matched */
  bin: string;
  /** Cleaned card number */
  cardNumber: string;
}

export interface DetectionSuccess {
  success: true;
  bank: BankInfo;
}

export interface DetectionFailure {
  success: false;
  message: string;
  /** The 6 digits that were looked up */
  bin: string;
  bank?: undefined;
}

export type DetectionResult = DetectionSuccess | DetectionFailure;

export interface SupportedBank {
  bin: string;
  name: string;
}

/**
 * Detect the issuing bank from a card number.
 * Throws when the input is empty, shorter than 6 digits or not numeric.
 * Pass the number as a string: JS numbers above 2^53 have already lost digits.
 */
export function detectBank(cardNumber: string | number): DetectionResult;

/**
 * Check a 16-digit card number with the Luhn algorithm.
 */
export function isValidIranianCard(cardNumber: string | number): boolean;

/**
 * List every supported BIN, one row per BIN.
 */
export function getSupportedBanks(): SupportedBank[];

/**
 * List banks, one row per bank.
 */
export function getBanks(options?: { status?: BankStatus }): Bank[];

/**
 * Look up one bank by its code.
 */
export function getBankByCode(code: string): Bank | null;

/**
 * Location of a bank's SVG icon (color or mono), or null when there is none.
 * Node: absolute file path. Browser entry: package subpath.
 */
export function getBankIcon(code: string, variant?: IconVariant): string | null;

/**
 * BIN -> Persian bank name map.
 */
export const IRANIAN_BANKS: Record<string, string>;
