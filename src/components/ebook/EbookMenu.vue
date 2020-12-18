<template>
  <v-toolbar height="64" class="menu">
    <div class="d-flex flex-row menuItem">
      <v-spacer v-for="(menuIcon, i) in menuIcons" :key="i" class="d-flex justify-center">
        <v-btn icon>
          <v-icon size="32">{{ menuIcon }}</v-icon>
        </v-btn>
      </v-spacer>
    </div>
  </v-toolbar>
</template>

<script>
  import { icon } from '@/plugins/vuetify'

  export default {
    name: 'EbookMenu',
    data() {
      return {
        icon: icon,
        menuIcons: [icon.mdiFormatListBulleted, icon.mdiWhiteBalanceSunny, icon.mdiFormatSize]
      }
    }
  }
</script>

<style scoped lang="scss">
  .menu {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    box-shadow: 0 -8px 8px rgba($color: #000000, $alpha: 0.15) !important;

    .menuItem {
      width: 100%;
    }
  }
</style>
