export interface IVec2 {
  x: number;
  y: number;
  (...args: (number | IVec2 | undefined)[]): IVec2;
  new (...args: (number | IVec2 | undefined)[]): IVec2;
  add(v: IVec2 | number): IVec2;
  sub(v: IVec2 | number): IVec2;
  mul(v: IVec2 | number): IVec2;
  scale(s: IVec2 | number): IVec2;
  div(v: IVec2 | number): IVec2;
  rotate(radian: number): IVec2;
  max(v: IVec2 | number): IVec2;
  min(v: IVec2 | number): IVec2;
  negate(): IVec2;
  abs(): IVec2;
  clone(): IVec2;
  len(): number;
  toArray(): [number, number];
  toString(): string;
  toTranslate(): string;
  // 以下是静态方法
  center(a: IVec2, b: IVec2): IVec2;
  distance(a: IVec2, b: IVec2): number;
  is(v: any): v is IVec2;
}

export const Vec2 = function (this: IVec2, ...args) {
  if (typeof this === 'undefined') return new Vec2(...args);
  if (args.length === 1) {
    if (typeof args[0] === 'number') {
      this.x = args[0] as number;
      this.y = args[0] as number;
    } else {
      this.x = (args[0] as IVec2).x;
      this.y = (args[0] as IVec2).y;
    }
  } else if (args.length === 2) {
    this.x = args[0] as number;
    this.y = args[1] as number;
  } else {
    this.x = 0;
    this.y = 0;
  }
} as IVec2;

Vec2.prototype.add = function (this: IVec2, v: IVec2 | number) {
  if (typeof v === 'number') return Vec2(this.x + v, this.y + v);
  return Vec2(this.x + v.x, this.y + v.y);
}

Vec2.prototype.sub = function (this: IVec2, v: IVec2 | number) {
  if (typeof v === 'number') return Vec2(this.x - v, this.y - v);
  return Vec2(this.x - v.x, this.y - v.y);
}

Vec2.prototype.scale = Vec2.prototype.mul = function (this: IVec2, v: IVec2 | number) {
  if (typeof v === 'number') return Vec2(this.x * v, this.y * v);
  return Vec2(this.x * v.x, this.y * v.y);
}

Vec2.prototype.div = function (this: IVec2, v: IVec2 | number) {
  if (typeof v === 'number') return Vec2(this.x / v, this.y / v);
  return Vec2(this.x / v.x, this.y / v.y);
}

Vec2.prototype.rotate = function (this: IVec2, radian: number) {
  const cos = Math.cos(radian);
  const sin = Math.sin(radian);
  return Vec2(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
}

Vec2.prototype.max = function (this: IVec2, v: IVec2 | number) {
  if (typeof v === 'number') return Vec2(Math.max(this.x, v), Math.max(this.y, v));
  return Vec2(Math.max(this.x, v.x), Math.max(this.y, v.y));
}

Vec2.prototype.min = function (this: IVec2, v: IVec2 | number) {
  if (typeof v === 'number') return Vec2(Math.min(this.x, v), Math.min(this.y, v));
  return Vec2(Math.min(this.x, v.x), Math.min(this.y, v.y));
}

Vec2.prototype.negate = function (this: IVec2) {
  return Vec2(-this.x, -this.y);
}

Vec2.prototype.abs = function (this: IVec2) {
  return Vec2(Math.abs(this.x), Math.abs(this.y));
}

Vec2.prototype.clone = function (this: IVec2) {
  return Vec2(this.x, this.y);
}

Vec2.prototype.len = function (this: IVec2) {
  return Math.sqrt(this.x * this.x + this.y * this.y);
}

Vec2.prototype.toArray = function (this: IVec2) {
  return [this.x, this.y];
}

Vec2.prototype.toString = function (this: IVec2) {
  return `(${this.x}, ${this.y})`;
}

Vec2.prototype.toTranslate = function (this: IVec2) {
  return `translate(${this.x}px, ${this.y}px)`;
}

Vec2.center = function (a: IVec2, b: IVec2) {
  return a.add(b).div(2);
}

Vec2.distance = function (a: IVec2, b: IVec2) {
  return a.sub(b).len();
}

Vec2.is = function (v: any): v is IVec2 {
  return v instanceof Vec2;
}
