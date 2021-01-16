export function trimStr(str) {
  return (str || '').replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
}
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getMilliseconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = `${o[k]}`
      let ct = str.length
      if (k == 's+') {
        ct--
      }
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : `00${str}`.substr(ct))
    }
  }
  return fmt
}
export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export function getFullUrl(uri){
  let url = window.location.href.split('#')[0].split('/')
  url[url.length - 1] = uri
  return url.join('/')
}