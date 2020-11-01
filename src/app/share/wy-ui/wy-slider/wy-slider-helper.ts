/**
 *     For all the tools applied in this app
 */

export function sliderEvent(e: Event){
    e.stopPropagation();   // 防止冒泡
    e.preventDefault();
}