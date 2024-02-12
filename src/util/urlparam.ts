const categoryParam: urlParams['category'][] = ['in', 'all']
const barParam: urlParams['bar'][] = ['ranking', 'rising', 'none']
const limitParam: urlParams['limit'][] = ['hour', 'week', 'month', 'all']

const validParam = <T extends urlParamsName>(definition: string[], url: URL, name: urlParamsName)
  : urlParamsValue<T> | null => {
  const param = url.searchParams.get(name) ?? ''
  return definition.includes(param) ? param as urlParamsValue<T> : null
}

export function getCurrentUrlParams(): urlParams {
  const url = new URL(window.location.href);
  return {
    category: validParam<'category'>(categoryParam, url, 'category') ?? 'in',
    bar: validParam<'bar'>(barParam, url, 'bar') ?? 'ranking',
    limit: validParam<'limit'>(limitParam, url, 'limit') ?? 'week',
  }
}