import { Song } from '../services/data-types/common.types';
import { getRandomInt } from './number';

// target在传入的数组中存在
export function inArray(arr: any[], target: any): boolean {
    return arr.indexOf(target) !== -1;
}

// 类型是 一个 泛型的数组，返回也是， 这里的泛型 在 <T>里定义一下
export function shuffle<T>(arr: T[]): T[] {
    const result = arr.slice(); //先保存一下副本
    for (let i = 0; i < result.length; i++) {
        // get a random number between 0 and i
        const j = getRandomInt([0, i]);
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

//在数组当中找到索引, 并返回
export function findIndex(list: Song[], currentSong: Song): number {
    return list.findIndex(item => item.id === currentSong.id);
}