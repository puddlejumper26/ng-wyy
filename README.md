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
- Start Netease Cloud Music as Server
- Run `node .\app.js`
- open `localhost:3000` would see the data
- Run `ng serve`
- open `localhost:4200` would see the app


# 4.0 applied APIs

## 4.1 Angular API
- @SkipSelf() - [core.module.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/core/core.module.ts)
- changeDetection:ChangeDetectionStrategy.OnPush - Carousel - [wy-carousel.component.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/pages/home/components/wy-carousel/wy-carousel.component.ts)
- @Injectable({ providedIn: ServicesModule }) - [home.service.ts](https://github.com/puddlejumper26/ng-wyy/blob/main/src/app/services/home.service.ts)

## 4.2 Netease Cloud Music API
- Start this API
```ts
node .\app.js
```

## 4.3 Ant Design Angular API
- [nzDotRender] - [Carousel](https://github.com/puddlejumper26/ng-wyy/issues/3)
- (nzBeforeChange) - [Carousel](https://github.com/puddlejumper26/ng-wyy/issues/3)
- next(), pre() - [Carousel](https://github.com/puddlejumper26/ng-wyy/issues/3)


# 5.0 Components

## 5.1 Carousel
- API
  - localhost:3000/banner
- [Carousel](https://github.com/puddlejumper26/ng-wyy/issues/3)

## 5.2
- API
  - localhost:3000/playlist/hot
  - http://localhost:3000/personalized



# 6.0 Final Demo

## 6.1 Homepage
## 6.2 Login
## 6.3

# Notes
- [Notes](https://github.com/puddlejumper26/ng-wyy/issues/1)


# Source
- https://www.bilibili.com/video/BV1iJ411F7Bf?p=3
-