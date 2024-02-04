export default function formatDates(dates: string[], limit: ChartLimit): (string | string[])[] {
  const weekdays = ['日', '月', '火', '水', '木', '金', '土']
  const curYear = new Date().getFullYear()

  return dates.map((dataDate) => {
    const dateObj = new Date(dataDate)
    const dataYear = dateObj.getFullYear()

    const year = curYear === dataYear ? '' : dateObj.getFullYear().toString().substring(2, 4) + '/'
    const month = dateObj.getMonth() + 1
    const date = dateObj.getDate()

    if (limit === 0) return `${year}${month.toString().padStart(2, '0')}/${date.toString().padStart(2, '0')}`

    const resultDate = `${year}${month}/${date}`
    const weekday = weekdays[dateObj.getDay()]
    const resultWeekday = `(${weekday})`

    if (limit === 31) return resultDate + resultWeekday
    return [resultDate, resultWeekday]
  })
}