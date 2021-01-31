import { createFeatureSelector, createSelector } from '@ngrx/store';

import { MemberState } from '../reducers/member.reducer';

// 首先要拿到 state 里的所有的数据
const selectMemberStates = (state: MemberState) => state;

// 使用这个方法来拿到 'member' 是因为@ngrx/store-devtool@8.6.0
//  注意 这里的 'member' 要和 index.ts 中的 StoreModule.forRoot({ member: memberReducer} 中的参数保持一致
export const getMember = createFeatureSelector<MemberState>('member');

// 第二个参数是一个函数
export const getModalVisible = createSelector(selectMemberStates, (state: MemberState) => state.modalVisible);
export const getModalType = createSelector(selectMemberStates, (state: MemberState) => state.modalType);
// 这里设定好了，就需要到 app.component.ts中提交一下
export const getUserId = createSelector(selectMemberStates, (state: MemberState) => state.userId);

