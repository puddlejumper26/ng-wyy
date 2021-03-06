import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Component, Inject } from "@angular/core";
import { DOCUMENT } from '@angular/common';
import { filter, map, mergeMap, takeUntil } from 'rxjs/internal/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { interval, Observable } from 'rxjs';
import { select, Store } from "@ngrx/store";

import { AppStoreModule } from "./store";
import { BatchActionsService } from './store/batch-actions.service';
import { codeJson } from './utils/base64';
import { isEmptyObject } from "./utils/tools";
import { LoginParams } from './share/wy-ui/wy-layer/wy-layer-login/wy-layer-login.component';
import { LikeSongParams, MemberService, ShareParams } from './services/member.service';
import { ModalTypes, ShareInfo } from "./store/reducers/member.reducer";
import { SearchResult, SongSheet } from "./services/data-types/common.types";
import { SearchService } from './services/search.service';
import { SetModalType, SetModalVisible, SetUserId } from './store/actions/member.actions';
import { StorageService } from './services/storage.service';
import { User } from './services/data-types/member.type';
import { getLikeId, getMember, getModalType, getModalVisible, getShareInfo } from "./store/selectors/member.selector";
import { Title } from '@angular/platform-browser';

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.less"],
})
export class AppComponent {
    title = "ng-wyy";
    menu = [
        {
            label: "发现",
            path: "/home",
        },
        {
            label: "歌单",
            path: "/sheet",
        },
    ];

    searchResult: SearchResult;
    wyRememberLogin: LoginParams;
    user: User;
    mySheets: SongSheet[];
    shareInfo: ShareInfo;
    likeId: string; //被搜藏歌曲的id
    visible = false;
    currentModalType = ModalTypes.Default;
    showSpin = false; //弹窗loading
    routeTitle = '';
    loadPercent = 0;

    private navEnd: Observable<NavigationEnd>;

    constructor(
        private searchServe: SearchService,
        private store$: Store<AppStoreModule>,
        private bachActionsServe: BatchActionsService,
        private memberServe: MemberService,
        private nzMessageServe: NzMessageService,
        private storageServe: StorageService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private titleServe: Title,
        @Inject(DOCUMENT) private doc: Document,
        ) {
            // 添加一个自动登录的逻辑

            // const userId = localStorage.getItem('wyUserId');
            const userId = this.storageServe.getStorage('wyUserId');
            if(userId) {

                // 这里和下面的登录成功的时候一样，都需要提交一下，之后就可以在 home component中监听一下变化
                this.store$.dispatch(SetUserId({ id: userId}));

                // 如果能够拿到，说明已经登录过了，并且是可以自动登录的
                this.memberServe.getUserDetail(userId).subscribe( user => {
                    // console.log('【AppComponent】- constructor - user - ', user);
                    // 下面这里的赋值就可以直接自动登录了
                    this.user = user;
                })
            }

            // const wyRememberLogin = localStorage.getItem('wyRememberLogin');
            const wyRememberLogin = this.storageServe.getStorage('wyRememberLogin');
            if(wyRememberLogin) {
                this.wyRememberLogin = JSON.parse(wyRememberLogin);
            }

            this.listenStates();

            // 加上这一步，这样在所有的内部标签之间跳转的时候也需要加载进度条
            this.router.events.pipe(filter(evt => evt instanceof NavigationStart)).subscribe(() => {
                this.loadPercent = 0;
                this.setTitle();
            })

            // events 是路由的所有事件，会发射observable对象
            // navEnd就是路由事件
            this.navEnd = <Observable<NavigationEnd>>this.router.events.pipe(filter(evt => evt instanceof NavigationEnd));

            this.setLoadingBar();

            // this.setTitle();
        }

    private setLoadingBar() {
        // 用interval每100毫秒订阅一下
        //这里有两种取消订阅的方式， 可以把下面的 interval 赋给一个变量，然后在 this.navEnd中这个变量.unsubscribe()就好了
        // 另外一种方法更高级点

        interval(100).pipe(takeUntil(this.navEnd)).subscribe(() => {
            this.loadPercent = Math.max(this.loadPercent++, 95);
        })

        // 在NavigationEnd事件发生的时候，导航结束
        this.navEnd.subscribe(() => {
            this.loadPercent = 100;
            // 到达100之后，进度条就可以消失掉了，在app.component.html中用ngIf来控制

            // 在导航结束的时候，设置滚动条到最上面
            // this.doc.documentElement.scrollTop = 0;
        })



    }

