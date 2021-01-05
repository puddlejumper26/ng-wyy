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
    alias: string[]; //别名
};

// 歌手详细信息
// https://github.com/puddlejumper26/ng-wyy/issues/15
export type SingerDetail = {
    artists: Singer,
    hotSongs: Song[];
}


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
    coverImgUrl: string; // 照顾到 sheet list 里的数据类型
    playCount: number;   // 推荐专辑的点击数量
    tracks: Song[];
    tags: string[];  //标签，Sheet Info component
    createTime: number; //时间戳 Sheet Info component
    creator: {nickname: string; avatarUrl: string} //Sheet Info component
    description: string; // Sheet Info component
    subscribedCount: number; // Sheet Info component 订阅数量
    shareCount: number; //Sheet Info component 分享数量
    commentCount: number; // Sheet Info component 评论数
    subscribed: boolean;  // Sheet Info component 当前用户是否订阅了这个歌单
    userId: number; // Sheet Info component 用户的id
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

// http://localhost:3000/top/playlist?limit=10&offset=1
// 歌单列表
export type SheetList = {
    playlists: SongSheet[];
    total: number;
}

export type SliderValue = number | null;

// https://github.com/puddlejumper26/ng-wyy/issues/16
// 所以这里的数据类型有点乱
type Album = {
    id?: number;
    name?: string;
    artist?: Singer;
}

type SearchSong = {
    id?: number;
    name: string;
    artists?: Singer[];
    album?: Album;
}

export type SearchResult = {
    albums?: Album[];
    searchSongs?: SearchSong[];
}
