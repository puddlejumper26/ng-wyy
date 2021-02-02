import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ChangeDetectorRef, ViewChild, AfterViewInit, Renderer2, Inject, Output, EventEmitter } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { select, Store } from '@ngrx/store';
import { Overlay, OverlayContainer, OverlayRef, OverlayKeyboardDispatcher, BlockScrollStrategy } from '@angular/cdk/overlay';
import { ESCAPE } from '@angular/cdk/keycodes';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { AppStoreModule } from './../../../../store/index';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { getMember, getModalVisible, getModalType } from './../../../../store/selectors/member.selector';
import { ModalTypes } from 'src/app/store/reducers/member.reducer';
import { WINDOW } from 'src/app/services/services.module';

@Component({
    selector: 'app-wy-layer-modal',
    templateUrl: './wy-layer-modal.component.html',
    styleUrls: ['./wy-layer-modal.component.less'],

    //   注意这里是 OnPush的策略， 考虑到因为是登录才需要，所以其他时候不需要对这里的检测
    changeDetection: ChangeDetectionStrategy.OnPush,

    // 动画特效的名字是 showHide
    animations: [trigger('showHide', [
        // scale是缩放的特效
        state('show', style({ transform: 'scale(1)', opacity: 1})),
        state('hide', style({ transform: 'scale(0)', opacity: 0})),
        transition('show <=> hide', animate('0.1s')),
    ])]
})

/**
 *      这里会有对ngrx member.selector, reducer and acitons 的监听，和player那里是一样的
 */
export class WyLayerModalComponent implements OnInit, AfterViewInit {
    private visible = false;
    currentModalType = ModalTypes.Default;
    private overlayRef: OverlayRef;
    showModal = 'hide';
    private scrollStrategy: BlockScrollStrategy;
    // 通过点击listen来得知其返回的类型 是  () => void
    private resizeHandler: () => void;
    // 查看这里得知其返回类型是HTMLElement https://material.angular.io/cdk/overlay/api#OverlayContainer
    private overlayContainerEl: HTMLElement;

    @ViewChild('modalContainer', { static: false }) private modalRef: ElementRef;

    @Output() onLoadMySheets = new EventEmitter<void>();

    constructor(
        // 注意这里的DOCUMENT和WINDOW是不同的，前者是ANGULAR自带的，后者不是，但是也是通过Angular中的方法new InjectionToken获得
        @Inject(DOCUMENT) private doc: Document,
        @Inject(WINDOW) private win: Window,
        private store$: Store<AppStoreModule>,
        private elementRef: ElementRef,
        private overlay: Overlay,
        private overlayKeyboardDispatcher: OverlayKeyboardDispatcher,
        private cdr: ChangeDetectorRef,
        private batchActionsServe: BatchActionsService,
        private rd: Renderer2,
        private overlayContainerServe: OverlayContainer
    ) {
        const appStore$ = this.store$.pipe(select(getMember));
        appStore$.pipe(select(getModalVisible)).subscribe((visible) => {
            //   console.log('【WyLayerModalComponent】- constructor - visible - ', visible)
            this.watchModalVisible(visible);
        });
        appStore$.pipe(select(getModalType)).subscribe((type) => {
            // console.log('【WyLayerModalComponent】- constructor - type - ', type)
            this.watchModalType(type);
        });
        // https://material.angular.io/cdk/overlay/api#BlockScrollStrategy
        this.scrollStrategy = this.overlay.scrollStrategies.block();
    }

    ngAfterViewInit() {
        this.overlayContainerEl = this.overlayContainerServe.getContainerElement();
        // console.log('【WyLayerModalComponent】- ngAfterViewInit - overlayContainerEl -', this.overlayContainerEl);
        // 这里就能拿到 <div class="cdk-overlay-container"> 是一个覆盖全窗口的layer
        this.listenResizeToCenter();
    }

    private listenResizeToCenter() {
        const modal = this.modalRef.nativeElement;
        const modalSize = this.getHideDomSize(modal);
        // console.log('【WyLayerModalComponent】 - ngAfterViewInit - modalSize - ', modalSize);
        //打印出来 {w:530, h:233}
        //那么这里就获得了 modal 和 modalSize 的值，可以用这些来对窗口进行居中
        this.keepCenter(modal, modalSize);

        /**
         *   监听 resize 事件
         */
        // 居中之后还需要监听一下，这样在弹窗出来之后，对窗体进行改变，那么弹窗的位置也会进行改变
        this.resizeHandler = this.rd.listen('window','resize', ()=>{this.keepCenter(modal, modalSize);})
    }

