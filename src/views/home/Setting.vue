<template>
  <v-container style="max-width: 700px">
    <v-card tile>
      <v-list>
        <v-list-item link @click="() => (showChoseVersion = true)">
          <v-list-item-icon>
            <v-icon>{{ icon.mdiBookOpenBlankVariant }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <div class="d-flex align-center">
              <v-list-item-title>设置epub.js</v-list-item-title>
              <v-icon size="32">{{ icon.mdiChevronRight }}</v-icon>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>

    <v-dialog max-width="500" v-model='showChoseVersion'>
      <epub-js-setting/>
    </v-dialog>

  </v-container>
</template>

<script>
  import { icon } from '@/plugins/vuetify'
  import EpubJsSetting from '@/components/home/setting/EpubJsSetting'

  export default {
    name: 'Setting',
    components: { EpubJsSetting },
    data() {
      return {
        icon: icon,
        showChoseVersion: false
      }
    }
  }
</script>

<style scoped></style>
