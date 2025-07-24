/**
 * Currency formatting utilities for PKR (Pakistani Rupee)
 */

/**
 * Format a number as PKR currency
 * @param amount - The amount to format
 * @param options - Optional formatting options
 * @returns Formatted currency string (e.g., "PKR 25,000")
 */
export const formatPKR = (
  amount: number, 
  options: {
    showDecimals?: boolean;
    compact?: boolean;
  } = {}
): string => {
  const { showDecimals = false, compact = false } = options;
  
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'PKR 0';
  }

  // For compact format (like PKR 25K)
  if (compact && amount >= 1000) {
    if (amount >= 1000000) {
      const millions = amount / 1000000;
      return `PKR ${millions.toFixed(1)}M`;
    } else if (amount >= 1000) {
      const thousands = amount / 1000;
      return `PKR ${thousands.toFixed(1)}K`;
    }
  }

  // Standard format with commas
  const formatter = new Intl.NumberFormat('en-PK', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });

  return `PKR ${formatter.format(amount)}`;
};

/**
 * Format currency for admin displays (more compact)
 * @param amount - The amount to format
 * @returns Formatted currency string for admin use
 */
export const formatPKRAdmin = (amount: number): string => {
  return formatPKR(amount, { compact: false });
};

/**
 * Format currency for product displays
 * @param amount - The amount to format
 * @returns Formatted currency string for products
 */
export const formatPKRProduct = (amount: number): string => {
  return formatPKR(amount);
};

/**
 * Parse PKR formatted string back to number
 * @param pkrString - PKR formatted string
 * @returns Number value
 */
export const parsePKR = (pkrString: string): number => {
  if (!pkrString) return 0;
  
  // Remove PKR, commas, and spaces
  const cleanString = pkrString
    .replace(/PKR\s*/i, '')
    .replace(/,/g, '')
    .trim();
  
  return parseFloat(cleanString) || 0;
};

export default {
  formatPKR,
  formatPKRAdmin,
  formatPKRProduct,
  parsePKR
}; 