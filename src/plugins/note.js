import { traverseElement } from './dom'
let noteList = []

export default function (document) {
  document.querySelectorAll('a').forEach((a) => {
    let href = a.getAttribute('href')
    if (
      a.getAttribute('epub:type') === 'noteref' ||
      a.classList.contains('duokan-footnote') ||
      a.getAttribute('type') === 'noteref'
    ) {
      let orgNote = document.querySelector(href)
      if (orgNote) {
        let note = orgNote.cloneNode(true)
        note.addEventListener(
          'click',
          function (ee) {
            ee.preventDefault()
            ee.stopPropagation()
          },
          true
        )
        noteList.push(note)
        traverseElement(orgNote, (note) => {
          note.style.display = 'inline'
        })
        orgNote.style.display = 'none'
        // 这里需要复制，为了之后能够保持原本宽度，需要一个原始dom
        // iframe ready 的时候元素都是隐藏的，这里测不出大小
        a.onclick = function (e) {
          e.preventDefault()
          let cover = document.createElement('div')
          cover.className = 'noteCover'
          document.body.appendChild(cover)
          let bodyRect = document.body.getBoundingClientRect()
          orgNote.style.display = 'inline'
          let origRect = orgNote.getBoundingClientRect()
          orgNote.style.display = 'none'
          // footnote 宽度小于body宽度80%
          let maxWidth = origRect.width * 0.8
          let width = origRect.width > maxWidth ? maxWidth : origRect.width
          let height = Math.ceil(origRect.height)
          a.appendChild(note)
          note.style.minWidth = `${Math.ceil(width)}px`
          note.style.maxWidth = `${Math.ceil(maxWidth)}px`
          note.style.transform = 'scale(0.2)'
          setTimeout(function () {
            note.style.transform = 'scale(1)'
          }, 0)
          // debugger
          note.style.display = 'block'
          note.style.left = `${-(width - 12) / 2}px`
          // 有scale，这里为了触发动画，无法用动画后的位置判断，必须使用中心点
          let noteRect = a.getBoundingClientRect()
          let center = {
            x: (noteRect.right % bodyRect.width) - noteRect.width / 2,
            y: noteRect.bottom - noteRect.height / 2
          }
          if (bodyRect.left + 15 > center.x - width / 2) {
            note.style.left = `${-(width - 12) / 2 + bodyRect.left + 15 - (center.x - width / 2)}px`
          } else if (bodyRect.right - 15 < center.x + width / 2) {
            note.style.left = `${-(width - 12) / 2 + bodyRect.right - 15 - (center.x + width / 2)}px`
          }
          if (bodyRect.bottom - 20 <= center.y + noteRect.height + height / 2) {
            note.style.bottom = 10 + noteRect.height + 'px'
          }
          cover.addEventListener(
            'click',
            function (e) {
              e.stopPropagation()
              note.style.transform = 'scale(0.2)'
              setTimeout(() => {
                cover.remove()
                note.style.display = 'none'
                cover = null
                // note = null
              }, 210)
            },
            true
          )
        }
      }
    }
    // else {
    //   let isFootnote = href.startsWith('#')
    //   if (isFootnote) {
    //     let orgNote = document.querySelector(href)
    //     if (orgNote) {
    //       a.onclick = function (e) {
    //         e.preventDefault()
    //         orgNote.scrollIntoView()
    //       }
    //     }
    //   }
    // }
  })
}
