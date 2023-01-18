<template>
  <div id="contribute">
    <div class="container">
      <div class="week">
        <p>周一</p>
        <p>周四</p>
        <p>周日</p>
      </div>
      <div class="data">
        <div class="month">
          <div class="last-year">
            <template v-for="(value, key) in lastYearMonthAndDays">
              <span class="item">{{ key }}</span>
            </template>
          </div>
          <div class="this-year">
            <template v-for="(value, key) in thisYearMonthAndDays">
              <span class="item">{{ key }}</span>
            </template>
          </div>
          <span class="this-month">本月</span>
        </div>
        <div class="list">
          <template v-if="Object.keys(lastYearMonthAndDays).length">
            <!-- 先渲染占位格子，对齐星期几 -->
            <div
              v-for="item in lastYearToday - 1"
              :key="item"
              class="item stopgap"
            ></div>
            <!-- 渲染去年的 -->
            <template v-for="(value, key) in lastYearMonthAndDays" :key="key">
              <template v-for="item in value" :key="item">
                <div
                  v-if="compareDate(item)"
                  :class="['item', computedLevel(item)]"
                  :title="`${item}\r${props.tipActionName}了${getContributeCount(item)}次`"
                ></div>
                <div v-else class="item" :title="item"></div>
              </template>
            </template>
            <!-- 接着渲染今年的 -->
            <template v-if="Object.keys(thisYearMonthAndDays).length">
              <template v-for="(value, key) in thisYearMonthAndDays" :key="key">
                <template v-for="item in value" :key="item">
                  <div
                    v-if="compareDate(item)"
                    :class="['item', computedLevel(item)]"
                    :title="`${item}\r${props.tipActionName}了${getContributeCount(item)}次`"
                  ></div>
                  <div v-else class="item" :title="item"></div>
                </template>
              </template>
            </template>
            <!-- 最后渲染本月的 -->
            <template v-for="item in thisMonthAndDays" :key="item">
              <div
                v-if="compareDate(item)"
                :class="['item', computedLevel(item)]"
                :title="`${item}\r${props.tipActionName}了${getContributeCount(item)}次`"
              ></div>
              <div v-else class="item" :title="item"></div>
            </template>
          </template>
        </div>
      </div>
    </div>
    <div v-if="props.showFooter" class="level">
      <div class="statistics">
        <span>最近一年{{ props.tipActionName }}: {{ con_total }}次</span>
        <span>最长连续{{ props.tipActionName }}: {{ con_max_series() }}天</span>
        <span>最近连续{{ props.tipActionName }}: {{ con_near_series() }}天</span>
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
  name: "Contributes",
};
</script>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
const props = withDefaults(
  defineProps<{
    showFooter?: boolean;
    level1Color?: string;
    level2Color?: string;
    level3Color?: string;
    size?: string;
    data?: any;
    tipActionName?: string
  }>(),
  {
    showFooter: true,
    level1Color: "#90d7ec40",
    level2Color: "#90d7ec80",
    level3Color: "#90d7ec",
    size: "15px",
    data: [],
    tipActionName: '提交'
  }
);
// 为什么这么做，因为后续对contributes的操作很多，如果都使用props.的操作很麻烦
const contribute = ref<any[]>(props.data);
watch(
  () => props.data,
  (val) => {
    contribute.value = val;
  }
);
// 用于计算提供的contributes列表数据与渲染的日期格子元素的匹配
const compareDate = (date: string) => {
  return contribute.value.find((item) => item.date === date);
};
// 计算匹配上的日期格子显示的贡献等级
const computedLevel = (date: string) => {
  const item: any = contribute.value.find((item) => item.date === date);
  if (item?.count) {
    return item.count < 3
      ? "level1"
      : item.count <= 5
      ? "level2"
      : item.count > 5 && "level3";
  }
};
// 计算每个月份的第一个日期是星期几，用于渲染空白格子占位
const computedDay = (date: string) => {
  let day = new Date(date).getDay();
  day = day === 0 ? 7 : day;
  return day;
};
// 计算匹配上的日期格子显示的贡献次数
const getContributeCount = (date: string) => {
  const res = contribute.value.find((item) => item.date === date);
  return res?.count ?? 0;
};
// 计算提供的contributes列表数据的总贡献次数-近一年来的总贡献次数
const con_total = computed(() => {
  return contribute.value.reduce((prev, now) => {
    return (prev += now.count);
  }, 0);
});
// 计算最长的一次连续贡献天数
const con_max_series = () => {
  const arr = [];
  let count = 0;
  for (let i = 0; i < contribute.value.length; i++) {
    const date = new Date(contribute.value[i].date);
    if (i !== contribute.value.length - 1) {
      const date2 = new Date(contribute.value[i + 1].date);
      if (date2.getDate() - date.getDate() === 1) {
        count += 1;
      } else {
        count = 0;
      }
    }
    arr.push(count);
  }
  if (arr.length) {
    return Math.max(...arr);
  } else {
    return 0;
  }
};
// 计算最近一次的连续贡献天数
const con_near_series = () => {
  let count = 0;
  for (let i = contribute.value.length - 1; i >= 0; i--) {
    const date = new Date(contribute.value[i].date);
    if (i !== 0) {
      const date2 = new Date(contribute.value[i - 1].date);
      if (date.getDate() - date2.getDate() === 1) {
        count++;
      } else {
        if (count) {
          return count;
        }
      }
    }
  }
  return count;
};
// 计算月份的映射关系
type returnVal =
  | "一月"
  | "二月"
  | "三月"
  | "四月"
  | "五月"
  | "六月"
  | "七月"
  | "八月"
  | "九月"
  | "十月"
  | "十一月"
  | "十二月";
