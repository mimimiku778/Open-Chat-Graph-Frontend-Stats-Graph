export default function formatDates(dates: string[], arrayWeekday = false): (string | string[])[] {
  const weekdays = ['日', '月', '火', '水', '木', '金', '土']

  return dates.map((date) => {
    const dateArray = date.split('/')
    if (dateArray.length === 2) {
      const [month, day] = dateArray
      const weekdayIndex = new Date(new Date().getFullYear(), Number(month) - 1, Number(day)).getDay()
      const weekday = weekdays[weekdayIndex]

      if (!arrayWeekday) return [`${month}/${day}`, `(${weekday})`]
      return `${month}/${day}(${weekday})`
    } else {
      const [year, month, day] = dateArray
      const weekdayIndex = new Date(Number(year), Number(month) - 1, Number(day)).getDay()
      const weekday = weekdays[weekdayIndex]

      if (!arrayWeekday) return [`${year}/${month}/${day}`, `(${weekday})`]
      return `${year}/${month}/${day}(${weekday})`
    }
  })
}