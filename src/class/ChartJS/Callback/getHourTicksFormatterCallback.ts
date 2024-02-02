import { CoreScaleOptions, Scale, Tick } from "chart.js";
import OpenChatChart from "../../OpenChatChart";

export const isYestString = '\u200B'
export const isRecentString = '\u200C'

// 最新24時間の場合のticksフォーマッター
export const getHourTicksFormatterCallback = (ocChart: OpenChatChart)
  : ((this: Scale<CoreScaleOptions>, tickValue: string | number, index: number, ticks: Tick[]) => string | number | number[] | string[] | null | undefined) | undefined =>
  (tickValue: string | number, index: number, ticks: Tick[]) => {
    const hour = (ocChart.data.date[Number(tickValue)] as string).substring(6);
    if (index === ticks.length - 1) return isRecentString + hour

    const today = ("0" + (new Date().getDate()).toString()).slice(-2);
    const day = (ocChart.data.date[Number(tickValue)] as string).substring(3, 5);
    if (today !== day) return isYestString + hour

    return hour
  }