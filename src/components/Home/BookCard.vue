<template>
  <component :is="'router-link'" :to="{ name: 'Read', params: { path: book['book_path'] } }" tag="div">
    <v-card ripple>
      <v-img :aspect-ratio="2 / 3" :src="getPath(book['book_cover'])">
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular indeterminate color="blue-grey lighten-3"></v-progress-circular>
          </v-row>
        </template>
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
  </component>
</template>

<script>
  import { ImagePath } from '@/util/read'

  export default {
    name: 'BookCard',
    props: {
      book: Object
    },
    methods: {
      getPath(name) {
        if (name.startsWith('http')) return name
        return 'file://' + ImagePath + '/' + name
      }
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
