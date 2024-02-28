import { IVec2, Vec2 } from './vec2';

export interface ITransform2D {
  translate: IVec2;
  scale: IVec2;
  rotate: number;
  (translate?: IVec2, scale?: IVec2 | number, rotate?: number): ITransform2D;
  new (translate?: IVec2, scale?: IVec2 | number, rotate?: number): ITransform2D;
  clone(): ITransform2D;
  set(v: { translate?: IVec2, scale?: IVec2 | number, rotate?: number }): ITransform2D;
  move(v: IVec2): ITransform2D;
  containAndCenter(imageSize: IVec2, wrapperSize: IVec2): ITransform2D;
  scaleFromPoint(rawScale: IVec2 | number, point: IVec2, origin?: IVec2): ITransform2D;
  rotateFromPoint(radian: number, point: IVec2, origin?: IVec2): ITransform2D;
  toMatrix(): [number, number, number, number, number, number];
  toString(): string;
}

export const Transform2D = function (this: ITransform2D, translate = Vec2(), scale: IVec2 | number = 1, rotate = 0) {
  if (typeof this === 'undefined') return new Transform2D(translate, scale, rotate);
  const scaleVec = typeof scale === 'number' ? Vec2(scale) : scale;
  this.translate = translate;
  this.scale = scaleVec;
  this.rotate = rotate || 0;
} as ITransform2D;

Transform2D.prototype.clone = function (this: ITransform2D) {
  return Transform2D(this.translate.clone(), this.scale.clone(), this.rotate);
}

Transform2D.prototype.set = function (this: ITransform2D, v: { translate?: IVec2, scale?: IVec2 | number, rotate?: number }) {
  if (typeof v.translate !== 'undefined') this.translate = v.translate;
  if (typeof v.scale !== 'undefined') this.scale = typeof v.scale === 'number' ? Vec2(v.scale) : v.scale;
  if (typeof v.rotate !== 'undefined') this.rotate = v.rotate;
  return this;
}

Transform2D.prototype.move = function (this: ITransform2D, v: IVec2) {
  this.translate = this.translate.add(v);
  return this;
}

Transform2D.prototype.containAndCenter = function (this: ITransform2D, imageSize: IVec2, wrapperSize: IVec2) {
  const scale = wrapperSize.div(imageSize); // wrapper / image 得到 x 和 y 各自的缩放比例分量
  const minScale = Math.min(scale.x, scale.y); // 取最小的缩放比例
  const scaled = imageSize.scale(minScale); // 求出缩放后的尺寸大小
  const offset = scaled.sub(imageSize).div(2); // 求出缩放后图片回到左上原点的向量
  const center = wrapperSize.sub(scaled).div(2); // 计算左上原点到居中位置的向量
  const translate = offset.add(center); // 求出图片居中时的向量
  this.set({ translate, scale: minScale });
  return this;
}

Transform2D.prototype.scaleFromPoint = function (this: ITransform2D, rawScale: IVec2 | number, point: IVec2, origin = Vec2()) {
  const newScale = this.scale.mul(rawScale).max(0.000001); // 限制最小缩放
  const realRatio = newScale.div(this.scale); // 求出实际缩放比例
  const offsetToOrigin = point.sub(origin); // 求出图片缩放原点到鼠标位置的向量
  const scaledOffset = offsetToOrigin.scale(realRatio); // 对向量进行缩放
  const delta = scaledOffset.sub(offsetToOrigin); // 求出实际缩放产生的位置变化向量
  this.set({ translate: this.translate.sub(delta), scale: newScale });
  return this;
}

Transform2D.prototype.rotateFromPoint = function (this: ITransform2D, radian: number, point: IVec2, origin = Vec2()) {
  const offsetToOrigin = point.sub(origin); // 求出图片旋转原点到鼠标位置的向量
  const rotatedOffset = offsetToOrigin.rotate(radian); // 对向量进行旋转
  const delta = rotatedOffset.sub(offsetToOrigin); // 求出实际旋转产生的位置变化向量
  this.set({ translate: this.translate.add(delta), rotate: this.rotate + radian });
  return this;
}

/**
 * 生成 2x3 仿射变换矩阵
 * (Sx*cosθ)  (-Sx*sinθ)  Tx
 * (Sy*sinθ)  (Sy*cosθ)   Ty
 */
Transform2D.prototype.toMatrix = function (this: ITransform2D) {
  const { translate, scale, rotate } = this;
  const cos = Math.cos(rotate);
  const sin = Math.sin(rotate);
  return [scale.x * cos, scale.y * sin, -scale.x * sin, scale.y * cos, translate.x, translate.y];
}

Transform2D.prototype.toString = function (this: ITransform2D) {
  return `matrix(${this.toMatrix().join(',')})`;
}
