export function traverseElement(element, callBack) {
  let walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_ELEMENT,
  )
  do {
    callBack(walker.currentNode)
  }while(walker.nextNode())
}