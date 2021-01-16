import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, EventEmitter, Inject, Input, OnChanges, Output, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
    selector: "[appClickoutside]",
})
export class ClickoutsideDirective implements OnChanges{
    // 这里的()=>void可以到Renderer2的文档中找到 listen的返回就是 ()=>void 类型，所以这里用这个类型
    private handleClick: ()=>void;

    // 如果bindFlag是true的时候就绑定click事件，如果false就解绑
    @Input() bindFlag = false;
    // 不需要参数，只需要能够是点击到外部就可以了, 在wy-player.component.html中接受这个参数
    @Output() onClickOutSide = new EventEmitter<void>();

    // Renderer2 是 Angular 用来操纵 dom 的
    constructor(private el: ElementRef, private rd: Renderer2, @Inject(DOCUMENT) private doc: Document) {
        // console.log("ClickoutsideDirective -- el.nativeElement", this.el.nativeElement);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if(changes['bindFlag'] && !changes['bindFlag'].firstChange) {
            if(this.bindFlag) {
               // 在全局的doc上绑定一个click事件
                this.handleClick = this.rd.listen(this.doc, 'click', evt=>{
                    const target = evt.target;
                    // 当前点击的对象是否包含在el中
                    const isContain = this.el.nativeElement.contains(target);
                    // console.log('ClickoutsideDirective - isContain', isContain);  //点击播放器以外都返回 false
                    if(!isContain){
                        this.onClickOutSide.emit(target);
                    }
                });
            }else { //这里解绑一下 传入空的对象
                this.handleClick();
            }
        }
    }
}
