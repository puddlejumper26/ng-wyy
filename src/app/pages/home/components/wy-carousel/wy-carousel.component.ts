import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    TemplateRef,
    ViewChild,
} from "@angular/core";

@Component({
    selector: "app-wy-carousel",
    templateUrl: "./wy-carousel.component.html",
    styleUrls: ["./wy-carousel.component.less"],

    // Angular 变更检测的原理是一个组件发生改变，会把这个组件所有关联的组件都进行检测一遍，
    // 检测是否有变化， 因为Angular是一个 组件树 构成的项目
    // OnPush 是当 下面的 @Input 的属性发生变化之后才会 引发检测， 有利于提升性能
    //  所以一般比较简单的组件一般用 OnPush
    //  如果能够准确理解每一个组件，尽可能使用 OnPush 可以很好提升性能
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WyCarouselComponent implements OnInit {
    //  Static 意味着在变化发生之前应该进行检测，true意味着模板是静态的，false意味着模板不是静态的，比如ngIf
    // here we need static, cause Angular 8 would calculate the time for template searching, static means
    // the check should happen before or after the changes, true means the template is static,
    // false means the tempalte is not static, e.g. decorated with *ngIf,
    //         <ng-template #dot *ngIf="something">
    //             <i class="dot"></i>
    //         </ng-template>
    // now static should be false, means to ask to check and calculate after template finished changing
    @ViewChild("dot", { static: true }) dotRef: TemplateRef<any>;

    @Input() activeIndex = 0;
    @Output() changeSlide = new EventEmitter<"pre" | "next">();

    constructor() {}

    ngOnInit() {}

    // https://ng.ant.design/components/carousel/zh 方法中有 next（）和pre（），所以这里直接定义类型只能是这两个
    // 减少出错
    // 发射到 home component， 控制图片前后
    onChangeSlide(type: "pre" | "next") {
        this.changeSlide.emit(type);
    }
}
