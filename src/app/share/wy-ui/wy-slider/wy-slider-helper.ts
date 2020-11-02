/**
 *     For all the tools applied in this app
 */

// https://developer.mozilla.org/zh-CN/docs/Web/API/Event/preventDefault
export function sliderEvent(e: Event) {
    e.stopPropagation(); // 防止冒泡
    e.preventDefault(); //它可以阻止事件触发后默认动作的发生
}
