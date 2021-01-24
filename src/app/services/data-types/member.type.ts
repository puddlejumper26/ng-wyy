// 主要就是https://github.com/puddlejumper26/ng-wyy/issues/19 中 profile 中的字段
export type User = {
    // 等级
    level?: number;
    // 听歌的数量
    listenSongs?: number;

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

// 定义一个简单返回
// 这样在 member.service中进行使用的时候就方便 res => res as sampleBack
export type sampleBack = {
    code: number;
    [key: string]: any;
}
