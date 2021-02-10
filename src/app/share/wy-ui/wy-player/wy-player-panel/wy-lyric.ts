import { Subject, Subscription, timer } from 'rxjs';
import { from } from 'rxjs/internal/observable/from';
import { zip } from 'rxjs/internal/observable/zip';
import { skip } from 'rxjs/internal/operators';
import { Lyric } from './../../../../services/data-types/common.types';

// 第三位可能2位或者3位数字
// 目前有这三种展示的方式[00:00.000] [00:34] [0:34]
// 因此下面的正则需要改变
const timeExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
// const timeExp = /\[(\d{1, 2}):(\d{2})\.(?:\.(\d{2,3}))?\]/;

// In TypeScript, an interface can create the new name that can be used everywhere.
// Type does not have a functionality of extending.
// An interface can extend multiple interfaces and class as well.
// Type is mainly used when a union or tuple type needs to be used.

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

interface Handler extends BaseLyricLine {
    lineNum: number; //当前歌词的索引
}

export class WyLyric {

    // 用来保存makeLine执行之后得到的新的数组
    // 并且要把每一行转换成一个对象，这个对象就是LyricLine类型
    lines: LyricLine[] = [];

    // Subject是多播，both as Observable and Observer  -->https://github.com/puddlejumper26/blogs/issues/184
    handler = new Subject<Handler>();                // ---------------------- 7
    private timer$: Subscription;                      // ---------------------- 9 , 11

    private lrc: Lyric;
    private playing = false;
    private curNum: number;
    private startStamp: number;
    private pauseStamp: number;

