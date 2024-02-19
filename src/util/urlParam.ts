import { updateURLSearchParams } from "./util"

const categoryParam: urlParamsValue<'category'>[] = ['in', 'all']
const barParam: urlParamsValue<'bar'>[] = ['ranking', 'rising', 'none']
const limitParam: urlParamsValue<'limit'>[] = ['hour', 'week', 'month', 'all']

export const defaultCategory: urlParamsValue<'category'> = 'in'
export const defaultBar: urlParamsValue<'bar'> = 'ranking'
export const defaultLimit: urlParamsValue<'limit'> = 'week'
export const defaultLimitNum: ChartLimit | 25 = 8

const validParam = <T extends urlParamsName>(definition: urlParamsValue<T>[], url: URL, name: T)
  : urlParamsValue<T> | null => {
  const param = url.searchParams.get(name) ?? ''
  return definition.includes(param as never) ? param as urlParamsValue<T> : null
}

export function getCurrentUrlParams(): urlParams {
  const url = new URL(window.location.href);
  return {
    category: validParam<'category'>(categoryParam, url, 'category') ?? defaultCategory,
    bar: validParam<'bar'>(barParam, url, 'bar') ?? defaultBar,
    limit: validParam<'limit'>(limitParam, url, 'limit') ?? defaultLimit,
  }
}

export function setUrlParams(params: urlParams) {
  window.history.replaceState(null, '', updateURLSearchParams(
    {
      bar: params.bar === defaultBar ? '' : params.bar,
      category: params.category === defaultCategory || params.bar === 'none' ? '' : params.category,
      limit: params.limit === defaultLimit ? '' : params.limit
    }
  ))
}