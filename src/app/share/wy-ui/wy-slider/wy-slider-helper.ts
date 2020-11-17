/**
 *     For all the tools applied in this app
 */

// https://developer.mozilla.org/zh-CN/docs/Web/API/Event/preventDefault
// https://juejin.im/post/6844903722204528647 我们只点击了最里面的那个div，但是在他的父级及以上div身上所绑定的事件都被触发了
/**
 * js冒泡和捕获是事件的两种行为，
 * 使用event.stopPropagation()起到阻止捕获和冒泡阶段中当前事件的进一步传播。
 * 使用event.preventDefault()可以取消默认事件。   https://www.jianshu.com/p/d6e89a60dd75
 *  preventDefault它是事件对象(Event)的一个方法，作用是取消一个目标元素的默认行为 比如<a>的默认行为就是超链接
 */
export function sliderEvent(e: Event) {
    e.stopPropagation(); // 防止冒泡
    e.preventDefault(); //它可以阻止事件触发后默认动作的发生
}

export function getElementOffset(el: HTMLElement): {top: number; left: number;} {
    // getClientRects返回一个数组, 指向客户端中每一个盒子的边界矩形的矩形集合。
    // 数组里的每一项都是 el.getBoundingClientRect()
    // 这里判断如果不存在的话, 也就是dom是有问题的
    if (!el.getClientRects().length) {
        return {
            top: 0,
            left: 0,
        };
    }

    //拿到dom 的矩形的位置 getBoundingClientRect返回元素的大小及其相对于视口的位置
    /**
     * 如果是标准盒子模型，元素的尺寸等于width/height + padding + border-width的总和。
     * 如果box-sizing: border-box，元素的的尺寸等于 width/height。
     */
    const rect = el.getBoundingClientRect();

    // 取了所在元素 的  dom 的节点, 返回的就是所在的document的对象，回当前节点的顶层的 document 对象。
    // defaultView 就是返回document所在的window的对象,返回当前 document 对象所关联的 window 对象，如果没有，会返回 null。IE 9 以下版本不支持 defaultView。
    const win = el.ownerDocument.defaultView;

    /**
     *  window.pageXOffset == window.scrollX; // 总是 true 为该文档从左侧开始滚动的像素值。
     *  为了跨浏览器兼容性，请使用 window.pageXOffset 代替 window.scrollX。
     */
    return {
        // top: rect.top + window.pageYOffset,   // could use the method above to obtain the value of window
        // left: rect.left + window.pageYOffset,
        top: rect.top + win.pageYOffset,
        left: rect.left + win.pageXOffset,

        // 这里我们如果不确定是否有浏览器能够支持 win.pageYOffset,
        // 可以使用可以用于断言操作对象是非 null 和非undefined 类型。具体而言，x! 将从 x 值域中排除 null 和 undefined
        // e.g. win!.pageYOffset
    };
}
