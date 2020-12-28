<template>
  <v-slide-x-transition>
    <div class="slide-content" v-show="sidebarShow" v-if="bookAvailable">
      <v-tabs grow slider-size="1" v-model="tab">
        <v-tab>目录</v-tab>
        <v-tab>书签</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-list class="overflow-auto">
            <template v-for="(item, index) in navigation">
              <v-list-item
                color="primary"
                :input-value="section === index + 1"
                link
                :key="item.label"
                @click="selectSection(item.href, index)"
              >
                <div class="pl-3">{{ item.label }}</div>
              </v-list-item>
              <v-divider :key="index" />
            </template>
          </v-list>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </v-slide-x-transition>
</template>

<script>
  import { mapActions, mapGetters, mapMutations } from 'vuex'

  export default {
    name: 'EbookSidebar',
    data() {
      return {
        tab: null
      }
    },
    computed: {
      ...mapGetters(['sidebarShow', 'bookAvailable', 'navigation', 'section'])
    },
    methods: {
      ...mapMutations(['updateSidebarShow', 'updateSection']),
      ...mapActions(['display', 'refreshLocation']),
      selectSection(href, index) {
        this.updateSidebarShow(false)
        this.updateSection(index + 1)
        this.display(href).then(() => {
          this.refreshLocation([false, true])
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .slide-content {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 300px;
    max-width: 90%;
    background: white;
    box-shadow: 8px 0 8px rgba(#000000, 0.15);

    .overflow-auto {
      scrollbar-width: none;
      height: calc(100vh - 48px);

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
</style>
