import { Rect } from './rect';
import { Vec2 } from './vec2';

export function elCenterToVec2(el: Element) {
  const rect = el.getBoundingClientRect();
  return Rect(rect).getCenter();
}

export function clientToVec2(ev: { clientX: number; clientY: number }) {
  return Vec2(ev.clientX, ev.clientY);
}

export function offsetToVec2(ev: { offsetX: number; offsetY: number }) {
  return Vec2(ev.offsetX, ev.offsetY);
}

export function sizeToVec2(ev: { width: number; height: number }) {
  return Vec2(ev.width, ev.height);
}

export function offsetSizeToVec2(ev: { offsetWidth: number; offsetHeight: number }) {
  return Vec2(ev.offsetWidth, ev.offsetHeight);
}

export function clientSizeToVec2(ev: { clientWidth: number; clientHeight: number }) {
  return Vec2(ev.clientWidth, ev.clientHeight);
}
