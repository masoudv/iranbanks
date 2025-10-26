export interface BankInfo {
  name: string;
  bin: string;
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
export function detectBank(cardNumber: string): DetectionResult;

/**
 * بررسی معتبر بودن شماره کارت ایرانی
 */
export function isValidIranianCard(cardNumber: string): boolean;

/**
 * دریافت لیست تمام بانک‌های پشتیبانی شده
 */
export function getSupportedBanks(): SupportedBank[];

/**
 * لیست بانک‌های ایرانی
 */
export const IRANIAN_BANKS: Record<string, string>;