---

---

![contribute](https://img-blog.csdnimg.cn/fa88b7169bf5425aa29910820c31a31d.png)

#### 1. 安装

```
npm i vue3-ctb --save
```

#### 2. 在项目中引入

```js
import { createApp } from 'vue'
import App from './App.vue'
// *引入组件
// 在ts项目中引入时会报错，在项目根目录下的.d.ts文件中加入---> declare module 'vue3-ctb'
import Ctb from 'vue3-ctb'
// *引入组件样式
import 'vue3-ctb/contributes.css'
const app = createApp(App)
app.use(Ctb)
app.mount('#app')
```

#### 3. 使用

```vue
<template>
	<!-- 已在第2步骤中全局注册了，直接使用 -->
	<Contributes v-bind="config" :data="list" />
</template>

<script setup lang="ts">
const config = {
  showFooter: false,
  level1Color: '#90d7ec40',
  level2Color: '#90d7ec60',
  level3Color: '#90d7ec',
  size: '15px',
  tipActionName: '提交'
}
const list = [
  {
    date: '2022-12-01',
    count: 3
  },
  {
    date: '2022-12-02',
    count: 5
  },
  {
    date: '2022-12-03',
    count: 6
  }
]
</script>
```

#### 其他属性

| 属性                | 说明                             | 默认值 |
| ------------------- | -------------------------------- | ------ |
| showFooter          | 贡献图底部包括数据统计、等级说明 | true   |
| level(1\|2\|3)Color | 等级颜色                         |        |
| size                | 格子大小                         | 15px   |
| tipActionName       | 行为名称                         | '提交' |
