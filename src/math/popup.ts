import { IRect, Rect } from './rect';

export interface IPopupBuilder {
  source: IRect;
  target: IRect;
  offset: number;
  (source: IRect, target: IRect, offset?: number): IPopupBuilder;
  new (source: IRect, target: IRect, offset?: number): IPopupBuilder;
  buildTop(): IRect;
  buildBottom(): IRect;
  buildLeft(): IRect;
  buildRight(): IRect;
  buildSafe(safeArea: IRect): IRect;
}

export const PopupBuilder = function (this: IPopupBuilder, source: IRect, target: IRect, offset = 0) {
  if (typeof this === 'undefined') return new PopupBuilder(source, target);
  this.source = source;
  this.target = target;
  this.offset = offset;
} as IPopupBuilder;

PopupBuilder.prototype.buildTop = function (this: IPopupBuilder) {
  const { source, target, offset } = this;
  const top = target.top - source.height - offset;
  const left = target.getCenter().x - source.width / 2;
  return Rect(left, top, source.width, source.height);
}

PopupBuilder.prototype.buildBottom = function (this: IPopupBuilder) {
  const { source, target, offset } = this;
  const top = target.top + target.height + offset;
  const left = target.getCenter().x - source.width / 2;
  return Rect(left, top, source.width, source.height);
}

PopupBuilder.prototype.buildLeft = function (this: IPopupBuilder) {
  const { source, target, offset } = this;
  const top = target.getCenter().y - source.height / 2;
  const left = target.left - source.width - offset;
  return Rect(left, top, source.width, source.height);
}

PopupBuilder.prototype.buildRight = function (this: IPopupBuilder) {
  const { source, target, offset } = this;
  const top = target.getCenter().y - source.height / 2;
  const left = target.left + target.width + offset;
  return Rect(left, top, source.width, source.height);
}

PopupBuilder.prototype.buildSafe = function (this: IPopupBuilder, safeArea: IRect) {
  // 构造弹出框的四个方向位置
  const top = this.buildTop();
  const bottom = this.buildBottom();
  const left = this.buildLeft();
  const right = this.buildRight();
  // 依次计算四个方向是否有足够的空间，优先级顺序为下上右左
  const order = [bottom, top, right, left];
  let pos = order.find(r => r.within(safeArea));
  if (!pos) pos = bottom.restrictWith(safeArea); // 找不到合适的位置，那就兜底一个位置
  return pos;
}
