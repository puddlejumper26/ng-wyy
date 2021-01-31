// 传入的 val 是被限制在 min 和 max 之间的
export function limitNumberInRange(val: number, min: number, max: number): number {
    return Math.min(Math.max(val, min), max)
}

// 最后得到的是一个介于[0-100]之间的一个数字，不是百分数
export function getPercent(min: number, max: number, val: number): number {
    return ((val - min)/(max - min)) * 100;
}

// 取[min,max]之间的一个随机数，并且可以取到min和max的两个端点，是闭合区间的
// range的类型是 元组, 返回的是前面两个number之间的一个number
// Math.random()可以取 0 和 1 之间的数，但是不能取到 1
// 所以下面要 + 1 ， 不然会把min也取进去
export function getRandomInt(range: [number, number]): number{
    return Math.floor(Math.random()*(range[1] - range[0] + 1) + range[0]);
}
