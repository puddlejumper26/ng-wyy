import { Observable } from "rxjs";

export type WySliderStyle = {
    bottom?: string | null;
    height?: string | null;
    left?: string | null;
    width?: string | null;
};

export type SliderEventObserverConfig = {
    start: string;
    move: string;
    end: string;
    filterEvent: (e: Event) => boolean;
    pluckKey: string[];
    startPlucked$?: Observable<number>; //因为定义的是位置信息，所以用 number就可以了  $是意思Observale
    moveResolved$?: Observable<number>;
    end$?: Observable<Event>;
};
