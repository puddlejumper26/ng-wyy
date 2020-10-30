<h1 align='center'>Ng - WYY</h1>

# 1.0 Description
This is the Angular App Simulation of Netease Cloud Music, original please click [here](https://music.163.com/).

# 2.0 Tech Stack
- Angular 8.3.0
- Ng-Zorro-Antd (Ant Design of Angular)
  - https://ng.ant.design/docs/introduce/zh
- Minireset.css
  - npm install minireset.css
- Netease Cloud Music API (Node.js API service)
  - https://github.com/Binaryify/NeteaseCloudMusicApi
  - [Install](https://github.com/puddlejumper26/ng-wyy/issues/2)


# 3.0 How to Use this APP
- Start Netease Cloud Music as Server, this should be a separate folder
- Run `node .\app.js`
- Open `localhost:3000` would see the data
- Under angular folger Run `ng serve`
- Open `localhost:4200` would see the app
- Functions
  - login, play music, drag the


# 4.0 Applied APIs

## 4.1 Angular / rxjs API
- `@SkipSelf()` - [core.module.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/core/core.module.ts)
- `changeDetection:ChangeDetectionStrategy.OnPush` - Carousel - [wy-carousel.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/pages/home/components/wy-carousel/wy-carousel.component.ts)
- `@Injectable({ providedIn: ServicesModule })` - [home.service.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/services/home.service.ts)
- `HttpParams` - [singer.service.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/services/singer.service.ts)
- `Resolve` - [home-resolve.service.ts]
- `forkJoin` - [home-resolve.service.ts]
- `first` - [home-resolve.service.ts]

## 4.2 Netease Cloud Music API
- Start this API
```ts
node .\app.js
```

## 4.3 Ant Design Angular API
- `[nzDotRender]` - [Carousel](https://github.com/puddlejumper26/ng-wyy/issues/3)
- `(nzBeforeChange)` - [Carousel](https://github.com/puddlejumper26/ng-wyy/issues/3)
- `next()`, `pre()` - [Carousel](https://github.com/puddlejumper26/ng-wyy/issues/3)


## 4.4 Node.js
- `queryString` - Object Serialization 对象序列化-[singer.service.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/services/singer.service.ts)

# 5.0 Compositions

## 5.1 Carousel part
- [Carousel](https://github.com/puddlejumper26/ng-wyy/issues/3)
- components / services / directives / etc.
  - `home.service` (obtain data from API, send with observables)
  - `commmon.type` (define data type)
  - `wy-carousel.copmponent`
  - `home.component` (subscribe data from service, send to template)
- InterfaceAddress
  - /banner

## 5.2 Home page main section - Hottags and SongSheetList
- [HotTags and SongSheetList](https://github.com/puddlejumper26/ng-wyy/issues/4)
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
- [SingerList](https://github.com/puddlejumper26/ng-wyy/issues/5)
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

# 6.0 Final Demo

## 6.1 Homepage
## 6.2 Login
## 6.3

# Notes
- [Notes](https://github.com/puddlejumper26/ng-wyy/issues/1)


# Source
- https://www.bilibili.com/video/BV1iJ411F7Bf?p=3
-