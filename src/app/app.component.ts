import { NzMessageService } from 'ng-zorro-antd/message';
import { SetModalType } from './store/actions/member.actions';
import { Component } from "@angular/core";
import { Store } from "@ngrx/store";

import { isEmptyObject } from "./utils/tools";
import { SearchResult } from "./services/data-types/common.types";
import { SearchService } from './services/search.service';
import { ModalTypes } from "./store/reducers/member.reducer";
import { AppStoreModule } from "./store";
import { BatchActionsService } from './store/batch-actions.service';
import { LoginParams } from './share/wy-ui/wy-layer/wy-layer-login/wy-layer-login.component';
import { MemberService } from './services/member.service';
import { User } from './services/data-types/member.type';

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

    user: User;

    constructor(
        private searchServe: SearchService,
        private store$: Store<AppStoreModule>,
        private bachActionsServe: BatchActionsService,
        private memberServe: MemberService,
        private nzMessageServe: NzMessageService
        ) {
            // 添加一个自动登录的逻辑

            const userId = localStorage.getItem('wyUserId');
            if(userId) {
                // 如果能够拿到，说明已经登录过了，并且是可以自动登录的
                this.memberServe.getUserDetail(userId).subscribe( user => {
                    // console.log('【AppComponent】- constructor - user - ', user);
                    // 下面这里的赋值就可以直接自动登录了
                    this.user = user;
                })
            }
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
        this.bachActionsServe.controlModal(true, type);
    }

    // 登录的方法
    onLogin(params: LoginParams) {
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
            localStorage.setItem('wyUserId', user.profile.userId.toString());

            // 如果用户勾选了记住密码 把密码也放到 浏览器的缓存里
            if(params.remember) {
                localStorage.setItem('wyRememberLogin', JSON.stringify(params));
            }else {
                localStorage.removeItem('wyRememberLogin');
            }
        }, error => {
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
            localStorage.removeItem('wyUserId');
            this.alertMessage('success', '退出成功');
        }, error => {
            this.alertMessage('error', error.message ||'退出失败');
        });
    }
}