    // 这里的lrc就是在wy-player-panel组件中的updateLyrics中的res
    constructor(lrc: Lyric){
        // console.log('【wy-lyric】 - Constructor lrc ---', lrc.tlyric);
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
    private generLyric() {                                                   // ---------------------- 1
        // 下面的log得到的是一个字符串，样式看下面这个链接
        // https://github.com/puddlejumper26/ng-wyy/issues/10#issuecomment-731837229
        // console.log('【wy-lyric】 - generLyric -- ', this.lrc.lyric);

        const generLyricLines = this.lrc.lyric.split('\n'); //先用换行符分隔一下 并转成了数组
        // console.log('【wy-lyric】 - generLyric - generLyricLines ---', generLyricLines);

        // 单独处理这个数组里的每一项
        generLyricLines.forEach(line=> this.makeLine(line));                              // ---------------------- 3
        // console.log('【wy-lyric】 - generLyric - lines --->', this.lines);
    }

    // 因为是有两种歌词的情况下，那么就需要统一两者开始的时间和位置
    private generTLyric() {                                                            // ---------------------- 2
        // 一样先分行
        const lines = this.lrc.lyric.split('\n');
        // 只需要匹配到时间的部分， 把前面的e.g. [by:羽新也] 去除掉
        const tlines = this.lrc.tlyric.split('\n').filter(item => timeExp.exec(item) !== null);
        // console.log('【wy-lyric】 - generTLyric - lines --->', lines);
        // console.log('【wy-lyric】 - generTLyric - tlines --->', tlines);

        /**====================================================================== */

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
        // console.log('【wy-lyric】 - generTLyric - tempArr - ', tempArr);
        // 这时候得到的是一个 [Array(44),Array(41)],总是第一个长于第二个

        // 用来定义较短的那个字段，并且找到这个较短字段的第一个元素在较长字段中的索引, 也就是元素的时间部分相等
        // 所以这里首先拿到较短字段的第一行的时间部分
        //[1]是tempArr的第二个元素，[0]是第一行，[0]就是整体的时间部分
        const first = timeExp.exec(tempArr[1][0])[0];
        // console.log('【wy-lyric】 - generTLyric -- first --->', timeExp.exec(tempArr[1][0]));
        // 0: "[00:00.000]"
        // 1: "00"
        // 2: "00"
        // 3: "000"

        // 在较长字段里要跳过的行数
        const skipIndex = tempArr[0].findIndex(item => {
            const exec = timeExp.exec(item);
            // console.log('【wy-lyric】 - generTLyric - skipIndex - exec --->', exec);
            if(exec){
                return exec[0] === first;
            }
        })
        // console.log('【wy-lyric】 - generTLyric - skipIndex --->', skipIndex);
        // 如果是-1说明没找到，那么就从第一行开始就是对应的了
        const _skip = skipIndex === -1 ? 0 : skipIndex;

        // 先把过滤掉的那些行暂时保存下来
        const skipItems = tempArr[0].slice(0,_skip);
        if(skipItems.length){
            skipItems.forEach(line => this.makeLine(line));                                        // ---------------------- 3
        }
        // console.log('【wy-lyric】 - generTLyric - this.lines --->', this.lines);

        /**====================================================================== */

        let zipLines$; //定义一个流

        //                  下面这一步的主要目的是为了让两个流的长度一致
        // zip 能够把每一个流和索引一一对应上
        // https://stackblitz.com/edit/typescript-5az27c?file=index.ts&devtoolsheight=100
        // from 把普通数组也变成流
        // skip(n) 跳过一个observable发送过来的前面 n 项
        if(moreLine > 0){ // 这时候就用 lines 做主导
            zipLines$ = zip(from(lines).pipe(skip(_skip)), from(tlines));
        }else{ // 这时候就用 tlines 做主导
            zipLines$ = zip(from(lines), from(tlines).pipe(skip(_skip)));
        }
        // 订阅上面的这个 ZipLines$ 流
        zipLines$.subscribe(([line, tline])=>{
            this.makeLine(line, tline);
        });

        // 注意这里如果想看到整体的 由{ txt, txtCn, time} 对象组成的数组，一定要用 this.lines，不然仅仅只用 console.log(lines) 仅仅只是generTLyric（）中定义的局部的 const lines
        // console.log('【wy-lyric】 - generTLyric - this.lines --->', this.lines);
    }

    // 最后把 符合条件的 { txt, txtCn, time} 对象， 实际就是每一行歌词的 中外文内容 加上 开始到这行结束的总毫秒数 作为一个对象 push 到 lines[] 中去
    private makeLine(line: string, tline='') {                                                   // ---------------------- 3
        // 查询当前行是否有时间的内容
        const result = timeExp.exec(line);
        // console.log('【wy-lyric】 - makeLine - result --- ', result);

        if(result) {
            // 这里的匹配到的部分设为空，并且把多余的空格都去掉， 这样就把数字部分都去掉了，只剩下文字部分
            const txt = line.replace(timeExp, '').trim();
            const txtCn = tline ? tline.replace(timeExp, '').trim() : '';
            if(txt) {
                //正则里面第三个括号的内容
                const thirdResult = result[3] || '00'; //做一下兼容 保证第三个是一个三位数
                const len = thirdResult.length;
                // 如果长度大于2， 那么直接转换，如果不大于2，就需要*10
                // parseInt（str, base） ES5默认base是10，取决于browser； parseFloat, Number,  <--> toString
                const _thirdResult = len > 2 ? parseInt(thirdResult) : parseInt(thirdResult)*10;

                // 这里是把[00:01.260] 的时间转换成总的毫秒数 以便后面的匹配
                const time = Number(result[1])*60*1000 + Number(result[2])*1000 + _thirdResult;

                this.lines.push({ txt, txtCn, time});
            }
        }
    }

    // 歌词播放的方法， 参数是歌词应该从什么时间开始播放，默认是0， 方便之后如果是拖动进度条，这里也能够传入相应的值
    play(startTime: number = 0, skip: boolean = false){                                                 // ---------------------- 4
        if(!this.lines.length) return;
        if(!this.playing) {
            this.playing = true; //重置状态
        }

        // 然后找到 startTime 对应的是第几行歌词
        //   2: {txt: "I'm lovin' how I'm floating next to you", txtCn: "我爱我沉浸在你周身的感觉", time: 6270}
        this.curNum = this.findCurNum(startTime);                                        // ---------------------- 5
        // console.log('【wy-lyric】 - play - curNum', this.curNum);

        // 保存当前的时间戳和startTime，，一个固定值 也就是歌曲刚开始的时间， 和 togglePlay进行结合理解
        // console.log('【wy-lyric】 - play - startTime', startTime);  //一个固定值
        this.startStamp = Date.now() - startTime; // 一首歌只有一个这个值
        // console.log('【wy-lyric】 - play - this.startStamp', this.startStamp);

        if(!skip) {
            this.callHandler(this.curNum);  //可能需要 this.curNum - 1                       // ---------------------- 10
        }

        // 现在已经知道正在播放第几行
        // 注意这里是一个循环，所以只要满足这个条件，就会一直执行，
        if(this.curNum < this.lines.length) { //说明这首歌没有播放完
            // 首先清除定时器                                          // ---------------------- 9
            // clearTimeout(this.timer);
            this.clearTimer()
            this.playReset();                                       // ---------------------- 6
        }
    }

    // 当前正在播放的第几行歌词， 传入的是当前播放的 毫秒数， 返回的是当前行数的 索引
    // findIndex()方法返回数组中满足提供的测试函数的第一个元素的索引。若没有找到对应元素则返回-1
    private findCurNum(time: number): number {                                       // ---------------------- 5
        const index = this.lines.findIndex(item => (item.time >= time));
        // console.log('【wy-lyric】- findCurNum - index', index);
        // 没找到就返回最后一个
        return index === -1 ? this.lines.length-1 : index;
    }

    // 就是继续往下播放歌词
    private playReset() {                                       // ---------------------- 6
        //拿到当前播放这一行的数据
        let line = this.lines[this.curNum];

        // 延时就是 等待 delay 的毫秒数 之后跳到下一行去，delay 是这一行播放完的时间
        // console.log('【wy-lyric】 - playReset - this.startStamp', this.startStamp);
        // this.startStamp 是一个固定的值
        // 括号里的 - 这一行刚开始的时间 减去 这首歌刚开始的时间 （都是从1970开始到那时的总毫秒数）- 得到的就是到这行之前这首歌播放的总时间
        // console.log('【wy-lyric】 - playReset - line.time', line.time); //可以在generLyric 和 generTLyric的 lines中找到
        // 这个时间就是每行设定的时间，是歌曲开始播放到这行结束的理论总毫秒数
        const delay = line.time - (Date.now() - this.startStamp); // 每一行歌词都有一个这个值
        // console.log('【wy-lyric】 - playReset - delay', delay);

        // 播放一句，就要把当前歌词的数据发射到外界去，发射完，当前的索引也要++，先用再加，所以是 放在后面
        // this.timer = setTimeout(() => {                        // ---------------------- 9
        //     this.callHandler(this.curNum++);              // ---------------------- 7
        //     if(this.curNum < this.lines.length && this.playing){
        //         this.playReset()
        //     }
        // }, delay)
                // 替换上面的 setTimeout
        this.timer$ = timer(delay).subscribe(() => {
            this.callHandler(this.curNum++);              // ---------------------- 12
            if(this.curNum < this.lines.length && this.playing){
                this.playReset()
            }
        })
    }

    // 把正在播放的歌词往外发射，接受一个索引 , 在 player-panel - handleLyric中拿到
    private callHandler(i: number){                       // ---------------------- 7
        //这里不判断的话，那么可能后面需要使用到 这个功能的时候，那个地方执行过快，使得执行完成了，这里的值还没有发射出去
        // 就会造成需要接受的地方得不到相应的数据
        // 通过 wy-player-panel 中的 handleLyric 方法 log (this.lyricRefs) 就能看出是否dom有问题
        if(i > 0) {
            this.handler.next({
                txt: this.lines[i].txt,
                txtCn: this.lines[i].txtCn,
                lineNum: i
            });
        }
    }

    private clearTimer() {                                // ---------------------- 13
        this.timer$ && this.timer$.unsubscribe();
    }

    togglePlay(playing: boolean) {                  // ---------------------- 8
        //先保存当前的时间戳
        const now = Date.now();
        this.playing = playing;
        //如果正在播放, 继续调用play方法   ，  否则暂停播放
        if(playing){
            // console.log('【wy-lyric】- togglePlay - this.pauseStamp', this.pauseStamp);
            // console.log('【wy-lyric】- togglePlay - this.startStamp', this.startStamp);
            const startTime = (this.pauseStamp || now) - (this.startStamp || now);
            // console.log('【wy-lyric】- togglePlay - startTime', startTime);

            //注意这里调用 play 方法的时候，不需要里面的 callHandler的方法， 因为已经有了
            // 因为这里仅仅只是根据是否暂停还是播放，来暂停或者继续滚动歌词部分
            // 所以这一行的歌词不需要再 通过 handler 发送给 panel了
            this.play(startTime, true);
        }else{
            this.stop();                                 // ---------------------- 9
            //记录暂停的时间
            this.pauseStamp = now;
        }
    }

    // 暂停播放, playing = false, 并且停掉定时器
    stop() {                                    // ---------------------- 9
        if(this.playing) {
            this.playing = false;
        }
        //也需要清除定时器
        // clearTimeout(this.timer);
        this.clearTimer();
    }

    // 快速改变歌词的时间，相当于拖动进度条
    seek(time: number) {                  // ---------------------- 10
        this.play(time);
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
