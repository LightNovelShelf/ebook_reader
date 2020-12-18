export function throttle(fn, ms = 160) {
  // let timeout
  let start = new Date()
  return function () {
    let context = this
    let args = arguments
    let curr = new Date() - 0
    // clearTimeout(timeout)
    if (curr - start >= ms) {
      fn.apply(context, args)
      start = curr
    } else {
      // timeout = setTimeout(() => fn.apply(context, args), ms)
    }
  }
}
export function throttle2 (fn, ms = 160) {
  let timeout
  let start = new Date()
  return function () {
    let context = this
    let args = arguments
    let curr = new Date() - 0
    clearTimeout(timeout)
    if (curr - start >= ms) {
      fn.apply(context, args)
      start = curr
    } else {
      timeout = setTimeout(() => fn.apply(context, args), ms)
    }
  }
}