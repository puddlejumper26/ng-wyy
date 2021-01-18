import { Action, createReducer, on } from '@ngrx/store';

import { SetModalType, SetModalVisible } from './../actions/member.actions';

// 弹窗的类型
export enum ModalTypes {
    Register = 'register',
    LoginByPhone = 'loginByPhone',
    Share = 'share',
    Like = 'like',
    Default = 'default'
}

// 定义状态
export type MemberState = {
    // 弹窗显示还是隐藏
    modalVisible: boolean;
    modalType: ModalTypes;
}

// 定义初始的状态
export const initialState: MemberState = {
    // 因为一开始是隐藏的，所以是false
    modalVisible: false,
    modalType: ModalTypes.Default
}

// 设置动作
const reducer = createReducer(
    initialState,
    on(SetModalVisible, (state, {modalVisible}) => ({ ...state, modalVisible})),
    on(SetModalType, (state, {modalType}) => ({ ...state, modalType})),
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

