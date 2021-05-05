<template>
  <div>
    <v-slide-y-transition>
      <div v-show="menuShow" class="toolbar justify-center align-center">
        <v-btn @click="finish" icon class="ml-6">
          <v-icon size="32">{{ icon.mdiArrowLeft }}</v-icon>
        </v-btn>
        <v-spacer />
        <v-btn @click="searchClick" icon class="mr-6">
          <v-icon size="32">{{ icon.mdiMagnify }}</v-icon>
        </v-btn>
      </div>
    </v-slide-y-transition>
    <v-slide-y-reverse-transition>
      <div v-show="menuShow" class="menu">
        <div class="text-center pt-3">{{ readSection }}({{ progress / 10 }}%)</div>
        <div class="d-flex progress-wrapper pb-3">
          <v-btn small :disabled="!navigation" @click="prevSection">上一章</v-btn>
          <v-slider
            @end="change2"
            @mouseup="change(true)"
            @mousedown="change(false)"
            :disabled="!bookAvailable"
            max="1000"
            min="0"
            hide-details
            v-model="progress"
            class="px-1"
          />
          <v-btn small :disabled="!navigation" @click="nextSection">下一章</v-btn>
        </div>
        <div class="d-flex flex-row menu-item">
          <v-spacer end="change" v-for="(menuIcon, i) in menuIcons" :key="i" class="d-flex justify-center align-center">
            <v-btn @click="menuIcon.handle()" icon>
              <v-icon size="28">{{ menuIcon.icon }}</v-icon>
            </v-btn>
          </v-spacer>
        </div>
      </div>
    </v-slide-y-reverse-transition>
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
        menuIcons: [
          {
            icon: icon.mdiFormatListBulleted,
            handle: () => {
              if (this.bookAvailable) {
                this.updateMenuShow(false)
                this.updateSidebarShow(true)
              }
            }
          },
          {
            icon: icon.mdiWhiteBalanceSunny,
            handle: () => {
              this.updateMenuShow(false)
              this.updateBgSettingShow(true)
            }
          },
          {
            icon: icon.mdiFormatSize,
            handle: () => {
              this.updateMenuShow(false)
              this.updateFontSettingShow(true)
            }
          }
        ],
        isChange: false,
        promise: null
      }
    },
    computed: {
      ...mapGetters(['menuShow']),
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
      ...mapMutations([
        'updateReadProgress',
        'updateSection',
        'updateMenuShow',
        'updateSidebarShow',
        'updateFontSettingShow',
        'updateBgSettingShow',
        'updateSearchShow'
      ]),
      ...mapActions(['display', 'refreshLocation']),
      searchClick() {
        this.updateMenuShow(false)
        this.updateSearchShow(true)
      },
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
        if (!this.promise) {
          if (this.section > 1) {
            this.updateSection(this.section - 1)
            this.displaySection()
          }
        }
      },
      nextSection() {
        if (!this.promise) {
          if (this.section < this.navigation.length) {
            this.updateSection(this.section + 1)
            this.displaySection()
          }
        }
      },
      displaySection() {
        this.displaySectionPromise().then(() => {
          setTimeout(() => {
            this.promise = null
          }, 150)
        })
      },
      displaySectionPromise() {
        let vueInstance = this
        this.promise = new Promise(function (resolve, reject) {
          vueInstance.display(vueInstance.navigation[vueInstance.section - 1].href).then(() => {
            vueInstance.refreshLocation([false, true])
            resolve()
          })
        })
        return this.promise
      },
      finish() {
        window.device?.finish()
      }
    }
  }
</script>

<style scoped lang="scss">
  .toolbar {
    width: 100%;
    height: calc(64px + var(--status-bar-height));
    position: absolute;
    display: flex;
    top: 0;
    left: 0;
    padding-top: var(--status-bar-height);
    background: white;
    box-shadow: 0 8px 8px rgba(#000000, 0.15) !important;
  }

  .menu {
    width: 100%;
    position: absolute;
    background: white;
    left: 0;
    bottom: 0;
    box-shadow: 0 -8px 8px rgba(#000000, 0.15) !important;

    .progress-wrapper {
      padding: 5px 3vw;
    }

    .menu-item {
      height: 64px;
      width: 100%;
    }
  }
</style>
