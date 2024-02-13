import { updateURLSearchParams } from "./util"

const categoryParam: urlParamsValue<'category'>[] = ['in', 'all']
const barParam: urlParamsValue<'bar'>[] = ['ranking', 'rising', 'none']
const limitParam: urlParamsValue<'limit'>[] = ['hour', 'week', 'month', 'all']

const defaultCategory: urlParamsValue<'category'> = 'in'
const defaultBar: urlParamsValue<'bar'> = 'ranking'
const defaultLimit: urlParamsValue<'limit'> = 'week'

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
    params.category === defaultCategory && params.bar === defaultBar && params.limit === defaultLimit
      ? null
      : params
  ))
}