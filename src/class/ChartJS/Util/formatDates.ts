export default function formatDates(dates: string[], limit: ChartLimit): (string | string[])[] {
  const weekdays = ['日', '月', '火', '水', '木', '金', '土']
  const curYear = new Date().getFullYear()

  return dates.map((date) => {
    const dateObj = new Date(date)
    const weekday = weekdays[dateObj.getDay()]

    const resultYear = dateObj.getFullYear()
    const resultDate = `${curYear === resultYear ? '' : dateObj.getFullYear() + '/'}${dateObj.getMonth() + 1}/${dateObj.getDate()}`
    const resultWeekday = `(${weekday})`

    if (limit === 31) return resultDate + resultWeekday
    if (limit === 8) return [resultDate, resultWeekday]
    return resultDate
  })
}