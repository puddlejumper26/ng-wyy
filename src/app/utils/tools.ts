// 判断传入的是否是一个空对象
export function isEmptyObject(obj: Object): boolean {
    return JSON.stringify(obj) === '{}';
}