    private setTitle() {
        this.navEnd.pipe(
            // 转成下面的这个类型
            map(() => this.activatedRoute),
            map((route: ActivatedRoute) => {
                while(route.firstChild) {
                    // 当路由的第一个元素存在的话
                    // 只取每一个路由中的子路由
                    route = route.firstChild;
                }
                return route;
            }),
            mergeMap(route => route.data)
        ).subscribe(data => {
            // console.log('【AppComponent】- setTitle - data -', data);
            this.routeTitle = data['title'];
            this.titleServe.setTitle(this.routeTitle);
        })
    }


    onSearch(keywords: string) {
        // console.log('【AppComponent】 - onSearch - keywords -', keywords);
        // 因为如果是空的话，会报错
        if(keywords) {
            this.searchServe.search(keywords)
                .subscribe( res => {
                    // console.log('【AppComponent】 - onSearch - res', res)
                    this.searchResult = this.highlightKeyWords(keywords, res);
                    // console.log('【AppComponent】 - onSearch - searchResult', this.searchResult)
                })
        }else {
            this.searchResult = {};
        }
    }

    private highlightKeyWords(keywords: string, result: SearchResult): SearchResult {
        if(!isEmptyObject(result)) {
            // 需要全局匹配 RegExp g 修饰符全局匹配, i 大小写不敏感
            const reg = new RegExp(keywords, 'ig');
            ['albums','songs', 'artists'].forEach(type => {
                // console.log('【AppComponent】- highlightKeyWords - type - ', type);
                if(result[type]){
                    result[type].forEach(item => {
                        // console.log('【AppComponent】- highlightKeyWords - item - ', item);
                        // 这里使用 $& 是能够直接显示keywords， 注意和 wy-search-panel.component.html中的 [innerHTML]的关系
                        // $& https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
                        // str.replace(regexp|substr, newSubStr|function)
                        item.name = item.name.replace(reg, '<span class="highlight">$&</span>')
                    })
                }
            })
        }
        return result;
    }

    // 改变弹窗类型, 下面的方法可以改变modalType，
    // 一旦改变之后，在wy-layer-modal.component.ts中的watchModalType就能够监听到modalType的改变，
    // 并将改变的值传递给currentModalType，这个值就可以传递给wy-layer-modal.componenthtml中的ng-container
    // 从而进行不同的组件的显示转换
    onChangeModalType(modalType = ModalTypes.Default) {
        this.store$.dispatch(SetModalType({ modalType }));
    }

    // 打开不同的弹窗, 这里可以引入BatchActionsService里面封装好的controlModal
    openModal(type: ModalTypes) {
        // console.log('【AppComponent】 - openModal - type - ', type);
        this.bachActionsServe.controlModal(true, type);
    }

    // 登录的方法
    onLogin(params: LoginParams) {
        // 先要显示 loading的效果
        this.showSpin = true;

        // 这里就可以获得 wy-layer-login 中输入的信息
        // console.log('【AppComponent】- onLogin - params - ', params);
        this.memberServe.login(params).subscribe(user => {
            // console.log('【AppComponent】- onLogin - user - ', user);
            this.user = user;
            // 登录成功，需要隐藏窗口
            this.bachActionsServe.controlModal(false);
            // 弹出窗口显示信息
            this.alertMessage('success', '登录成功');
            // 登录成功将数据存储在当地
            // localStorage.setItem('wyUserId', user.profile.userId.toString());
            this.storageServe.setStorage({
                key:'wyUserId',
                value: user.profile.userId.toString()
            });
            // 登录成功之后 这里要提交一下 , 还有在刷新页面的时候，constructor中也要提交一下
            this.store$.dispatch(SetUserId({ id: user.profile.userId.toString()}));


            // 如果用户勾选了记住密码 把密码也放到 浏览器的缓存里
            if(params.remember) {
                // 这里使用codeJson来对数据加密
                // localStorage.setItem('wyRememberLogin', JSON.stringify(codeJson(params)));
                this.storageServe.setStorage({
                    key: 'wyRememberLogin',
                    value: JSON.stringify(codeJson(params))
                });
            }else {
                // localStorage.removeItem('wyRememberLogin');
                this.storageServe.removeStorage('wyRememberLogin');
            }
            this.showSpin = false; // 关闭loading效果
        }, error => {
            this.showSpin = false; // 关闭loading效果
            this.alertMessage('error', error.message ||'登录失败');
        })
    }

    private alertMessage(type: string, msg: string) {
        this.nzMessageServe.create(type, msg)
    }

    // 退出登录状态
    onLogout() {
        // console.log('【Appcomponent】- onLogout');
        this.memberServe.logout().subscribe( res => {
            // console.log('【Appcomponent】- onLogout - res - ', res);
            // 返回的 是 code: 200
            this.user = null;
            // localStorage.removeItem('wyUserId');
            this.storageServe.removeStorage('wyUserId');
            // store里的信息也要为空
            this.store$.dispatch(SetUserId({id: ''}));
            this.alertMessage('success', '退出成功');
        }, error => {
            this.alertMessage('error', error.message ||'退出失败');
        });
    }

