// localhost:3000/banner will provide with all attributes, we just take what we need
// to decide the data type of Banner
// {"banners":[{"imageUrl":"http://p1.music.126.net/j01hMeoQ_XOh9_h-9_Uf2Q==/109951165419695791.jpg","targetId":5305573963,"adid":null,"targetType":1000,"titleColor":"red","typeTitle":"歌单推荐","url":null,"exclusive":false,"monitorImpress":null,"monitorClick":null,"monitorType":null,"monitorImpressList":null,"monitorClickList":null,"monitorBlackList":null,"extMonitor":null,"extMonitorInfo":null,"adSource":null,"adLocation":null,"adDispatchJson":null,"encodeId":"5305573963","program":null,"event":null,"video":null,"song":null,"scm":"1.music-homepage.homepage_banner_force.banner.1156307.-1115704945.null"},

// 轮播图的大图
// localhost:3000/banner
export type Banner = {
    imageUrl: string;
    targetId: number;
    url: string;
};

// 下面的5个热门标签
// localhost:3000/playlist/hot
export type HotTag = {
    id: number;  // 这个似乎没有用上
    name: string;
    position: number;
};

// 右边的9个歌手
// localhost:3000/artist/list + params <offset,limit,cat>
export type Singer = {
    albumSize: number;
    id: number;
    name: string;
    picUrl: string;
};


// localhost:3000/playlist/detail + id <专辑id>
// data type of each song 每一首歌的信息，需要整合两个API的信息
export type Song = {
    al: { id: number; name: string; picUrl: string }; // information about the album <album> 这里的id 是 歌曲所在专辑的id，专辑的名字，专辑的封面
    ar: Singer[]; //the informaton of singer <artist>
    dt: number; // play time
    id: number;   // 这里是 歌曲自身的id
    name: string;  // 歌曲的名字
    url: string;   // 歌曲的播放地址
};

// 16张推荐专辑的信息
// localhost:3000/personalized
// 歌单数据类型 就是推荐专辑名称
export type SongSheet = {
    id: number;           // 这里是推荐专辑的id
    name: string;        // 推荐专辑的名字， 但是不是专辑的名字
    picUrl: string;      // 推荐专辑的封面
    playCount: number;   // 推荐专辑的点击数量
    tracks: Song[];
};


// localhost:3000/song/url + id <歌曲id>
// Song Url 播放地址
export type SongUrl = {
    id: number;      // 这里是歌曲的id
    url: string;
};

// localhost:3000/lyric + id <歌曲id>
// 歌词类型
export type Lyric = {
    lyric: string;
    tlyric: string;
}


export type SliderValue = number | null;