const compareMonth = (month: number): returnVal => {
  switch (month) {
    case 1:
      return "一月";
    case 2:
      return "二月";
    case 3:
      return "三月";
    case 4:
      return "四月";
    case 5:
      return "五月";
    case 6:
      return "六月";
    case 7:
      return "七月";
    case 8:
      return "八月";
    case 9:
      return "九月";
    case 10:
      return "十月";
    case 11:
      return "十一月";
    case 12:
      return "十二月";
    default:
      return "一月";
  }
};
const monthList = [
  "十二月",
  "一月",
  "二月",
  "三月",
  "四月",
  "五月",
  "六月",
  "七月",
  "八月",
  "九月",
  "十月",
  "十一月",
];
// 计算二月天数，28天还是29天，30天的特殊情况不计算，只考虑闰年还是平年
const computedFebDayCount = (year: number) => {
  if (year % 100) {
    // 非世纪年
    if (lastFullYear % 4) {
      // 未被整除
      return 28;
    } else {
      // 被4整除
      return 29;
    }
  } else {
    // 世纪年
    if (year % 400) {
      // 未被整除
      return 28;
    } else {
      // 被整除
      return 29;
    }
  }
};
// 添加二月日期
const handleFebDayCount = (
  type: "lastyear" | "thisyear" | "thismonth",
  dayCount: 28 | 29,
  startDate: number,
  year: number
) => {
  if (type === "lastyear") {
    // 添加到去年分类对象的二月属性中
    lastYearMonthAndDays["二月"] = [];
    for (let i = startDate; i <= dayCount; i++) {
      lastYearMonthAndDays["二月"].push(`${year}-02-${i < 10 ? "0" + i : i}`);
    }
  } else if (type === "thisyear") {
    // 添加到今年分类对象的二月属性中
    thisYearMonthAndDays["二月"] = [];
    for (let i = startDate; i <= dayCount; i++) {
      thisYearMonthAndDays["二月"].push(`${year}-02-${i < 10 ? "0" + i : i}`);
    }
  } else {
    // 添加到本月分类列表里
    for (let i = startDate; i <= dayCount; i++) {
      thisMonthAndDays.push(`${year}-02-${i < 10 ? "0" + i : i}`);
    }
  }
};
// 添加非二月日期
const handleDayCountOfAnothorMonth = (
  type: "lastyear" | "thisyear" | "thismonth",
  dayCount: 30 | 31,
  startDate: number,
  month: number,
  year: number
) => {
  if (type === "lastyear") {
    // 添加到去年分类的对象中
    const _month = compareMonth(month);
    lastYearMonthAndDays[_month] = [];
    for (let i = startDate; i <= dayCount; i++) {
      lastYearMonthAndDays[_month]?.push(
        `${year}-${month < 10 ? "0" + month : month}-${i < 10 ? "0" + i : i}`
      );
    }
  } else if (type === "thisyear") {
    // 添加到今年分类的对象中
    const _month = compareMonth(month);
    thisYearMonthAndDays[_month] = [];
    for (let i = startDate; i <= dayCount; i++) {
      thisYearMonthAndDays[_month]?.push(
        `${year}-${month < 10 ? "0" + month : month}-${i < 10 ? "0" + i : i}`
      );
    }
  } else {
    // 添加到今年本月分类列表里
    for (let i = startDate; i <= dayCount; i++) {
      thisMonthAndDays.push(
        `${year}-${month < 10 ? "0" + month : month}-${i < 10 ? "0" + i : i}`
      );
    }
  }
};
// 后续计算并记录近一年的所有日期，用于渲染贡献的日期格子元素
interface IMonth<T> {
  一月?: T;
  二月?: T;
  三月?: T;
  四月?: T;
  五月?: T;
  六月?: T;
  七月?: T;
  八月?: T;
  九月?: T;
  十月?: T;
  十一月?: T;
  十二月?: T;
}
const lastYearMonthAndDays: IMonth<string[]> = {}; // 去年的月份和天数
const thisYearMonthAndDays: IMonth<string[]> = {}; // 今年的月份和天数
const thisMonthAndDays: string[] = []; // 本月的月份和天数
const now = new Date();
const today = now.getDate();
const thisMonth = now.getMonth();
const thisYear = now.getFullYear();
// 31天的月份
const is31dayCountOfMonth = [1, 3, 5, 7, 8, 10, 12];
// 30天的月份,还有个2月份特殊计算
const is30dayCountOfMonth = [4, 6, 9, 11];

