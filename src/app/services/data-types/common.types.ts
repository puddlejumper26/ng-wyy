// localhost:3000/banner will provide with all attributes, we just take what we need
// to decide the data type of Banner
// {"banners":[{"imageUrl":"http://p1.music.126.net/j01hMeoQ_XOh9_h-9_Uf2Q==/109951165419695791.jpg","targetId":5305573963,"adid":null,"targetType":1000,"titleColor":"red","typeTitle":"歌单推荐","url":null,"exclusive":false,"monitorImpress":null,"monitorClick":null,"monitorType":null,"monitorImpressList":null,"monitorClickList":null,"monitorBlackList":null,"extMonitor":null,"extMonitorInfo":null,"adSource":null,"adLocation":null,"adDispatchJson":null,"encodeId":"5305573963","program":null,"event":null,"video":null,"song":null,"scm":"1.music-homepage.homepage_banner_force.banner.1156307.-1115704945.null"},
export type Banner = {
    imageUrl: string;
    targetId: number;
    url: string;
};

export type HotTag = {
    id: number;  // 这个似乎没有用上
    name: string;
    position: number;
};

export type Singer = {
    albumSize: number;
    id: number;
    name: string;
    picUrl: string;
};

// data type of each song
export type Song = {
    al: { id: number; name: string; picUrl: string }; // information about the album
    ar: Singer[]; //the informaton of singer
    dt: number; // play time
    id: number;
    name: string;
    url: string;
};

// 歌单数据类型
export type SongSheet = {
    id: number;
    name: string;
    picUrl: string;
    playCount: number;
    tracks: Song[];
};

// Song Url 播放地址
export type SongUrl = {
    id: number;
    url: string;
};

export type SliderValue = number | null;