<template>
  <aspect-ratio :style="boxStyle" ar="2:3" v-bind="$attrs">
    <div style="padding: 3px; box-sizing: border-box" class="full-size">
      <div class="full-size" style="background-color: #e9e5e5">
        <div class="full-size" style="box-sizing: border-box; padding: 5px 3px">
          <n-grid x-gap="6" y-gap="10" cols="2">
            <n-gi>
              <aspect-ratio ar="2:3" class="white">
                <img
                  src="https://img.acgdmzy.com:45112/images/2021/10/05/0d1e85517e85.md.webp"
                  alt=""
                  style="width: 100%"
                />
              </aspect-ratio>
            </n-gi>
            <n-gi>
              <aspect-ratio ar="2:3" class="white"></aspect-ratio>
            </n-gi>
            <n-gi>
              <aspect-ratio ar="2:3" class="white"></aspect-ratio>
            </n-gi>
            <n-gi>
              <aspect-ratio ar="2:3" class="white"></aspect-ratio>
            </n-gi>
          </n-grid>
        </div>
      </div>
    </div>
  </aspect-ratio>
  <div class="full-height" style="height: 4em; display: flex; align-items: center">
    <div> 魔弹之王与冻涟的雪姬 </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useThemeVars } from 'naive-ui'

export default defineComponent({
  name: 'BookCardGroup',
  setup() {
    const theme = useThemeVars()

    return {
      boxStyle: computed(() => {
        return {
          border: `1px solid ${theme.value.borderColor}`,
          borderRadius: `${theme.value.borderRadius}`,
          borderColor: `${theme.value.borderColor}`,
          boxShadow: '0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)'
        }
      })
    }
  }
})
</script>

<style scoped>
.white {
  background-color: white;
}

img {
  image-rendering: -webkit-optimize-contrast;
}
</style>
