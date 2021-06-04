<template>
  <div>
    <navigation>
      <router-view style="padding-bottom: 56px"></router-view>
    </navigation>

    <div class="menu">
      <v-bottom-navigation grow :value="activeTab" color="primary">
        <router-link :to="menuIcon.path" custom v-slot="{ navigate }" v-for="(menuIcon, i) in menuIcons" :key="i">
          <v-btn @click="navigate">
            <span>{{ menuIcon.text }}</span>
            <v-icon>{{ menuIcon.icon }}</v-icon>
          </v-btn>
        </router-link>
      </v-bottom-navigation>
    </div>
  </div>
</template>

<script>
  import { icon } from '@/plugins/vuetify'

  export default {
    name: 'Home',
    data() {
      return {
        menuIcons: [
          {
            icon: icon.mdiBookshelf,
            text: '首页',
            path: '/'
          },
          {
            icon: icon.mdiBookshelf,
            text: '书架',
            path: '/bookshelf'
          },
          {
            icon: icon.mdiCog,
            text: '设置',
            path: '/setting'
          }
        ]
      }
    },
    computed: {
      activeTab() {
        return this.menuIcons.findIndex((item) => item.path === this.$route.path)
      }
    }
  }
</script>

<style scoped lang="scss">
  .menu {
    width: 100%;
    position: fixed;
    background: white;
    left: 0;
    bottom: 0;
    border-top: 1px solid rgba(#000000, 0.15);

    ::v-deep .v-btn {
      height: inherit !important;
    }
  }
</style>
