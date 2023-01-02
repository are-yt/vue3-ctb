<template>
  <div class="contribute">
    <header class="month">
      <div v-for="month in monthList" :key="month" class="head-item">
        {{ month }}
      </div>
    </header>
    <div class="container">
      <div class="week">
        <p>周一</p>
        <p>周四</p>
        <p>周日</p>
      </div>
      <div v-if="list.length" class="list">
        <div
          v-for="item in lastYearToday - 1"
          :key="item"
          class="item stopgap"
        ></div>
        <template v-for="item in list" :key="item">
          <div
            v-if="compareDate(item)"
            :class="['item', [computedLevel(item)]]"
            :title="`${item}\r提交${getContributeCount(item)}次`"
          ></div>
          <div v-else class="item" :title="item"></div>
        </template>
        <div
          v-for="item in 7 - now.getDay()"
          :key="item"
          class="item stopgap"
        ></div>
      </div>
    </div>
    <div v-if="props.showFooter" class="level">
      <div class="statistics">
        <span>最近一年贡献: {{ con_total }}次</span>
        <span>最长连续贡献: {{ con_max_series() }}天</span>
        <span>最近连续贡献: {{ con_near_series() }}天</span>
      </div>
      <div class="right">
        <span>少</span>
        <span class="item level-item1"></span>
        <span class="item level-item2"></span>
        <span class="item level-item3"></span>
        <span>多</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Contributes'
}
</script>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
const props = withDefaults(defineProps<{
  showFooter?: boolean
  level1Color?: string
  level2Color?: string
  level3Color?: string
  size?: string
  data?: any
}>(), {
  showFooter: true,
  level1Color: '#90d7ec40',
  level2Color: '#90d7ec80',
  level3Color: '#90d7ec',
  size: '15px',
  data: []
})
// 为什么这么做，因为后续对contributes的操作很多，如果都使用props.的操作很麻烦
const contribute = ref<any[]>(props.data)
watch(() => props.data, val => {
  contribute.value = val
})
// 用于计算提供的contributes列表数据与渲染的日期格子元素的匹配
const compareDate = (date: string) => {
  return contribute.value.find(item => item.date === date)
}
// 计算匹配上的日期格子显示的贡献等级
const computedLevel = (date: string) => {
  const item: any = contribute.value.find(item => item.date === date)
  if (item?.count) {
    return item.count < 3
      ? 'level1'
      : item.count <= 5
      ? 'level2'
      : item.count > 5 && 'level3'
  }
}
// 计算匹配上的日期格子显示的贡献次数
const getContributeCount = (date: string) => {
  const res = contribute.value.find(item => item.date === date)
  return res?.count
}
// 计算提供的contributes列表数据的总贡献次数-近一年来的总贡献次数
const con_total = computed(() => {
  return contribute.value.reduce((prev, now) => {
    return (prev += now.count)
  }, 0)
})
// 计算最长的一次连续贡献天数
const con_max_series = () => {
  const arr = []
  let count = 0
  for (let i = 0; i < contribute.value.length; i++) {
    const date = new Date(contribute.value[i].date)
    if (i !== contribute.value.length - 1) {
      const date2 = new Date(contribute.value[i + 1].date)
      if (date2.getDate() - date.getDate() === 1) {
        count += 1
      } else {
        count = 0
      }
    }
    arr.push(count)
  }
  if (arr.length) {
    return Math.max(...arr)
  } else {
    return 0
  }
}
// 计算最近一次的连续贡献天数 
const con_near_series = () => {
  let count = 0
  for (let i = contribute.value.length - 1; i >= 0; i--) {
    const date = new Date(contribute.value[i].date)
    if (i !== 0) {
      const date2 = new Date(contribute.value[i - 1].date)
      if (date.getDate() - date2.getDate() === 1) {
        count++
      } else {
        if (count) {
          return count
        }
      }
    }
  }
  return count
}
const monthList = [
  '十二月',
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月'
]
// 计算二月天数，28天还是29天，30天的特殊情况不计算，只考虑闰年还是平年
const computedFebDayCount = (year: number) => {
  if (year % 100) {
    // 非世纪年
    if (lastFullYear % 4) {
      // 未被整除
      return 29
    } else {
      // 被4整除
      return 28
    }
  } else {
    // 世纪年
    if (year % 400) {
      // 未被整除
      return 29
    } else {
      // 被整除
      return 28
    }
  }
}
// 添加二月日期
const handleFebDayCount = (
  dayCount: 28 | 29,
  startDate: number,
  year: number
) => {
  for (let i = startDate; i <= dayCount; i++) {
    list.push(`${year}-02-${i < 10 ? '0' + i : i}`)
  }
}
// 添加非二月日期
const handleDayCountOfAnothorMonth = (
  dayCount: 30 | 31,
  startDate: number,
  month: number,
  year: number
) => {
  for (let i = startDate; i <= dayCount; i++) {
    list.push(
      `${year}-${month < 10 ? '0' + month : month}-${i < 10 ? '0' + i : i}`
    )
  }
}
// 后续计算并记录近一年的所有日期，用于渲染贡献的日期格子元素
const list: string[] = []
const now = new Date()
const today = now.getDate()
const thisMonth = now.getMonth()
const thisYear = now.getFullYear()
// 31天的月份
const is31dayCountOfMonth = [1, 3, 5, 7, 8, 10, 12]
// 30天的月份,还有个2月份特殊计算
const is30dayCountOfMonth = [4, 6, 9, 11]

