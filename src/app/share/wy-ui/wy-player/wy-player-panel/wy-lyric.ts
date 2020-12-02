import { from } from 'rxjs/internal/observable/from';
import { zip } from 'rxjs/internal/observable/zip';
import { skip } from 'rxjs/internal/operators';
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
        // console.log('WyLyric Constructor lrc ---', lrc.tlyric);
        this.lrc = lrc;
        this.init();
    }

    private init(){

        // tlyric 和 lyric的定义比较模糊，
        // lyric: 中文，外文， 中文外文一起
        // tlyric：中文，外文， 但是可能会多一些不需要的内容 e.g. [by:羽新也]↵[00:00.000]雷声↵
        // 就需要把前面的[by:羽新也]去掉，所以从 tlyric开始

        // 一般说来，如果同时存在的话， tlyric 是 中文， lyric 是外文

        // 说明有两种歌词
        if(this.lrc.tlyric) {
            this.generTLyric();
            // 有的歌曲tlyric和lyric显示相同的中文或者外文的歌词
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

        const generLyricLines = this.lrc.lyric.split('\n'); //先用换行符分隔一下 并转成了数组
        // console.log('generLyric - generLyricLines ---', generLyricLines);

        // 单独处理这个数组里的每一项
        generLyricLines.forEach(line=> this.makeLine(line));
        // console.log('generLyric - lines', this.lines);

    }

    private generTLyric() {
        // 一样先分行
        const lines = this.lrc.lyric.split('\n');
        // 只需要匹配到时间的部分， 把前面的e.g. [by:羽新也] 去除掉
        const tlines = this.lrc.tlyric.split('\n').filter(item => timeExp.exec(item) !== null);
        // console.log('generTLyric - lines --->', lines);
        // console.log('generTLyric - tlines --->', tlines);

        // 经过上面这一步之后，一般来说 tline的长度一般都小于lines的长度
        // 通过下来的这个判断，来决定用那个歌词来做一个主导
        const moreLine = lines.length - tlines.length;

        let tempArr = [];

        // 如果moreLine大等于0则以line为主导
        if(moreLine >= 0){
            tempArr = [lines, tlines]; //把两个数组装到这个临时变量里，保证 lines 长度大于 tlines
        }else{
            tempArr = [tlines, lines]; // 保证 tlines 的长度大于 lines
        }

        // 用来定义较短的那个字段，并且找到这个较短字段的第一个元素在较长字段中的索引, 也就是元素的时间部分相等
        // 所以这里首先拿到较短字段的第一行的时间部分
        const first = timeExp.exec(tempArr[1][0])[0]; //[1]是tempArr的第二个元素，[0]是第一行，[0]就是整体的时间部分
        // console.log('generTLyric -- first --->', timeExp.exec(tempArr[1][0]));
        // 0: "[00:00.000]"
        // 1: "00"
        // 2: "00"
        // 3: "000"

        // 在较长字段里要跳过的行数
        const skipIndex = tempArr[0].findIndex(item => {
            const exec = timeExp.exec(item);
            console.log('generTLyric - skipIndex -- exec --->', exec);
            if(exec){
                return exec[0] === first;
            }
        })
        // console.log('generTLyric -- skipIndex --->', skipIndex);
        // 如果是-1说明没找到，那么就从第一行开始就是对应的了
        const _skip = skipIndex === -1 ? 0 : skipIndex;

        // 先把过滤掉的那些行暂时保存下来
        const skipItems = tempArr[0].slice(0,_skip);
        if(skipItems.length){
            skipItems.forEach(line => this.makeLine(line));
        }
        // console.log('generTLyric -- this.lines --->', this.lines);

        let zipLines$; //定义一个流

        // zip 能够把每一个流和索引一一对应上
        // https://stackblitz.com/edit/typescript-5az27c?file=index.ts&devtoolsheight=100
        // from 把普通数组也变成流
        // skip(n) 跳过一个observable发送过来的前面 n 项
        //             下面这一步的主要目的是为了让两个流的长度一致
        if(moreLine > 0){ // 这时候就用 lines 做主导
            zipLines$ = zip(from(lines).pipe(skip(_skip)), from(tlines));
        }else{
            zipLines$ = zip(from(lines), from(tlines).pipe(skip(_skip)));
        }
        // 订阅上面的这个 ZipLines$ 流
        zipLines$.subscribe(([line, tline])=>{ this.makeLine(line, tline)})
    }

    private makeLine(line: string, tline='') {
        // 查询当前行是否有时间的内容
        const result = timeExp.exec(line);
        // console.log('makeLine - result --- ', result);

        if(result) {
            // 这里的匹配到的部分设为空，并且把多余的空格都去掉， 这样就把数字部分都去掉了，只剩下文字部分
            const txt = line.replace(timeExp, '').trim();
            const txtCn = tline ? tline.replace(timeExp, '').trim() : '';
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



/**
 *  zip 的 作用
 *
 *   of 按顺序发出任意数量的值。
 *   from 将数组、promise 或迭代器转换成 observable 。此操作符也可以用来将字符串作为字符的序列发出！
 *
 *   const sourceOne = of('Hello');
    const sourceTwo = of('World!');
    const sourceThree = of('Goodbye');
    const sourceFour = of('World!');

    const example = zip(
        sourceOne,
        sourceTwo,
        sourceThree,
        sourceFour
    );

    const subscribe = example.subscribe(val => console.log(val));

    //output: ["Hello", "World!", "Goodbye", "World!"]
 */