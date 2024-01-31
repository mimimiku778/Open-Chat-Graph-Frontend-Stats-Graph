import OpenChatChart from "../class/OpenChatChart"

export async function fetchApi<T,>(url: string) {
  const response = await fetch(url)
  const data: T | ErrorResponse = await response.json()
  if (!response.ok) {
    const errorMessage = (data as ErrorResponse).error.message
    console.log(errorMessage)
    throw new Error(errorMessage)
  }

  return data as T
}

const ocId = document.getElementById('app')?.dataset.ocId!
const category = document.getElementById('app')?.dataset.category!

export function fetchUpdate(chart: OpenChatChart, param: ChartApiParam, isRising: boolean, all: boolean) {
  fetchApi<RankingPositionChart>(`http://192.168.11.10/oc/${ocId}/position?sort=${param}`).then((data) => {
    chart.render({
      date: data.date,
      graph1: data.member,
      graph2: data.position,
      time: data.time,
      totalCount: data.totalCount,
    }, {
      label1: 'メンバー数',
      label2: isRising ? '急上昇の最高順位' : 'ランキングの最高順位',
      category: all ? 'すべて' : category
    })
  })
}

export function fetchInit(chart: OpenChatChart, label2: string = '') {
  fetchApi<RankingPositionChart>(`http://192.168.11.10/oc/${ocId}/position?sort=rising`).then((data) => {
    chart.render({
      date: data.date,
      graph1: data.member,
      graph2: [],
      time: [],
      totalCount: [],
    }, {
      label1: 'メンバー数',
      label2,
      category,
    })
  })
}
