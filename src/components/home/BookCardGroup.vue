<template>
  <aspect-ratio :style="property" class="box" ar="2:3" v-bind="$attrs">
    <div style="padding: 3px; box-sizing: border-box" class="full-size">
      <div class="full-size" style="background-color: #e9e5e5">
        <div class="full-size" style="box-sizing: border-box; padding: 6px 3px">
          <n-grid x-gap="6" y-gap="8" cols="2">
            <n-gi>
              <aspect-ratio ar="2:3" class="image-wrapper">
                <img src="https://img.acgdmzy.com:45112/images/2021/10/05/0d1e85517e85.md.webp" alt="" />
              </aspect-ratio>
            </n-gi>
            <n-gi>
              <aspect-ratio ar="2:3" class="image-wrapper">
                <img src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" alt="" />
              </aspect-ratio>
            </n-gi>
            <n-gi>
              <aspect-ratio ar="2:3" class="image-wrapper"></aspect-ratio>
            </n-gi>
            <n-gi>
              <aspect-ratio ar="2:3" class="image-wrapper"></aspect-ratio>
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
      property: computed(() => {
        return {
          '--border-color': theme.value.borderColor,
          '--border-radius': theme.value.borderRadius
        }
      })
    }
  }
})
</script>

<style scoped lang="scss">
.box {
  border: 1px solid var(--border-color);
  border-color: var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%);
}

.image-wrapper {
  background-color: white;
  border-radius: var(--border-radius);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    // 锯齿严重
    // image-rendering: -webkit-optimize-contrast;
    // backface-visibility: hidden;
  }
}
</style>
