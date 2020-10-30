import { Pipe, PipeTransform } from '@angular/core';
/**
 *  to simplied displayed number
 *  e.g.  1232000 -> 123万
 */
@Pipe({
  name: 'playCount'
})
export class PlayCountPipe implements PipeTransform {

  transform(value: number): number | string {
    if(value > 10000){
      return Math.floor(value / 10000) + '万';
    }else{
      return value;
    }
  }

}
