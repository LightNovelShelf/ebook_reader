<template>
  <div class="menu">
    <div class="text-center pt-3">{{ readSection }}({{ progress / 10 }}%)</div>
    <div class="d-flex progress-wrapper pb-3">
      <v-btn :disabled="!navigation" @click="prevSection">上一章</v-btn>
      <v-slider
        @end="change2"
        @mouseup="change(true)"
        @mousedown="change(false)"
        :disabled="!bookAvailable"
        max="1000"
        min="0"
        hide-details
        v-model="progress"
        class="px-3"
      />
      <v-btn :disabled="!navigation" @click="nextSection">下一章</v-btn>
    </div>
    <div class="d-flex flex-row menu-item">
      <v-spacer end="change" v-for="(menuIcon, i) in menuIcons" :key="i" class="d-flex justify-center align-center">
        <v-btn icon>
          <v-icon size="32">{{ menuIcon }}</v-icon>
        </v-btn>
      </v-spacer>
    </div>
  </div>
</template>

<script>
  import { icon } from '@/plugins/vuetify'
  import { mapActions, mapGetters, mapMutations } from 'vuex'

  export default {
    name: 'EbookMenu',
    data() {
      return {
        icon: icon,
        menuIcons: [icon.mdiFormatListBulleted, icon.mdiWhiteBalanceSunny, icon.mdiFormatSize],
        isChange: false
      }
    },
    computed: {
      bookAvailable() {
        return this.$store.state.read.bookAvailable
      },
      readSection() {
        return this.$store.getters.readSection
      },
      book() {
        return this.$store.state.read.book
      },
      navigation() {
        return this.$store.state.read.navigation
      },
      section() {
        return this.$store.state.read.section
      },
      progress: {
        get() {
          return this.$store.state.read.readProgress
        },
        set(value) {
          this.updateReadProgress(value)
          if (this.isChange) {
            const cfi = this.book.locations.cfiFromPercentage(value / 1000)
            this.display(cfi).then(() => {
              this.isChange = false
              this.refreshLocation([true, false])
            })
          }
        }
      }
    },
    methods: {
      ...mapMutations(['updateReadProgress', 'updateSection']),
      ...mapActions(['display', 'refreshLocation']),
      change(value) {
        this.isChange = value
      },
      change2(num) {
        const cfi = this.book.locations.cfiFromPercentage(num / 1000)
        this.display(cfi).then(() => {
          this.refreshLocation([true, false])
        })
      },
      prevSection() {
        if (this.section > 0) {
          this.updateSection(this.section - 1)
          this.displaySection()
        }
      },
      nextSection() {
        if (this.section < this.navigation.length) {
          this.updateSection(this.section + 1)
          this.displaySection()
        }
      },
      displaySection() {
        console.log(this.navigation[this.section - 1].href)
        this.display(this.navigation[this.section - 1].href).then(() => {
          this.refreshLocation([false, true])
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .menu {
    width: 100%;
    position: absolute;
    background: white;
    left: 0;
    bottom: 0;
    box-shadow: 0 -8px 8px rgba(#000000, 0.15) !important;

    .progress-wrapper {
      padding: 5px 4vw;
    }

    .menu-item {
      height: 64px;
      width: 100%;
    }
  }
</style>
