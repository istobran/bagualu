import { IVec2, Vec2 } from './vec2';

type PureRect = { left: number, top: number, width: number, height: number };
type TopLeftAndSize = { topLeft: IVec2, size: IVec2 };

export interface IRect {
  left: number;
  top: number;
  width: number;
  height: number;
  (...args: (number | Partial<PureRect> | Partial<TopLeftAndSize> | IVec2 | IRect)[]): IRect;
  new (...args: (number | Partial<PureRect> | Partial<TopLeftAndSize> | IVec2 | IRect)[]): IRect;
  setTopLeft(v: IVec2): IRect;
  setSize(v: IVec2): IRect;
  within(r: IRect): boolean;
  restrictWith(r: IRect): IRect;
  toTranslate(): string;
  toStyle(): { width: string, height: string, transform: string };
  // 静态方法
  getCenter(): IVec2;
}

export const Rect = function (this: IRect, ...args) {
  if (typeof this === 'undefined') {
    return new Rect(...args);
  }
  if (args.length === 1) {
    if (args[0] instanceof Vec2) { // 只有一个参数的时候，Vec2 转成宽高
      this.setTopLeft(Vec2())
        .setSize(args[0] as IVec2);
    } else if (args[0] instanceof Rect) {
      const { left, top, width, height } = args[0] as Partial<PureRect>;
      this.setTopLeft(Vec2(left, top))
        .setSize(Vec2(width, height));
    } else if (args[0] && typeof args[0] === 'object') {
      const { left, top, width, height, topLeft, size } = args[0] as Partial<PureRect> & Partial<TopLeftAndSize>;
      if (topLeft instanceof Vec2 || size instanceof Vec2) {
        this.setTopLeft(topLeft || Vec2())
          .setSize(size || Vec2());
      } else if ([left, top, width, height].some(v => typeof v === 'number')) {
        this.setTopLeft(Vec2(left || 0, top || 0))
          .setSize(Vec2(width || 0, height || 0));
      } else {
        throw new Error('Invalid rect arguments');
      }
    } else {
      throw new Error('Invalid rect arguments');
    }
  } else if (args.length === 2) {
    if (typeof args[0] === 'number') {
      const [left, top] = args as number[];
      this.setTopLeft(Vec2(left, top))
        .setSize(Vec2());
    } else if (args[0] instanceof Vec2) {
      let [topLeft, size] = args as IVec2[];
      this.setTopLeft(topLeft)
        .setSize(size as (IVec2 | undefined) || Vec2());
    }
  } else if (args.length === 4) {
    const [left, top, width, height] = args as number[];
    this.setTopLeft(Vec2(left, top))
      .setSize(Vec2(width || 0, height || 0));
  } else {
    this.setTopLeft(Vec2()).setSize(Vec2());
  }
} as IRect;

Rect.prototype.setTopLeft = function (this: IRect, v: IVec2) {
  this.left = v.x;
  this.top = v.y;
  return this;
}

Rect.prototype.setSize = function (this: IRect, v: IVec2) {
  this.width = Math.abs(v.x);
  this.height = Math.abs(v.y);
  return this;
}

Rect.prototype.within = function (this: IRect, r: IRect) {
  return this.left >= r.left && this.left + this.width <= r.left + r.width
    && this.top >= r.top && this.top + this.height <= r.top + r.height;
}

Rect.prototype.restrictWith = function (this: IRect, r: IRect) {
  const left = Math.min(Math.max(this.left, r.left), r.left + r.width - this.width);
  const top = Math.min(Math.max(this.top, r.top), r.top + r.height - this.height);
  return Rect(left, top, this.width, this.height);
}

Rect.prototype.getCenter = function (this: IRect) {
  const boxCenter = Vec2(this.width, this.height).div(2);
  return Vec2(this.left, this.top).add(boxCenter);
}

Rect.prototype.toTranslate = function (this: IRect) {
  return `translate(${this.left}px, ${this.top}px)`;
}

Rect.prototype.toStyle = function (this: IRect) {
  return {
    width: `${this.width}px`,
    height: `${this.height}px`,
    transform: this.toTranslate(),
  };
}
