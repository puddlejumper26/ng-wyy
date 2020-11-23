import { Lyric } from './../../../../services/data-types/common.types';

// 第三位可能2位或者3位数字  [00:00.000]
const timeExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

// 定义一个借口
export interface BaseLyricLine {
    txt: string;    // 外文歌词
    txtCn: string;   // 中文歌词
}

interface LyricLine extends BaseLyricLine {
    time: number;   // 当前这一行对应的时间， 毫秒
}

// type LyricLine = {
//     txt: string;    // 外文歌词
//     txtCn: string;   // 中文歌词
//     time: number;   // 当前这一行对应的时间， 毫秒
// }

export class WyLyric {

    private lrc: Lyric;

    // 用来保存makeLine执行之后得到的新的数组
    // 并且要把每一行转换成一个对象，这个对象就是LyricLine类型
    lines: LyricLine[] = [];

    // 这里的lrc就是在wy-player-panel组件中的updateLyrics中的res
    constructor(lrc: Lyric){
        // console.log('WyLyric Constructor lrc ---', lrc.lyric === lrc.tlyric);
        this.lrc = lrc;
        this.init();
    }

    private init(){
        // 说明有外语歌词
        if(this.lrc.tlyric) {
            this.generTLyric();
            // 有的歌曲tlyric和lyric显示相同的中文歌词
            if(this.lrc.tlyric === this.lrc.lyric) {
                this.generLyric();
            }
        }else {
            this.generLyric();
        }
    }

    // 只有中文歌词的情况下
    private generLyric() {
        // 下面的log得到的是一个字符串，样式看下面这个链接
        // https://github.com/puddlejumper26/ng-wyy/issues/10#issuecomment-731837229
        // console.log('generLyric -- ', this.lrc.lyric);

        const generLyricLines = this.lrc.tlyric.split('\n'); //先用换行符分隔一下 并转成了数组
        // console.log('generLyric - generLyricLines ---', generLyricLines);

        // 单独处理这个数组里的每一项
        generLyricLines.forEach(line=> this.makeLine(line));
        // console.log('generLyric - lines', this.lines);

    }

    private generTLyric() {

    }

    private makeLine(line: string) {
        // 查询当前行是否有时间的内容
        const result = timeExp.exec(line);
        // console.log('makeLine - result --- ', result);

        if(result) {
            // 这里的匹配到的部分设为空，并且把多余的空格都去掉， 这样就把数字部分都去掉了，只剩下文字部分
            const txt = line.replace(timeExp, '').trim();
            const txtCn = '';
            if(txt) {
                //正则里面第三个括号的内容
                const thirdResult = result[3] || '00'; //做一下兼容 保证第三个是一个三位数
                const len = thirdResult.length;
                // 如果长度大于2， 那么直接转换，如果不大于2，就需要*10
                const _thirdResult = len > 2 ? parseInt(thirdResult) : parseInt(thirdResult)*10;

                // 这里是把[00:00.000] 的时间转换成总的毫秒数 以便后面的匹配
                const time = Number(result[1])*60*1000 + Number(result[2])*1000 + _thirdResult;

                this.lines.push({ txt, txtCn, time});
            }
        }

    }
}