export default {
  state: {
    book: null,
    cover: null,
    navigation: null,
    metadata:null,
    bookAvailable:false,
  },
  mutations: {
    updateBook(state, payload) {
      state.book = payload
    },
    updateCover(state, payload) {
      state.cover = payload
    },
    updateNavigation(state, payload) {
      state.navigation = payload
    },
    updateMetadata(state, payload) {
      state.metadata = payload
    },
    updateBookAvailable(state, payload) {
      state.bookAvailable = payload
    }
  },
  actions: {
    refreshLocation() {
      // const currentLocation = this.book.rendition.currentLocation()
      // if (currentLocation && currentLocation.start) {
      //   const startCfi = currentLocation.start.cfi
      //   if (isSave) saveLocation(this.fileName, startCfi)
      //   if (this.bookAvailable) {
      //     if (isSection) {
      //       const endCfi = new EpubCFI(currentLocation.end.cfi)
      //       let temp = 0
      //       let flag = true
      //       for (let i = 0; i < this.navigation.length; ++i) {
      //         const navItem = this.navigation[i]
      //         let href = navItem.href
      //         if (href.indexOf('#') !== -1) href = href.split('#')[0]
      //         if (navItem.cfi) {
      //           temp = global.ePubCfi.compare(navItem.cfi, endCfi)
      //         } else {
      //           const index = this.book.spine.spineItems.findIndex(item => item.href === href)
      //           if (index > endCfi.spinePos) {
      //             temp = 1
      //           } else {
      //             temp = -1
      //           }
      //         }
      //         if (flag) {
      //           flag = false
      //           if (temp === 1) {
      //             this.section = 0
      //             break
      //           }
      //         } else {
      //           if (i === this.navigation.length - 1) {
      //             this.section = i + 1
      //           }
      //           if (temp === 1) {
      //             this.section = i
      //             break
      //           }
      //         }
      //       }
      //     }
      //     if (isProgress) {
      //       this.progress = Math.floor(currentLocation.start.percentage * 1000)
      //     }
      //   }
      // }
    }
  },
  modules: {}
}