// 去年的今天的日期
const lastYear = new Date(`${thisYear - 1}-${thisMonth + 1}-${today}`)
// 去年的今天是星期几，用于填充第一个渲染元素之前的空白格子使其对齐去年今天的星期的天数
const lastYearToday = lastYear.getDay() === 0 ? 7 : lastYear.getDay()
// 去年的今天是几月
const lastYearTodayMonth = lastYear.getMonth() + 1
// 去年是多少年
const lastFullYear = lastYear.getFullYear()

// 1.先计算去年这个月的剩余天数日期
if (is31dayCountOfMonth.includes(lastYearTodayMonth)) {
  handleDayCountOfAnothorMonth(31, today, lastYearTodayMonth, lastFullYear)
} else if (is30dayCountOfMonth.includes(lastYearTodayMonth)) {
  handleDayCountOfAnothorMonth(30, today, lastYearTodayMonth, lastFullYear)
} else if (lastYearTodayMonth === 2) {
  const dayCount = computedFebDayCount(lastFullYear)
  handleFebDayCount(dayCount, today, lastFullYear)
}
// // 2.计算去年这个月往后月份的天数日期
let startMonth = lastYearTodayMonth + 1
while (startMonth <= 12) {
  if (is31dayCountOfMonth.includes(startMonth)) {
    handleDayCountOfAnothorMonth(31, 1, startMonth, lastFullYear)
  } else if (is30dayCountOfMonth.includes(startMonth)) {
    handleDayCountOfAnothorMonth(30, 1, startMonth, lastFullYear)
  } else if (startMonth === 2) {
    const dayCount = computedFebDayCount(lastFullYear)
    handleFebDayCount(dayCount, 1, lastFullYear)
  }
  startMonth++
}
startMonth = 1
// 3.计算今年一月到现在月份的天数日期
// 今年是1月份，thisMonth = 0
while (startMonth <= thisMonth + 1) {
  if (startMonth !== thisMonth + 1) {
    if (is31dayCountOfMonth.includes(startMonth)) {
      for (let i = 1; i <= 31; i++) {
        list.push(
          `${thisYear}-${startMonth < 10 ? '0' + startMonth : startMonth}-${
            i < 10 ? '0' + i : i
          }`
        )
      }
    } else if (is30dayCountOfMonth.includes(startMonth)) {
      for (let i = 1; i <= 30; i++) {
        list.push(
          `${thisYear}-${startMonth < 10 ? '0' + startMonth : startMonth}-${
            i < 10 ? '0' + i : i
          }`
        )
      }
    } else if (startMonth === 2) {
      const dayCount = computedFebDayCount(thisYear)
      for (let i = 1; i < dayCount; i++) {
        list.push(`${thisYear}-02-${i < 10 ? '0' + i : i}`)
      }
    }
  } else {
    // startMonth = thisMonth + 1
    for (let i = 1; i <= today; i++) {
      list.push(
        `${thisYear}-${startMonth < 10 ? '0' + startMonth : startMonth}-${
          i < 10 ? '0' + i : i
        }`
      )
    }
  }
  startMonth++
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.month {
  margin-left: 40px;
  display: flex;
  margin-bottom: 0.5rem;
}
.month > .head-item {
  font-size: 12px;
  margin-left: calc(v-bind('props.size') * 5 - 12px * 3);
}
.month > .head-item:nth-child(1) {
  margin-left: 0;
}
.month > .head-item:nth-child(2) {
  margin-left: 15px;
}
.container {
  display: flex;
  justify-content: space-between;
}
.week {
  width: 40px;
  height: calc(v-bind('props.size') * 7);
  font-size: 12px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.list {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, v-bind('props.size'));
  grid-template-rows: repeat(7, v-bind('props.size'));
  grid-auto-flow: column;
}
.list > .item {
  background: #cccccc80;
  border-radius: 3px;
  margin: 1px;
}
.list > .item:hover {
  border: 1px solid #000;
}
.list > .level1 {
  background: v-bind('props.level1Color');
}
.list > .level2 {
  background: v-bind('props.level2Color');
}
.list > .level3 {
  background: v-bind('props.level3Color');
}
.list > .stopgap {
  background: transparent;
}
.level {
  display: flex;
  align-items: center;
  font-size: 12px;
  margin-top: 0.5rem;
}
.level > .statistics {
  display: flex;
}
.level > .statistics > span {
  margin-right: 1rem;
}
.level > .right {
  position: relative;
  left: 100px;
  display: flex;
  align-items: center;
}
.level > .right > .item {
  width: 12px;
  height: 12px;
  margin: 0 1px;
}
.level > .right > .level-item1 {
  background: v-bind('props.level1Color');
}
.level > .right > .level-item2 {
  background: v-bind('props.level2Color');
}
.level > .right > .level-item3 {
  background: v-bind('props.level3Color');
}
</style>