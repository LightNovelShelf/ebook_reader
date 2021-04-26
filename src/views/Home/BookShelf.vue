<template>
  <v-container>
    <v-app-bar dense flat color="white" app>
      <v-app-bar-title class="text-caption">阅读时长<span class="text-h6">{{readTime}}</span>小时</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn text icon small class="mr-3">
        <v-icon>{{ icon.mdiMagnify }}</v-icon>
      </v-btn>

      <v-menu bottom left offset-y close-on-click close-on-content-click transition="slide-y-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon small v-on="on" v-bind="attrs">
            <v-icon small>{{ icon.mdiDotsVertical }}</v-icon>
          </v-btn>
        </template>

        <v-list dense>
          <v-list-item dense @click="openBook">打开书籍</v-list-item>
          <v-list-item dense @click="openDir">打开文件夹</v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <transition-group tag="div" type="transition" name="flip-list" class="move">
          <template v-if="!gid">
            <v-col cols="4" sm="4" md="3" lg="2" v-for="book in BookList" :key="book.gid || book.book_path">
              <book-card v-on:load-book="loadBook" v-if="!book.gid" :book="book"></book-card>
              <book-group-card v-else :books="book"></book-group-card>
            </v-col>
          </template>
          <template v-else>
            <v-col cols="4" sm="4" md="3" lg="2" v-for="book in books.data" :key="book['book_path']">
              <book-card v-on:load-book="loadBook" :book="book"></book-card>
            </v-col>
          </template>
      </transition-group>
    </v-main>
  </v-container>
</template>

<script>
  import { icon } from '@/plugins/vuetify'
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
  import BookCard from '@/components/Home/BookCard'
  import BookGroupCard from '@/components/Home/BookGroupCard'
  import { getReadTime, lastUpdateFromNow, saveReadTime } from '@/util/read'

  export default {
    name: 'Bookshelf',
    components: { BookGroupCard, BookCard },
    data() {
      return {
        showMoveDialog: false,
        showGroupEditDialog: false,
        icon: icon,
        time: getReadTime(),
        task: null,
      }
    },
    props: {
      gid: {
        type: String,
        default: null
      }
    },
    computed: {
      ...mapGetters(['BookList']),
      books() {
        return this.BookList.find((item) => item.gid === this.gid)
      },
      readTime(){
        return lastUpdateFromNow(this.time)
      }
    },
    methods: {
      ...mapActions(['saveBookList']),
      ...mapMutations(['updateBookList']),
      openBook() {
        console.log('从文件管理器选择一本书并打开书籍')
        window.device?.choiceBook()
      },
      openDir() {
        console.log('从文件管理器导入一个文件夹')
        window.device?.choiceDir()
      },
      loadBook(book) {
        let vue = this
        function moveToFirst(progress) {
          if (vue.gid) {
            let index = vue.BookList.findIndex((item) => item.gid === vue.gid)
            let temp = [vue.books, ...vue.BookList]
            temp.splice(index + 1, 1)

            index = temp[0].data.findIndex((item) => item['book_path'] === book['book_path'])
            let temp2 = [book,...temp[0].data]
            temp2.splice(index + 1, 1)
            temp[0].data = temp2

            vue.updateBookList(temp)
          } else {
            const index = vue.BookList.findIndex((item) => item['book_path'] === book['book_path'])
            let temp = [book, ...vue.BookList]
            temp.splice(index + 1, 1)
            vue.updateBookList(temp)
          }
        }
        window.device ? (window.moveToFirst = moveToFirst) : moveToFirst()
      },
    },
    mounted() {
      this.task = setInterval(() => {
        this.time = getReadTime()
      }, 1000)
    },
    beforeDestroy() {
      if (this.task) {
        clearInterval(this.task)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../../assets/styles/mixin';

  .card-box {
    position: relative;
    cursor: pointer;
    .overlay {
      bottom: 60px;
      align-items: flex-start !important;
      justify-content: flex-end !important;
      z-index: 3 !important;

      .btn-select {
        margin-top: -16px;
        margin-right: -10px;
      }
    }
    .category-text {
      @include ellipsis2(2);
    }
  }

  .move {
    display: flex;
    flex-wrap: wrap;
    flex: 1 1 auto;

    .flip-list-move {
      transition: all 0.5s;
    }

    .flip-list-enter-active,
    .flip-list-leave-active {
      transition: all 0.5s;
    }

    .flip-list-leave-active {
      position: absolute;
    }

    .flip-list-enter,
    .flip-list-leave-to {
      opacity: 0;
      transform: scale(0);
      max-width: 0;
      flex-basis: 0;
    }
  }
</style>
