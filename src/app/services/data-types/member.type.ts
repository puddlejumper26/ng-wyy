// 主要就是https://github.com/puddlejumper26/ng-wyy/issues/19 中 profile 中的字段
export type User = {
    profile: {
        userId: number;
        nickname: string;
        avatarUrl: string;
        backgroundUrl: string;
        // 个人简介
        signature: string;
        gender: number;
        // 粉丝
        followeds: number;
        // 关注
        follows: number;
        // 动态
        eventCount: number;
    }
}
