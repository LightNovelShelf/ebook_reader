<template>
  <div @click="loadBook(book)">
    <v-card ripple>
      <v-img :aspect-ratio="2 / 3" :src="coverCache[book['book_cover']]">
<!--        <template v-slot:placeholder>-->
<!--          <v-row class="fill-height ma-0" align="center" justify="center">-->
<!--            <v-progress-circular indeterminate color="blue-grey lighten-3"></v-progress-circular>-->
<!--          </v-row>-->
<!--        </template>-->
      </v-img>
    </v-card>
    <div class="book-name-wrapper">
      <div class="pa-0 d-flex book-name">
        <div class="d-flex fill-height flex-column justify-center">
          <div class="category-text">
            {{ book['book_title'] }}
          </div>
        </div>
      </div>
      <div class="book-info">已读0%</div>
    </div>
  </div>
</template>

<script>
  import { getImagePath } from '@/util/read'
  import { mapGetters } from 'vuex'

  export default {
    name: 'BookCard',
    props: {
      book: Object,
      disable: Boolean,
    },
    computed: {
      ...mapGetters(['coverCache'])
    },
    methods: {
      loadBook(book) {
        if(this.disable) return
        window.device?.openBook(book['book_title'], book['book_path'])
        this.$emit('load-book', book)
      }
    },
    created() {
      getImagePath(this.book['book_cover'], this.book['book_path'])
    }
  }
</script>

<style scoped lang="scss">
  @import '../../assets/styles/mixin';

  .book-name-wrapper {
    margin-top: 6px;

    .book-name {
      height: 40px;
      font-size: 0.8rem;
    }

    .book-info {
      font-size: 0.6rem;
      opacity: 0.7;
    }
  }

  .category-text {
    @include ellipsis2(2);
  }
</style>