// 去年的今天的日期
const lastYear = new Date(`${thisYear - 1}-${thisMonth + 1}-${today}`);
// 去年的今天是星期几，用于填充第一个渲染元素之前的空白格子使其对齐去年今天的星期的天数
const lastYearToday = lastYear.getDay() === 0 ? 7 : lastYear.getDay();
// 去年的今天是几月
const lastYearTodayMonth = lastYear.getMonth() + 1;
// 去年是多少年
const lastFullYear = lastYear.getFullYear();

// 1.先计算去年这个月的剩余天数日期
if (is31dayCountOfMonth.includes(lastYearTodayMonth)) {
  handleDayCountOfAnothorMonth(
    "lastyear",
    31,
    today,
    lastYearTodayMonth,
    lastFullYear
  );
} else if (is30dayCountOfMonth.includes(lastYearTodayMonth)) {
  handleDayCountOfAnothorMonth(
    "lastyear",
    30,
    today,
    lastYearTodayMonth,
    lastFullYear
  );
} else if (lastYearTodayMonth === 2) {
  const dayCount = computedFebDayCount(lastFullYear);
  handleFebDayCount("lastyear", dayCount, today, lastFullYear);
}
// // 2.计算去年这个月往后月份的天数日期
let startMonth = lastYearTodayMonth + 1;
while (startMonth <= 12) {
  if (is31dayCountOfMonth.includes(startMonth)) {
    handleDayCountOfAnothorMonth("lastyear", 31, 1, startMonth, lastFullYear);
  } else if (is30dayCountOfMonth.includes(startMonth)) {
    handleDayCountOfAnothorMonth("lastyear", 30, 1, startMonth, lastFullYear);
  } else if (startMonth === 2) {
    const dayCount = computedFebDayCount(lastFullYear);
    handleFebDayCount("lastyear", dayCount, 1, lastFullYear);
  }
  startMonth++;
}
// 3.计算今年一月到现在月份的天数日期
// 今年是1月份 ---> thisMonth = 0
startMonth = 1;
while (startMonth <= thisMonth + 1) {
  if (startMonth !== thisMonth + 1) {
    // 不是本月
    if (is31dayCountOfMonth.includes(startMonth)) {
      // 这是一个31天的月份
      handleDayCountOfAnothorMonth("thisyear", 31, 1, startMonth, thisYear);
    } else if (is30dayCountOfMonth.includes(startMonth)) {
      // 这时一个30天的月份
      handleDayCountOfAnothorMonth("thisyear", 31, 1, startMonth, thisYear);
    } else if (startMonth === 2) {
      const dayCount = computedFebDayCount(thisYear);
      // 这是2月
      handleFebDayCount("thisyear", dayCount, 1, thisYear);
    }
  } else {
    // 是本月
    for (let i = 1; i <= today; i++) {
      thisMonthAndDays.push(
        `${thisYear}-${startMonth < 10 ? "0" + startMonth : startMonth}-${
          i < 10 ? "0" + i : i
        }`
      );
    }
  }
  startMonth++;
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
#contribute > .container {
  display: flex;
  justify-content: space-between;
}
#contribute > .container > .week {
  width: 40px;
  height: calc(v-bind("props.size") * 7);
  font-size: 12px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin-top: 24px;
}
#contribute > .container > .data {
  flex: 1;
}
#contribute > .container > .data > .month {
  font-size: 12px;
  margin-bottom: 10px;
  color: #000;
  display: flex;
}
#contribute > .container > .data > .month .item {
  margin-right: 35px;
}
#contribute > .container > .data > .month > .last-year {
  color: #00000080;
}
#contribute > .container > .data > .list {
  display: grid;
  grid-template-columns: repeat(auto-fill, v-bind("props.size"));
  grid-template-rows: repeat(7, v-bind("props.size"));
  grid-auto-flow: column;
}
#contribute > .container > .data > .list > .item {
  background: #cccccc80;
  border-radius: 3px;
  margin: 2px;
}
#contribute > .container > .data > .list > .stopgap {
  opacity: 0;
}
#contribute > .container > .data > .list > .item:hover {
  border: 1px solid #00000080;
}
#contribute > .container > .data > .list > .level1 {
  background: v-bind("props.level1Color");
}
#contribute > .container > .data > .list > .level2 {
  background: v-bind("props.level2Color");
}
#contribute > .container > .data > .list > .level3 {
  background: v-bind("props.level3Color");
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
  background: v-bind("props.level1Color");
}
.level > .right > .level-item2 {
  background: v-bind("props.level2Color");
}
.level > .right > .level-item3 {
  background: v-bind("props.level3Color");
}
</style>
