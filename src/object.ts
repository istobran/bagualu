import { isObjectLike, isNull, keys } from 'lodash-es';

/**
 * 只更新现有对象里面已经有的字段
 * @param   target        现有对象
 * @param   source        新的数据对象
 * @param   ignoreNull    是否忽略 null 赋值
 * @return
 */
export function updateObject<T = object>(target: T, source: object, ignoreNull = false) {
  if (isObjectLike(target) && isObjectLike(source)) {
    keys(target).forEach(key => {
      const ignoreNullAssign = ignoreNull ? source[key] !== null : true;
      if (source[key] !== undefined && ignoreNullAssign) {
        target[key] = source[key];
      }
    });
  }
  return target;
}

/**
 * 当后端返回的对象字段值为 null 时，替换为默认数据
 * @param   target    后端返回的对象
 * @param   defaults  包含默认字段的对象
 * @return
 */
export function defaultsNull<T = object>(target: T, defaults: Partial<T>) {
  keys(target).forEach(key => {
    if (isNull(target[key]) && defaults[key]) {
      target[key] = defaults[key];
    }
  });
  return target;
}
