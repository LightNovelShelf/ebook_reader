<template>
  <div>
    <router-view></router-view>
    <div class="menu">
      <v-bottom-navigation grow v-model='value' :value="value" color="primary">
        <template v-for="(menuIcon, i) in menuIcons" >

          <v-btn @click="menuIcon.handle()" :key="i">
            <span>{{ menuIcon.text }}</span>

            <v-icon>{{ menuIcon.icon }}</v-icon>
          </v-btn>
        </template>

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
        value: 1,
        menuIcons: [
          {
            icon: icon.mdiFormatListBulleted,
            handle: function () {},
            text: '首页'
          },
          {
            icon: icon.mdiFormatListBulleted,
            handle: function () {},
            text: '书架'
          },
          {
            icon: icon.mdiFormatListBulleted,
            handle: function () {},
            text: '设置'
          }
        ]
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
  }
</style>
