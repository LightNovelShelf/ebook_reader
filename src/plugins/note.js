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
          document.appendChild(cover)
          let bodyRect = document.getBoundingClientRect()
          orgNote.style.display = 'inline'
          let origRect = orgNote.getBoundingClientRect()
          console.log(origRect)
          window.note = orgNote
          orgNote.style.display = 'none'
          // footnote 宽度小于body宽度80%
          let maxWidth = bodyRect.width * 0.8
          let width = origRect.width > maxWidth ? maxWidth : origRect.width
          let height = Math.ceil(origRect.height)
          a.appendChild(note)
          note.style.minWidth = `${Math.ceil(width)}px`
          note.style.maxWidth = `${Math.ceil(maxWidth)}px`
          note.style.transform = 'scale(0.2)'
          setTimeout(function () {
            note.style.transform = 'scale(1)'
          }, 0)
          note.style.display = 'block'
          note.style.left = `${-(width - 12) / 2}px`
          // 有scale，这里为了触发动画，无法用动画后的位置判断，必须使用中心点
          let noteRect = note.getBoundingClientRect()
          let center = {
            x: noteRect.right - noteRect.width / 2,
            y: noteRect.bottom - noteRect.height / 2
          }
          if (bodyRect.left + 15 > center.x - width / 2) {
            note.style.left = `${-(width - 12) / 2 + bodyRect.left + 15 - (center.x - width / 2)}px`
          } else if (bodyRect.right - 15 < center.x + width / 2) {
            note.style.left = `${-(width - 12) / 2 + bodyRect.right - 15 - (center.x + width / 2)}px`
          }
          if (bodyRect.bottom - 15 <= center.y + height / 2) {
            note.style.bottom = 16 + 10 + 'px'
          }
          cover.onclick = function (ce) {
            ce.preventDefault()
            note.style.transform = 'scale(0.2)'
            setTimeout(() => {
              cover.remove()
              note.style.display = 'none'
              cover = null
              // note = null
            }, 210)
          }
        }
      }
    } else {
      let isFootnote = href.startsWith('#')
      if (isFootnote) {
        let orgNote = document.querySelector(href)
        if (orgNote) {
          a.onclick = function (e) {
            e.preventDefault()
            orgNote.scrollIntoView()
          }
        }
      } else {
        a.onclick = function (e) {
          e.preventDefault()
          window.open(href.startsWith('http') ? href : 'https://' + href, '_blank')
        }
      }
    }
  })
}
