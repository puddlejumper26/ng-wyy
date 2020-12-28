<h1 align='center'>Ng - WYY</h1>

# 1.0 Description
This is an Angular App Simulation of Netease Cloud Music
- Original please click [here](https://music.163.com/).
- The purpose of this APP is only for learning and technical level communications. Not for any commercial reasons.
- This APP could be only run locally

# 2.0 Tech Stack && Libraries && Plugins
- Angular 8.3.0 && Typescript && less
- Ng-Zorro-Antd (Ant Design of Angular) https://ng.ant.design/docs/introduce/en
- NgRx - framework for building reactive applications in Angular 状态管理
- Minireset.css
  - npm install minireset.css
- Netease Cloud Music API (Node.js API service)
  - https://github.com/Binaryify/NeteaseCloudMusicApi
  - 【DOC】https://binaryify.github.io/NeteaseCloudMusicApi/#/?id=neteasecloudmusicapi
  - [How To Install](https://github.com/puddlejumper26/ng-wyy/issues/2)
- BetterScroll 2.0 (https://better-scroll.github.io/docs/en-US/)

# 3.0 How to Use this APP
- Start Netease Cloud Music as Server, this should be a separate folder
  - download or clone this https://github.com/Binaryify/NeteaseCloudMusicApi to local
  - inside of this folder Run `node ./app.js`
  - Open `localhost:3000` would see the data
- Start Angular
  - download or clone this repository to local
  - Run `ng serve`
  - Open `localhost:4200` would see the app
- Functions
  - login, play music, volumn, playlist, lyrics..

# 4.0 Applied APIs / Operators

## 4.1 Angular

- `@SkipSelf()` - [core.module.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/core/core.module.ts)
- `changeDetection:ChangeDetectionStrategy.OnPush` - [wy-carousel.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/pages/home/components/wy-carousel/wy-carousel.component.ts)
- `@Injectable({ providedIn: ServicesModule })` - [home.service.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/services/home.service.ts)
- `Pipe`  [play-count.pipe.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/play-count.pipe.ts)
- `HttpParams` - [singer.service.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/services/singer.service.ts)
- `set()` -  [sheet.vervice.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/services/sheet.service.ts) | [song.service.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/services/song.service.ts)
- `Resolve` - [home-resolve.service.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/pages/home/home-resolve.service.ts)
- `encapsulation: ViewEncapsulation.None` - [wy-slider.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-slider/wy-slider.component.ts)
- `SimpleChanges` - [wy-slider-handle.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-slider/wy-slider-handle.component.ts) | [wy-slider-track.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-slider/wy-slider-track.component.ts) | [wy-player-panel.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-player/wy-player-panel/wy-player-panel.component.ts) | [wy-scroll.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-player/wy-scroll/wy-scroll.component.ts) | [clickoutside.directive.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/directives/clickoutside.directive.ts)
- `ElementRef` - [wy-slider.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-slider/wy-slider.component.ts) | [wy-player.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-player/wy-player.component.ts) | [wy-scroll.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-player/wy-scroll/wy-scroll.component.ts) | [clickoutside.directive.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/directives/clickoutside.directive.ts)
- `Renderer2` - [clickoutside.directive.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/directives/clickoutside.directive.ts)
- `DOCUMENT` - [wy-slider-helper.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-slider/wy-slider-helper.ts) | [wy-slider.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-slider/wy-slider.component.ts) | [clickoutside.directive.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/directives/clickoutside.directive.ts)
- `ChangeDetectorRef` &  `markForCheck()` - [wy-slider.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-slider/wy-slider.component.ts)
- `ControlValueAccessor` - `writeValue` | `registerOnChange` | `registerOnTouched` - [wy-slider.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-slider/wy-slider.component.ts)
- `ngOnChanges` - | [clickoutside.directive.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/directives/clickoutside.directive.ts) | [wy-player-panel.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-player/wy-player-panel/wy-player-panel.component.ts) | [wy-scroll.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-player/wy-scroll/wy-scroll.component.ts) | [clickoutside.directive.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/directives/clickoutside.directive.ts) | [wy-slider-handle.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-slider/wy-slider-handle.component.ts) | [wy-slider-track.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-slider/wy-slider-track.component.ts)
- `ngOnDestroy` - [wy-slider.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-slider/wy-slider.component.ts)
- `ngModelChange` - [wy-slider.component.html](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-slider/wy-slider.component.html) | [wy-player.component.html](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-player/wy-player.component.html) | [sheet-list.component.html](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/pages/sheet-list/sheet-list.component.html)
- `isPlatformBrowser` | `PLATFORM_ID` - [services.module.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/services/services.module.ts)
- `QueryList` | `frist` | `last` | `firstChange` - [wy-player-panel.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-player/wy-player-panel/wy-player-panel.component.ts)
- `snapshot` | `queryParamMap` - [sheet-list.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/pages/sheet-list/sheet-list.component.ts)

## 4.2 rxjs

- `forkJoin()` - [home-resolve.service.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/pages/home/home-resolve.service.ts)
- `first()` - [home-resolve.service.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/pages/home/home-resolve.service.ts)
- `pluck()` - [sheet.service.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/services/sheet.service.ts) | [wy-slider.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-slider/wy-slider.component.ts)
- `switchMap()` - [sheet.service.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/services/sheet.service.ts)
- `fromEvent` - [wy-slider.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-slider/wy-slider.component.ts) | [wy-player.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-player/wy-player.component.ts)
- `distinctUntilChanged()` & `takeUntil()` - [wy-slider.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-slider/wy-slider.component.ts)
- `merge()` - [wy-slider.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-slider/wy-slider.component.ts)
- `timer` - [wy-player-panel.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-player/wy-player-panel/wy-player-panel.component.ts)
- `zip` | `from` | `skip` - [wy-lyric.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-player/wy-player-panel/wy-lyric.ts)
- `map()` - [home.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/pages/home/home.component.ts) | [home.service.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/services/home.service.ts) | [sheet.service.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/services/sheet.service.ts) | [singer.service.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/services/singer.service.ts) | [song.service.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/services/song.service.ts) | [wy-slider.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-slider/wy-slider.component.ts)
- `pipe()` - [home-resolve.service.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/pages/home/home-resolve.service.ts) | [home.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/pages/home/home.component.ts) | [home.service.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/services/home.service.ts) | [sheet.service.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/services/sheet.service.ts) | [singer.service.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/services/singer.service.ts) | [song.service.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/services/song.service.ts) | [wy-slider.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-slider/wy-slider.component.ts)

## 4.3 Web
- `HTMLDivElement` - [wy-slider.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-slider/wy-slider.component.ts)
- `TouchEvent` (`touchstart`, `touchmove`,`touchend`) & `MouseEvent` (`mousedown`, `mouseup`, `mousemove`) - [wy-slider.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-slider/wy-slider.component.ts) | [wy-slider-types.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-slider/wy-slider-types.ts)
- `stopPropagation()` & `preventDefault()` - [wy-slider-helper.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-slider/wy-slider-helper.ts)
- `getClientRects()` & `getBoundingClientRect()`  - [wy-slider-helper.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-slider/wy-slider-helper.ts)
- `ownerDocument` & `defaultView` - [wy-slider-helper.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-slider/wy-slider-helper.ts)
- `Event` - [wy-slider-types.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-slider/wy-slider-types.ts) | [wy-player.component.ts / html](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-player/wy-player.component.ts)
- `canPlay` | `timeupdate` | `ended` - [wy-player.component.html](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-player/wy-player.component.html)
-  `HTMLAudioElement` | `play()` | `pause()` | `currentTime` | `buffered`| `end` - [wy-player.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-player/wy-player.component.ts)
-  `HTMLElement` | `el` | `querySelectorAll` | `NodeList`- [wy-player-panel.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-player/wy-player-panel/wy-player-panel.component.html)
-  `padStart` - [format-time.pipe.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/pipes/format-time.pipe.ts)

## 4.4 NgRx
- `createReducer` & `Action`- [player.reducer.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/store/reducer/play.reducer.ts)
- `createAction` & `props` - [player.actions.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/store/actions/player.actions.ts)
- `createSelector` | `createFeatureSelector`  - [player.selector.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/store/selectors/player.selector.ts)
- `Store` | `select` | `dispatch`- [wy-player.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-player/wy-player.component.ts) | [home.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/pages/home/home.component.ts)

## 4.5 Ant Design Angular | BetterScroll
- `[nzDotRender]` - [Ant] - [Carousel](https://github.com/puddlejumper26/ng-wyy/issues/3)
- `(nzBeforeChange)` - [Ant] - [Carousel](https://github.com/puddlejumper26/ng-wyy/issues/3)
- `next()`, `pre()` - [Ant] - [Carousel](https://github.com/puddlejumper26/ng-wyy/issues/3)
- `[ngModel]` - [Ant] - [Slider Bar](https://github.com/puddlejumper26/ng-wyy/issues/8)
- `on` | `scrollEnd` | `scrollToElement` - [BetterScroll] -  [wy-scroll.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-player/wy-scroll/wy-scroll.component.ts)
- `NzModalService - confirm` - [Ant] - [wy-player.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-player/wy-player.component.ts)
- `[nzPageSize]` | `[nzPageSize]` | `[naTotal]` | `(nzPageIndexChange)` - [Ant] - [sheet-list.component.html](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/pages/sheet-list/sheet-list.component.html)


## 4.6 Node.js
- `queryString` - Object Serialization 对象序列化-[singer.service.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/services/singer.service.ts)

# 5.0 Compositions

## 5.1 Carousel part
- [Carousel - the process to write the Banner](https://github.com/puddlejumper26/ng-wyy/issues/3)
- components / services / directives / etc.
  - `commmon.type` (define data type)
  - `home.service` (obtain data from API, send with observables)
  - `wy-carousel.copmponent`
  - `home.component` (subscribe data from service, send to template)
- InterfaceAddress
  - /banner

## 5.2 Home page main section - Hottags and SongSheetList
- [HotTags and SongSheetList 首页16张专辑](https://github.com/puddlejumper26/ng-wyy/issues/4)
- components / services / directives / etc.
  - `home.service`   (obtain data from API, send with observables)
  - `commmon.type`   (define data type)
  - `single-sheet.component`
  - `home.component`  (subscribe data from service, send to template)
  - `play-count.pipe`
- InterfaceAddress
  - /playlist/hot
  - /personalized

## 5.3 Home page right section - Singer List
- [SingerList入驻歌手](https://github.com/puddlejumper26/ng-wyy/issues/5)
- components / services / directives / etc.
  - `singer.service` (obtain data from API, send with observables)
  - `commmon.type` (define data type)
  - `home.component` (subscribe data from service, send to template)
- InterfaceAddress
  - /artist/list

## 5.4 Home page right section - Login part
- components / services / directives / etc.
  - `member-card.component`

## 5.5 Resolve
- [home-resolve.service.ts](https://github.com/puddlejumper26/ng-wyy/issues/6)
- components / services / directives / etc.
  - `home.component`
  - `home-resovle.service.ts`


## 5.6 Home page bottom section - player - function
- [Song List - functions](https://github.com/puddlejumper26/ng-wyy/issues/7)
- components / services / directives / etc.
  - `wy-player`
  - `comment.type`
  - `single-sheet.component`
  - `home.component`
  - `song.service.ts`
  - `sheet.service.ts`

- InterfaceAddress
  - /playlist/detail
  - /song/url

## 5.7 Home page bottom section - Player - Slider Bar 滑块组件
- [Slider Bar](https://github.com/puddlejumper26/ng-wyy/issues/8)
- components / services / directives / etc.
  - `wy-slider.component`
  - `wy-slider-track.component`
  - `wy-slider-handle.component`
  - `wy-slider-types.ts`
  - `wy-slider-helper.ts`
  - `array.ts`
  - `number.ts`
  - `common.types.ts`

## 5.8 Home page bottom section - Player - play, next, previous, volumn | NGRX 应用
- [play, next, previous, volumn | NGRX 应用 ](https://github.com/puddlejumper26/ng-wyy/issues/9)
- components / services / directives / etc.
  - Settings
  - `index.ts`
  - `player.actions.ts` | `player.reducer.ts` | `player.selector.ts`
  - `player-type.ts`
  -
  - Playing music
  - `home.component.ts`
  - `wy-player.component.ts` | `wy-player.component.html`
  -
  - Displaying pic, time, etc on the bottom slider bar
  - `format-time.pipe.ts`
  - `wy-player.component.html` | `wy-player.component.ts` | `wy-player.module.ts`
  -
  - Next, Previous, Play, Pause button
  - `wy-player.component.ts` | `wy-player.component.html`
  -
  - Progress bar - 进度条
  - `wy-player.component.ts` | `wy-player.component.html`
  - `wy-slider.component.ts`
  -
  - Volumn Bar
  - `wy-player.component.html` | `wy-player.component.`
  -
  - Play Mode (loop, random,singleLoop)
  - `wy-player.component.html` | `wy-player.component.`
  - `array.ts` | `number.ts`

## 5.9 Home page bottom section - Playlist and lyrics
- [PlayList and Lyrics](https://github.com/puddlejumper26/ng-wyy/issues/10)
- components / services / directives / etc.
  - Playlist
  - `wy-player-panel.component`
  - `wy-player.component.`
  - `npm install @better-scroll/core --save`
  - ` ng g c share/wy-ui/wy-player/wy-scroll -s -t -c=OnPush -v=None`  - 内联样式，OnPush策略，视图封装
  - `wy-scroll.component`
  - `npm install @better-scroll/scroll-bar --save` && `npm install @better-scroll/mouse-wheel --save`
  - `home.component.ts`
  -
  - Lyrics
  - `common.type.ts`
  - `song.service.ts`
  - `wy-player.component`
  - `wy-player-panel.component`
  - `wy-lyric.ts`

## 5.10 Sheet List component
- [](https://github.com/puddlejumper26/ng-wyy/issues/12)
- components / services / directives / etc.
  - `sheet-list.component`

## 5.11 Sheet Info component
- [](https://github.com/puddlejumper26/ng-wyy/issues/13)
- components / services / directives / etc.
  - `sheet-info component`
  -

# 6.0 Final Demo

## 6.1 Homepage
## 6.2 Login
## 6.3

# 7.0 Knowledge Note
- [Notes](https://github.com/puddlejumper26/ng-wyy/issues/1)

- Observable in this APP Comparisons - [Click](https://github.com/puddlejumper26/ng-wyy/issues/11)
- Resolve - [home-resolve.service.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/pages/home/home-resolve.service.ts)
- How the Token (API_CONFIG, Window) is working - [`services.module.ts`](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/services/services.module.ts)
- Replace `setTimeout` - [1.0 `timer` | 2.0 `this.win.setTimeout`] - [`wy-player-panel.component.ts`](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/share/wy-ui/wy-player/wy-player-panel/wy-player-panel.component.ts)
-
