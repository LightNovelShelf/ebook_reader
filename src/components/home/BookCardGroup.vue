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
  <div class="text-wrapper">
    <div class="title">
      魔弹之王与冻涟的雪姬魔弹之王与冻涟的雪姬魔弹之王与冻涟的雪姬魔弹之王与冻涟的雪姬魔弹之王与冻涟的雪姬魔弹之王与冻涟的雪姬
    </div>
    <span class="info">共4本</span>
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
@import 'src/assets/style/bookCard';

.image-wrapper {
  background-color: white;
  border-radius: var(--border-radius);
}
</style>
