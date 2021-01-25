import { Base64 } from 'js-base64';
import { AnyJson } from "../services/data-types/member.type";

// 用来给数据加密或者解密，都用下面这个方法
export function codeJson(source: Object, type = 'encode'): AnyJson {
    // console.log('【codeJson】 - source - ', source);
    const result = {};
    // 遍历source
    for (const attr in source) {
        // 给 key 和 value 全都加密
        if(source.hasOwnProperty(attr)) {
            result[Base64[type](attr)] = Base64[type](source[attr]);
        }
    }
    return result;
}