    // 获取当前用户的歌单 和在 用户中心中的操作一样
    onLoadMySheets() {
        // 首先判断 user 是否存在， 也就是用户是否登录
        if(this.user) {
            // 登录的情况下，请求歌单列表
            this.memberServe.getUserSheets(this.user.profile.userId.toString()).subscribe(userSheet => {
                // console.log('【AppComponent】 - onLoadMySheets - userSheet - ', userSheet);
                this.mySheets = userSheet.self;
                // 这个值拿到之后要传到 app-wy-layer-like 组件里去
                // 有了值之后就可以用 store$, 因为之前只是改变了弹窗类型，现在可以打开弹窗（batch-action.service 中的 likeSong）
                this.store$.dispatch(SetModalVisible({ modalVisible: true }))
            })
        } else{
            // 打开默认弹窗
            this.openModal(ModalTypes.Default);
        }
    }

    // 用的方法和 wy-player 中是一样的
    private listenStates() {
        const appStore$ = this.store$.pipe(select(getMember));
        appStore$.pipe(select(getLikeId)).subscribe(id => this.watchLikeId(id));
        appStore$.pipe(select(getModalVisible)).subscribe(visib => this.watchModalVisible(visib));
        appStore$.pipe(select(getModalType)).subscribe(type => this.watchModalType(type));
        appStore$.pipe(select(getShareInfo)).subscribe(info => this.watchShareInfo(info));
        // const stateArr = [{
        //     type: getLikeId,
        //     cb: id => this.watchLikeId(id)
        // }, {
        //     type: getModalVisible,
        //     cb: visib => this.watchModalVisible(visib)
        // }, {
        //     type: getModalType,
        //     cb: type => this.watchModalType(type)
        // }];

        // stateArr.forEach(item => {
        //     appStore$.pipe(select(item.type)).subscribe(item.cb);
        // })
    }

    private watchLikeId(id: string) {
        if(id) {
            this.likeId = id;

        }
    }

    private watchModalVisible(visib: boolean) {
        if (this.visible !== visib) {
            this.visible = visib;
        }
    }

    private watchModalType(type: ModalTypes) {
        if (this.currentModalType !== type) {
            // 如果打开的是收藏的弹窗
            if(type === ModalTypes.Like) {
                // 这里就要发射一个自定义事件，请求当前用户自己建的歌单列表
                this.onLoadMySheets();
                // 然后在 app.component.html中接受这个事件
            }
            this.currentModalType = type;
            // 这里因为不是OnPush策略，所不需要这个
            // this.cdr.markForCheck();
        }
    }

    private watchShareInfo(info: ShareInfo) {
        //这样这里就能够从sheet-info的 store$的数据中拿取那里dispatch的数据了
        // console.log('【AppComponent】- watchShareInfo - info -', info);
        if(info){
            // 这样在未登录的状态下，打开的就是default弹窗
            if(this.user) {
                this.shareInfo = info;
                //打开窗口
                this.openModal(ModalTypes.Share);
            }else {
                this.openModal(ModalTypes.Default);
            }
        }
    }

    // 收藏歌曲
    onLikeSong(args: LikeSongParams) {
        // 这时候点击收藏，并且点击选择的歌单，就能够打印出来下面的两个参数
        // console.log('【AppComponent】- onLikeSong - args -', args);
        this.memberServe.likeSong(args).subscribe(code => {
            // 调用成功就关掉
            this.bachActionsServe.controlModal(false);
            this.alertMessage('success', '收藏成功');
        }, error => {
            this.alertMessage('error', error.msg ||'收藏失败');
        })
    }

    //分享
    onShare(arg: ShareParams) {
        this.memberServe.shareResource(arg).subscribe(() => {
            this.alertMessage('success', '收藏成功');
            this.closeModal();
        }, error => {
            this.alertMessage('error', error.msg ||'收藏失败');
        })
    }

    // 新建歌单
    onCreateSheet(sheetName: string) {
        console.log('【AppComponent】- onCreateSheet - sheetName -', sheetName);
        this.memberServe.createSheet(sheetName).subscribe(pid => {
            this.onLikeSong({ pid, tracks: this.likeId})
        }, error => {
            this.alertMessage('error', error.msg ||'新建失败');
        })
    }

    // 调用注册的信息
    onRegister(phone: string) {
        this.alertMessage('success', phone + '注册成功！');
    }

    // 关闭弹窗
    closeModal() {
        this.bachActionsServe.controlModal(false);
    }
}
