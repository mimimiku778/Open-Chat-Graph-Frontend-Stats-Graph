import { isRecentString, isYestString } from "./getHourTicksFormatterCallback"

export default function getHorizontalLabelFontColor(context: any) {
  let label = context.tick.label
  if (Array.isArray(label)) {
    label = label[1]
  }

  if (label.includes('土')) {
    return '#44617B'
  } else if (label.includes('日')) {
    return '#9C3848'
  } else if (label.includes(isYestString)) {
    // 最新24時間表示で昨日の時間の場合
    return '#aaa'
  } else if (label.includes(isRecentString)) {
    // 最新24時間表示で最新の時間の場合
    return '#4d73ff'
  } else if (label.includes(':')) {
    // 最新24時間表示で今日の時間の場合
    return '#777'
  } else {
    return 'black'
  }
}