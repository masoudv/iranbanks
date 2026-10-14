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
  /** Absolute paths of the SVG icons, or null if there are none */
  icon: BankIcons | null;
}

export interface BankInfo extends Omit<Bank, "bins"> {
  /** The 6 digits that matched */
  bin: string;
  /** Cleaned card number */
  cardNumber: string;
}

export interface DetectionResult {
  success: boolean;
  bank?: BankInfo;
  message?: string;
  bin?: string;
}

export interface SupportedBank {
  bin: string;
  name: string;
}

/**
 * تشخیص بانک از روی شماره کارت
 */
export function detectBank(cardNumber: string | number): DetectionResult;

/**
 * بررسی معتبر بودن شماره کارت ایرانی
 */
export function isValidIranianCard(cardNumber: string | number): boolean;

/**
 * دریافت لیست BINهای پشتیبانی شده (یک ردیف برای هر BIN)
 */
export function getSupportedBanks(): SupportedBank[];

/**
 * دریافت لیست کامل بانک‌ها (یک ردیف برای هر بانک)
 */
export function getBanks(options?: { status?: BankStatus }): Bank[];

/**
 * دریافت اطلاعات یک بانک با کد آن
 */
export function getBankByCode(code: string): Bank | null;

/**
 * مسیر مطلق آیکون SVG بانک (نسخه رنگی یا تک‌رنگ)؛ در صورت نبودن آیکون null
 */
export function getBankIcon(code: string, variant?: IconVariant): string | null;

/**
 * نگاشت BIN به نام فارسی بانک
 */
export const IRANIAN_BANKS: Record<string, string>;
