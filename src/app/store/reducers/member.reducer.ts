import { Action, createReducer, on } from '@ngrx/store';

import { SetLikeId, SetModalType, SetModalVisible, SetUserId, SetShareInfo } from './../actions/member.actions';

// 弹窗的类型
export enum ModalTypes {
    Register = 'register',
    LoginByPhone = 'loginByPhone',
    Share = 'share',
    Like = 'like',
    Default = 'default'
}

export type ShareInfo = {
    id: string;
    type: string;
    txt: string;
}

// 定义状态
export type MemberState = {
    // 弹窗显示还是隐藏
    modalVisible: boolean;
    modalType: ModalTypes;
    userId: string;
    likeId: string;
    shareInfo?: ShareInfo;
}

// 定义初始的状态
export const initialState: MemberState = {
    // 因为一开始是隐藏的，所以是false
    modalVisible: false,
    modalType: ModalTypes.Default,
    userId: '',
    likeId: '',
}

// 设置动作
const reducer = createReducer(
    initialState,
    on(SetModalVisible, (state, {modalVisible}) => ({ ...state, modalVisible})),
    on(SetModalType, (state, {modalType}) => ({ ...state, modalType})),
    on(SetUserId, (state, {id}) => ({...state, userId:id})),
    on(SetLikeId, (state, {id}) => ({...state, likeId:id})),
    on(SetShareInfo, (state, {info}) => ({...state, shareInfo: info})),
)

//https://next.ngrx.io/guide/store/

/**
 *
 *               用来执行 member.action.ts 中定义的动作
 *
 */


// 注册到AppStoreModule中需要下面的这个
// StoreModule.forRoot({ member: membererReducer}
export function memberReducer(state: MemberState, action: Action){
    return  reducer(state, action);
}