    ngOnInit() {
        // 这里给弹窗建立一个容器, 并且这个容器默认是隐藏的
        this.createOverlay();
    }

    // 这个方法是dom 的操作， 如果dom 操作很多的话，还是需要放入到一个utils文件中
    private getHideDomSize(dom: HTMLElement) {
        // console.log('【WyLayerModalComponent】 - getHideDomSize - dom -', dom);
        return {
            w: dom.offsetWidth,
            h: dom.offsetHeight
        }
    }

    private keepCenter(modal: HTMLElement, size: {w: number, h: number}) {
        // 用整个窗口的宽度减去弹窗的宽度，然后除以2
        const left =  (this.getWindowSize().w - size.w) / 2;
        const top = (this.getWindowSize().h - size.h) / 2;
        modal.style.left = left + 'px';
        modal.style.top = top + 'px';
    }

    private getWindowSize() {
        return {
            // 各种兼容的方法
            w: this.win.innerWidth || this.doc.documentElement.clientWidth || this.doc.body.offsetWidth,
            h: this.win.innerHeight || this.doc.documentElement.clientHeight || this.doc.body.offsetHeight
        }
    }

    // 用之前的 Angular Material CDK的方法来创建
    private createOverlay() {
        // 创建一个overlay的浮层
        this.overlayRef = this.overlay.create();
        this.overlayRef.overlayElement.appendChild(
            this.elementRef.nativeElement
        );
        // 如果键盘有按下，就发出一个observable
        this.overlayRef
            .keydownEvents()
            .subscribe((e) => this.keydownListener(e));
    }

    // 监听键盘按下的事件，用来在 按下 ESC 键也可以退出
    private keydownListener(evt: KeyboardEvent) {
        // console.log("【WyLayerModalComponent】- keydownListener - evt");
        if(evt.keyCode === ESCAPE) {
            this.hide();
        }
    }

    private watchModalVisible(visib: boolean) {
        if (this.visible !== visib) {
            this.visible = visib;
            this.handleVisibleChange(this.visible);
        }
    }

    private watchModalType(type: ModalTypes) {
        if (this.currentModalType !== type) {
            // 如果打开的是收藏的弹窗
            if(type === ModalTypes.Like) {
                // 这里就要发射一个自定义事件，请求当前用户自己建的歌单列表
                this.onLoadMySheets.emit();
                // 然后在 app.component.html中接受这个事件
            }
            this.currentModalType = type;
            this.cdr.markForCheck();
        }
    }

    private handleVisibleChange(visib: boolean) {
        // console.log('【WyLayerModalComponent】 - handleVisibleChange - visib -', visib);
        if (visib) {
            // 显示弹窗, 并且锁住滚动
            this.showModal = 'show';
            this.scrollStrategy.enable();
            // 在overlayRef上监听键盘事件 https://material.angular.io/cdk/overlay/api#OverlayKeyboardDispatcher
            this.overlayKeyboardDispatcher.add(this.overlayRef);
            // 显示的时候调用一下
            this.listenResizeToCenter();
            // 屏蔽掉点击， 这样在pop window 弹出的时候，在背景其他地方的点击就是无效的
            this.changePointerEvents('auto');
        } else {
            this.showModal = 'hide';
            this.scrollStrategy.disable();
            this.overlayKeyboardDispatcher.remove(this.overlayRef);
            // 需要解绑一下
            this.resizeHandler();
            // 解除屏蔽
            this.changePointerEvents('none');
        }

        // 因为这个component里是用 OnPush 策略，所以需要手动触发检测，要么就不用OnPush策略
        // 否则点击 主页 中的 用户登录（home.component.html > member-card.component.html），不会有窗口弹出
        this.cdr.markForCheck();
    }

    // 用来屏蔽事件，或者解除屏蔽
    private changePointerEvents(type: 'none' | 'auto') {
        if(this.overlayContainerEl) {
            this.overlayContainerEl.style.pointerEvents = type;
        }
    }

    hide() {
        this.batchActionsServe.controlModal(false);
    }
}
