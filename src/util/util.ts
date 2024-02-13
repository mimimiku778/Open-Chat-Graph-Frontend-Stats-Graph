export function updateURLSearchParams(params: { [key: string]: string } | null): URL {
  const url = new URL(window.location.href);
  url.search = ''

  if (!params) {
    for (let k in url.searchParams.entries()) {
      url.searchParams.delete(k)
    }
  } else {
    for (let k in params) {
      params[k] && url.searchParams.set(k, params[k])
    }
  }

  return url
}
