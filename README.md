# vue-h5-template

参考 [vue-h5-template](https://github.com/sunniejs/vue-h5-template) 的模板，实现个人的开发模板。

### 启动项目

```
git clone git@github.com:Gintangible/vue-common-cli.git

cd vue-h5-template

yarn

yarn serve
```

<span id="top">目录</span>

- [x] [配置多环境变量](#env)
- [x] [rem 适配](#rem)
- [x] [eruda 移动端 log](#eruda)
- [] [vantUI 按需加载](#vant)
- [x] [Vuex 状态管理](#vuex)
- [x] [Vue-router](#router)
- [] [Axios 封装及接口管理](#axios)
- [] [Eslint + Pettier 统一开发规范](#pettier)


### <span id="env">配置多环境变量</span>

`package.json` 里的 `scripts` 配置 serve build，通过 `--mode xxx` 来执行不同环境。

- `yarn serve` 启动本地
- `yarn stage` 打包测试
- `yarn build` 打包正式

```json
"serve": "vue-cli-service serve",
"serve:prod": "vue-cli-service serve --mode production",
"stage": "vue-cli-service build --mode stage",
"build": "vue-cli-service build --mode production",
```

##### 配置介绍

`.env.xx` 中变量要以 `VUE_APP_` 开头，在代码中可以通过 `process.env.VUE_APP_` 访问。

在项目根目录中新建`.env.*`

> .env.development  本地开发环境配置

```
NODE_ENV=development
```

`.env.stage` 、`.env.production` 类似 `.env.development`。在这里只定义了基础的 `VUE_APP_ENV`, 其他变量统一放在 `src/config/env.*.js` 中进行管理。（**修改起来方便，不需要重启项目，符合开发习惯**。）

[▲ 回顶部](#top)

### <span id="rem">rem 适配</spn>

- `postcss-pxtorem` 是一款 `postcss` 插件，用于将单位转化为 `rem`
- `amfe-flexible` 用于设置 rem 基准值

```
yarn add amfe-flexible
yarn add postcss-pxtorem --dev
```

#### PostCSS 配置

```javascript
// https://github.com/michael-ciniawsky/postcss-load-config
module.exports = {
    plugins: {
        // 兼容浏览器，添加前缀
        autoprefixer: {
            overrideBrowserslist: [
                'Android 4.1',
                'iOS 7.1',
                'Chrome > 31',
                'ff > 31',
                'ie >= 8',
                "last 10 versions", // 所有主流浏览器最近10版本用
            ]
        },
        'postcss-pxtorem': {
          // vant 使用的是 37.5
            rootValue: 37.5, //结果为：设计稿元素尺寸/37.5，比如元素宽375px,最终页面会换算成 10rem
            propList: ['*'], //是一个存储哪些将被转换的属性列表，这里设置为['*']全部，假设需要仅对边框进行设置，可以写['*', '!border*']
            // unitPrecision: 5, //保留rem小数点多少位
            // mediaQuery: false, //媒体查询( @media screen 之类的)中不生效
            // minPixelValue: 12, //px小于12的不会被转换
        }
    }
}
```

在 `main.js` 中引入 `import 'amfe-flexible'`;

[▲ 回顶部](#top)

### <span id="eruda">移动端 log</span>

在移动端，是无法看到日志。可以引入一下插件 `eruda` 或 `vConsole`。当前使用 `eruda`。

```
yarn add eruda
yarn add VConsole
```

> main.js 中引入

```javascript
const eruda = require('eruda');
//import VConsole from 'vconsole';
if (process.env.NODE_ENV !== 'production') {
  // eruda 引入
  eruda.init();

  // vConsole
  //new VConsole();
}
```

### <span id="vuex">Vuex 状态管理</span>

[Vuex 官方文档](https://vuex.vuejs.org/zh/)
[vuex-persist 文档](https://github.com/championswimmer/vuex-persist)

##### 安装

```
yarn add vuex
yarn add vuex-persist
```
使用 `vuex` 保存数据，如果刷新页面的话，会把`store` 中的数据清掉，故 `vuex-persist` 做持久化储存。

##### 目录结构（详见stroe 目录）

```bash
├── store
│   ├── modules
│   │   └── app.js
│   ├── index.js
│   ├── getters.js
│   ├── persist.js
```

##### main.js 引入

```javascript
import Vue from 'vue'
import App from './App.vue'
import store from './store'

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
```
##### 使用方式

```html
<script>
  import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'
  export default {
    computed: {
      ...mapGetters(['userName']),
      ...mapState({
        user: (state) => state.user,
      }),
      // ...mapState('app', {
      //   userName: (state) => state.userName,
      // }),
    },

    created() {
      // state 获取
      // this.store.state.user;

      this.SET_USER();
      // this.SET_USER_NAME();
    },

    methods: {
      // mapMutations 方式，actions 与 mapActions 方法一样
      ...mapMutations({
        SET_USER: 'SET_USER',
      }),
      // ...mapMutations('app', {
      //   SET_USER_NAME: 'SET_USER_NAME',
      // }),

      // Action 通过 store.commit/store.dispatch 方法触发
      doVuex() {
        this.$store.commit('SET_USER', 'commit 触发');
        this.$store.dispatch('setUserAsync', 'dispatch 触发');
      },
    }
  }
</script>
```

[▲ 回顶部](#top)

### <span id="router">Vue-router</span>

[Vue-router 官方文档](https://router.vuejs.org/zh/api/)
[nprogress 文档](https://github.com/rstacruz/nprogress)
##### 安装

```
yarn add vue-router
yarn add nprogress
```

> router/index.js (详见 `router` 目录)

```javascript
import Vue from 'vue';
import Router from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'

Vue.use(Router);
// 首页无需懒加载
import Home from 'views/Home/home';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '*',
        name: 'Error404',
        // 路由懒加载
        component: () => import('views/error404.vue'),
    }
];

const router = new Router({
    routes,
});

router.beforeEach((to, from, next) => {
    NProgress.start();
    if (next) {
        next();
    }
});

router.afterEach((to, from, next) => {
    NProgress.done();
    if (next) {
        next();
    }
});

export default router;
```

然后在 `main.js` 中引入。

更多：[动态路由](https://juejin.cn/post/6844903478880370701)

[▲ 回顶部](#top)

