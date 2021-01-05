<template>
  <v-container>
    <v-app-bar dense flat color="white" app>
      <v-app-bar-title class="text-caption">阅读时长<span class="text-h6">0</span>小时</v-app-bar-title>
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
      <v-row>
        <template v-if="!gid">
          <v-col cols="4" sm="4" md="3" lg="2" v-for="book in BookList" :key="book.gid || book.book_path">
            <book-card v-if="!book.gid" :book="book"></book-card>
            <book-group-card v-else :books="book"></book-group-card>
          </v-col>
        </template>
        <template v-else>
          <v-col cols="4" sm="4" md="3" lg="2" v-for="book in findGroup(gid).data" :key="book['book_path']">
            <book-card :book="book"></book-card>
          </v-col>
        </template>
      </v-row>
    </v-main>
  </v-container>
</template>

<script>
  import { icon } from '@/plugins/vuetify'
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
  import BookCard from '@/components/Home/BookCard'
  import BookGroupCard from '@/components/Home/BookGroupCard'

  export default {
    name: 'Bookshelf',
    components: { BookGroupCard, BookCard },
    data() {
      return {
        showMoveDialog: false,
        showGroupEditDialog: false,
        icon: icon
      }
    },
    props: {
      gid: {
        type: String,
        default: null
      }
    },
    computed: {
      ...mapGetters(['BookList', 'findGroup']),
      books() {
        return this.BookList.find((item) => item.gid === this.gid)
      }
    },
    methods: {
      openBook() {
        console.log('从文件管理器选择一本书并打开书籍')
        window.device?.openBook()
      },
      openDir() {
        console.log('从文件管理器导入一个文件夹')
        window.device?.openDir()
      }
    },
    activated() {
      console.log('activated')
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
</style>

<style lang='scss'>
  .move {
  &.flip-list-move {
     transition: all 0.5s;
   }

  &.flip-list-enter-active,
  &.flip-list-leave-active {
     transition: all 0.5s;
   }

  &.flip-list-leave-active {
     position: absolute;
   }

  &.flip-list-enter,
  &.flip-list-leave-to {
     opacity: 0;
     transform: scale(0);
     max-width: 0;
     flex-basis: 0;
   }
  }
</style>
