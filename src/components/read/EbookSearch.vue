<template>
  <div class="ebook-search-wrapper" v-show="searchShow">
    <div class="search-wrapper">
      <v-text-field
        background-color="#8B9193"
        class="search-input"
        flat
        hide-details
        dense
        :prepend-inner-icon="icon.mdiMagnify"
        v-model="searchText"
        @keyup.enter.exact="search()"
        solo-inverted
      >
        <template v-slot:label><span style="color: #cccccc">搜索全文</span></template>
        <template v-slot:append-outer>
          <v-icon @click="cancel" size="24">{{ icon.mdiCancel }}</v-icon>
        </template>
      </v-text-field>
    </div>
    <div class="search-list">
      <div
        class="search-item"
        v-for="(item, index) in searchList"
        :key="index"
        v-html="item.excerpt"
        @click="displaySelect(item.cfi)"
      ></div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapMutations, mapState } from 'vuex'
  import { icon } from '@/plugins/vuetify'

  export default {
    name: 'EbookSearch',
    data() {
      return {
        icon: icon,
        searchList: null,
        searchText: null
      }
    },
    computed: {
      ...mapState('read',['searchShow', 'book'])
    },
    methods: {
      ...mapMutations('read',['updateSearchShow']),
      ...mapActions('read',['display', 'refreshLocation']),
      cancel() {
        this.updateSearchShow(false)
      },
      doSearch(q) {
        return Promise.all(
          this.book.spine.spineItems.map((item) =>
            item.load(this.book.load.bind(this.book)).then(item.find.bind(item, q)).finally(item.unload.bind(item))
          )
        ).then((results) => Promise.resolve([].concat.apply([], results)))
      },
      search() {
        if (this.searchText && this.searchText.length > 0) {
          this.doSearch(this.searchText).then((list) => {
            this.searchList = list
            this.searchList.map((item) => {
              item.excerpt = item.excerpt.replace(this.searchText, `<span class="selected">${this.searchText}</span>`)
              return item
            })
          })
        } else {
          this.searchList = null
        }
      },
      displaySelect(cfi) {
        this.display(cfi).then(() => {
          this.refreshLocation([false, true, true])
        })
        this.updateSearchShow(false)
        this.book.rendition.annotations.highlight(cfi)
      }
    }
  }
</script>

<style scoped lang="scss">
  .ebook-search-wrapper {
    width: 100%;
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;
    //display: flex;
    //flex-direction: column;
    background-color: white;

    .search-wrapper {
      position: absolute;
      left: 0;
      top: 0;

      width: 100%;
      padding: 0 10px;
      margin: 10px 0;
    }

    .search-list {
      margin-top: 58px;
      height: calc(100vh - 58px);
      overflow: auto;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }

      .search-item {
        //line-height: px2rem(16);
        padding: 5px 10px;
        box-sizing: border-box;
        border-bottom: 1px solid rgba(black, 0.15);
      }
    }
  }
</style>
