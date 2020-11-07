import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "formatTime",
})
export class FormatTimePipe implements PipeTransform {
    transform(time: number): any {
        if (time) {
            const temp = time | 0; // 这里的 | 相当于 Math.floor
            const minute = temp / 60 | 0;
            // padStart 是前置补0， 如是个位数，前面就需要补零， 最多是两位数，不够补一个零
            const second = (temp % 60).toString().padStart(2, "0");
            return `${minute}:${second}`;
        } else {
            return "00:00";
        }
    }
}
