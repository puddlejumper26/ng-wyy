import { Directive, HostListener } from "@angular/core";

/**
 *       禁用图片的默认事件，也就是目前在浏览器里面可以随意把app中的图片拖拽都一个新的tab里并且打开
 *
 *          需要禁用掉这种事件的发生
 */

@Directive({
    selector: "[appImgDefault]",
})
export class ImgDefaultDirective {
    constructor() {}

    // 指令用到的数组的元素会监听哪些事件
    // $event 是传入的，注意 - 字符串格式
    // 后面 event 拿到前面传入的
    @HostListener('mousedown', ['$event']) onmousedown(event) {
        // 阻止默认事件
        event.preventDefault();
    }

}
