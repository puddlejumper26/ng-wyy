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

// 注意这里是 interface
export interface AnyJson {
    [key: string]: any;
}

// 定义一个简单返回
// 这样在 member.service中进行使用的时候就方便 res => res as sampleBack
// export type sampleBack = {
//     code: number;
//     [key: string]: any;
// }

// 注意这里简化成了 interface 注意需要首字母大写
export interface SampleBack extends AnyJson{
    code: number;
}
