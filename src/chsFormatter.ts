// 常用的 filter 函数
import { isNumber, padStart, isDate } from 'lodash-es';

/**
 * 不足两位的数组前面补个 0
 * @param num
 */
export function padZero(num: number) {
  return padStart(String(Math.floor(num)), 2, '0');
}

/**
 * 仿照moment的接口，简单实现 formatDate
 * @param         dateStamp   时间戳
 * @param         durations   是否算时间段, 时间段会减8小时（东八区）
 * @return
 */
export function moment(dateStamp: number, durations = false) {
  const date = new Date(dateStamp);
  return {
    format(pattern?: string) {
      const str = typeof pattern === 'string' ? pattern : 'yyyy-MM-dd';
      if (!isNaN(date.getTime())) {
        return str.replace(/yyyy/i, padZero(date.getFullYear()))
          .replace(/MM/, padZero(date.getMonth() + 1))
          .replace(/dd/i, padZero(date.getDate()))
          .replace(/hh/i, durations ? padZero(date.getUTCHours()) : padZero(date.getHours()))
          .replace('mm', padZero(date.getMinutes()))
          .replace(/ss/i, padZero(date.getSeconds()));
      }
      return '';
    },
  };
}

/**
 * 日期格式化（YYYY-MM-DD）
 * @param {number}  timeStamp   待格式化的时间戳
 */
export function date(timeStamp: number) {
  return isNumber(timeStamp)
    ? moment(timeStamp).format('YYYY-MM-DD')
    : '';
}

/**
 * 中文日期格式化（YYYY 年 MM 月 DD 日）
 * @param   timeStamp   待格式化的时间戳
 */
export function chsDate(timeStamp: number) {
  return isNumber(timeStamp)
    ? moment(timeStamp).format('YYYY 年 MM 月 DD 日')
    : '';
}

/**
 * 日期时间格式化（YYYY-MM-DD HH:mm:ss）
 * @param   timeStamp   待格式化的时间戳
 */
export function dateTime(timeStamp: number) {
  return isNumber(timeStamp)
    ? moment(timeStamp).format('YYYY-MM-DD HH:mm:ss')
    : '';
}

/**
 * 百分比格式化（例：0.123 会转成 12.30%）
 * @param     value   0 到 1 之间的小数
 */
export function percent(value: number) {
  return isNumber(value)
    ? `${(value * 100).toFixed(2)}%`
    : '';
}

/**
 * 内部价格数字转换函数
 * @param     value   待处理的价格
 */
export function formatPrice(value: number) {
  const num = Math.abs(value).toFixed(2).toString().split('.');
  num[0] = num[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return num.join('.');
}

/**
 * 价格格式化（例：-1234.1 会变成 -¥1,234.10）
 * 使用半角人民币符号，不是全角的
 * 详见：https://zhuanlan.zhihu.com/p/54219678
 * @param     value   待处理的价格
 */
export function price(value?: number | string) {
  let val = value;
  if (typeof value === 'string') {
    val = Number(value)
  }
  if (typeof val !== 'number' || isNaN(val)) {
    return '';
  }
  return value >= 0
    ? `¥${formatPrice(val)}`
    : `-¥${formatPrice(val)}`;
}

/**
 * 数量格式化 （例：-1234.1 会变成 -1,234）
 * @param num  数量值
 */
export function amount(num?: number | string | null) {
  let val = num;
  if (typeof val === 'string') {
    val = val.replace(/[^\d+-\.]/g, ''); // 删掉非数字字符
  }
  val = parseInt(String(val), 10); // 去除小数部分
  if (isNaN(val)) return ''; // undefined 和 空字符串都会变成 NaN，所以这里只要判断NaN就好啦
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 时间差转换为时分秒倒计时
 * 最终会输出 124:22:11 这样的时分秒格式
 * @param startTime   起始时间
 * @param endTime     终止时间
 */
export function toRemainTime(startTime: Date | number | string, endTime: Date | number | string) {
  const start = isDate(startTime) ? startTime as Date : new Date(startTime);
  const end = isDate(endTime) ? endTime as Date : new Date(endTime);
  const remain = Math.max(0, end.getTime() - start.getTime());
  const seconds = remain / 1e3;
  const hour = padZero(seconds / 3600);
  const minute = padZero(seconds / 60 % 60);
  const second = padZero(seconds % 60);
  const text = `${hour}:${minute}:${second}`;
  return { remain, text, hour, minute, second };
}
