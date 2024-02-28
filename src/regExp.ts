/**
 * 手机
 */
export const mobileRule = /^1\d{10}$/;
/**
 * 座机
 */
export const landRule = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,8}$/;
/**
 * 银行卡号
 */
export const bankCardRule = /^[0-9]{16,19}$/;
/**
 * 人姓名
 */
export const nameRule = /^[\u4e00-\u9fa5]{2,4}$/;
/**
 * 身份证号
 */
export const idNoRule = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

/**
 * 防止正则注入攻击（ReDOS）
 * @param str      待处理的字符串
 */
export function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/**
 * 判断是否包含中文
 * @param    inputVal    用户输入的配件名
 */
export function hasChinese(inputVal: string) {
  const pattern = /[\u4e00-\u9fa5]/;
  return pattern.test(inputVal);
}
