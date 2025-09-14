import type { RoundingMode } from 'big.js';
import Big from 'big.js';

export function pow(base: number | string, exponent: number) {
  return new Big(base).pow(exponent).toString();
}

// 乘法
export function times(num1: number | string, num2: number | string, toFix?: number) {
  if (toFix !== undefined) {
    return new Big(num1).times(num2).toFixed(toFix, 0);
  }

  return new Big(num1).times(num2).toString();
}

// 加法
export function plus(num1: number | string, num2: number | string, toFix?: number) {
  if (toFix !== undefined) {
    return new Big(num1).plus(num2).toFixed(toFix, 0);
  }

  return new Big(num1).plus(num2).toString();
}

// 求和
export function sum(numbers: (number | string)[], toFix?: number): string {
  if (numbers.length === 0) {
    return toFix !== undefined ? new Big(0).toFixed(toFix, 0).toString() : '0';
  }

  return numbers.reduce<string>((acc, cur) => plus(acc, cur), toFix !== undefined ? new Big(0).toFixed(toFix, 0).toString() : '0');
}

// 是否相等
export function equal(num1: number | string, num2: number | string) {
  return new Big(num1).eq(num2);
}

// 除法
export function divide(num1: number | string, num2: number | string, toFix?: number) {
  if (toFix !== undefined) {
    return new Big(num1).div(num2).toFixed(toFix, 0);
  }

  return new Big(num1).div(num2).toString();
}

// 大于
export function gt(num1: number | string, num2: number | string) {
  return new Big(num1).gt(num2);
}

// 大于等于
export function gte(num1: number | string, num2: number | string) {
  return new Big(num1).gte(num2);
}

// 小于
export function lt(num1: number | string, num2: number | string) {
  return new Big(num1).lt(num2);
}

// 小于等于
export function lte(num1: number | string, num2: number | string) {
  return new Big(num1).lte(num2);
}

// 减法
export function minus(num1: number | string, num2: number | string, toFix?: number) {
  if (toFix !== undefined) {
    return new Big(num1).minus(num2).toFixed(toFix, 0);
  }

  return new Big(num1).minus(num2).toString();
}

export function ceil(num: string | number) {
  const splitedNum = String(num).split('.');

  if (gt(splitedNum?.[1] || '0', '0')) {
    return new Big(num).plus('1').toFixed(0, 0);
  }

  return new Big(num).toFixed(0, 0);
}

export function fix(number: string, decimal?: number, optional: RoundingMode = 0) {
  try {
    return Big(number).toFixed(decimal, optional);
  } catch {
    return number;
  }
}

export function toDisplayDenomAmount(number: string | number, decimal: number) {
  if (decimal === 0) {
    return String(number);
  }

  return times(number, pow(10, -decimal), decimal);
}

export function toBaseDenomAmount(number: string | number, decimal: number) {
  if (decimal === 0) {
    return String(number);
  }

  return times(number, pow(10, decimal), 0);
}

export function isNumber(number: string) {
  try {
    Big(number);
  } catch {
    return false;
  }
  return true;
}

export function isDecimal(number: string, decimal: number) {
  if (!isNumber(number)) {
    return false;
  }

  const regex = new RegExp(`^([1-9][0-9]*\\.?[0-9]{0,${decimal}}|0\\.[0-9]{0,${decimal}}|0)$`);

  if (!regex.test(number)) {
    return false;
  }

  return true;
}

export function calculatePercentiles(numbers: number[], percentiles: number[]) {
  if (numbers.length === 0) {
    return [];
  }

  const sortedNumbers = numbers.slice().sort((a, b) => a - b);

  return percentiles.map((percentile) => {
    const index = Number(minus(ceil(times(divide(percentile, '100'), sortedNumbers.length)), '1'));
    return sortedNumbers[index];
  });
}

/**
 * 将最小单位转为可读的 Token 数量
 * @param value - 最小单位数值
 * @param decimals - 精度
 * @param precision - 保留的小数位数
 * @returns token
 */
export function formatUnits(value: string | number, decimals: number, precision: number): string {
  if (!value) return "";
  const BigValue = new Big(value);
  const BigDecimal = new Big(10).pow(decimals);
  const result = BigValue.div(BigDecimal).toFixed();
  return precision ? truncateDecimals(result, precision) : result;
}

/**
 * 将 token 数量转为最小单位
 * @param value - token
 * @param decimals - 精度
 * @returns 最小单位数值
 */
export function parseUnits(value: string | number, decimals: number): string {
  if (!value) return "";
  const BigValue = new Big(value);
  const BigDecimal = new Big(10).pow(decimals);
  return BigValue.times(BigDecimal).toFixed();
}

/**
 * 截取字符串小数
 * @param str - 待截取的字符串
 * @param decimalPlaces - 保留的小数位
 * @returns 处理后的字符串
 */
export function truncateDecimals(str: string | number, decimalPlaces: number): string {
  if (typeof str !== 'string') str = str.toString();
  if (!str.includes('.'))
    return str // 如果没有小数点，直接返回原字符串

  const [integerPart, decimalPart] = str.split('.')
  const truncatedDecimal = decimalPart.slice(0, decimalPlaces) // 截取小数部分前 N 位
  return truncatedDecimal ? `${integerPart}.${truncatedDecimal}` : integerPart
}

/**
 * 格式化数字，使用自定义千位分隔符
 * @param {number} num - 需要格式化的数字
 * @param {string} separator - 自定义的千位分隔符，默认为逗号 ","
 * @returns {String} - 格式化后的数字字符串
 */
export function formatNumberWithSeparator(num: number | string, separator = ","): string {
  // 将数字转换为字符串
  const numStr = num.toString();
  // 如果是小数，分开整数部分和小数部分
  const [integerPart, decimalPart] = numStr.split(".");
  // 使用正则在整数部分插入千位分隔符
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  // 如果有小数部分，合并整数和小数部分
  if (decimalPart) {
    return `${formattedInteger}.${decimalPart}`;
  }
  return formattedInteger;
}
