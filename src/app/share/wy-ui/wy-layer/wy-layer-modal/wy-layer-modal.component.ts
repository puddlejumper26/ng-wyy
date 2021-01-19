import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ChangeDetectorRef } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Overlay, OverlayRef, OverlayKeyboardDispatcher, BlockScrollStrategy } from '@angular/cdk/overlay';
import { ESCAPE } from '@angular/cdk/keycodes';

import { AppStoreModule } from './../../../../store/index';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { getMember, getModalVisible, getModalType } from './../../../../store/selectors/member.selector';
import { ModalTypes } from 'src/app/store/reducers/member.reducer';

@Component({
    selector: 'app-wy-layer-modal',
    templateUrl: './wy-layer-modal.component.html',
    styleUrls: ['./wy-layer-modal.component.less'],

    //   注意这里是 OnPush的策略， 考虑到因为是登录才需要，所以其他时候不需要对这里的检测
    changeDetection: ChangeDetectionStrategy.OnPush
})

/**
 *      这里会有对ngrx member.selector, reducer and acitons 的监听，和player那里是一样的
 */
export class WyLayerModalComponent implements OnInit {
    private visible = false;
    private currentModalType = ModalTypes.Default;
    private overlayRef: OverlayRef;
    showModal = false;
    private scrollStrategy: BlockScrollStrategy;

    constructor(
        private store$: Store<AppStoreModule>,
        private elementRef: ElementRef,
        private overlay: Overlay,
        private overlayKeyboardDispatcher: OverlayKeyboardDispatcher,
        private cdr: ChangeDetectorRef,
        private batchActionsServe: BatchActionsService
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

    ngOnInit() {
        // 这里给弹窗建立一个容器, 并且这个容器默认是隐藏的
        this.createOverlay();
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
            this.currentModalType = type;
        }
    }

    private handleVisibleChange(visib: boolean) {
        // console.log('【WyLayerModalComponent】 - handleVisibleChange - visib -', visib);
        this.showModal = visib;
        if (visib) {
            // 显示弹窗, 并且锁住滚动
            this.scrollStrategy.enable();
            // 在overlayRef上监听键盘事件 https://material.angular.io/cdk/overlay/api#OverlayKeyboardDispatcher
            this.overlayKeyboardDispatcher.add(this.overlayRef);
        } else {
            this.scrollStrategy.disable();
            this.overlayKeyboardDispatcher.remove(this.overlayRef);
        }

        // 因为这个component里是用 OnPush 策略，所以需要手动触发检测，要么就不用OnPush策略
        // 否则点击 主页 中的 用户登录（home.component.html > member-card.component.html），不会有窗口弹出
        this.cdr.markForCheck();
    }

    hide() {
        this.batchActionsServe.controlModal(false);
    }
}
