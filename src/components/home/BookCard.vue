<template>
  <div class="full-size" :style="property">
    <aspect-ratio class="box" ar="2:3" v-bind="$attrs">
      <img src="https://img.acgdmzy.com:45112/images/2021/10/05/0d1e85517e85.md.webp" alt="" />
    </aspect-ratio>
    <div class="text-wrapper">
      <div class="title">
        魔弹之王与冻涟的雪姬魔弹之王与冻涟的雪姬魔弹之王与冻涟的雪姬魔弹之王与冻涟的雪姬魔弹之王与冻涟的雪姬魔弹之王与冻涟的雪姬
      </div>
      <span class="info">已读0%</span>
    </div>
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
          '--border-radius': theme.value.borderRadius,
          '--opacity-2': theme.value.opacity2
        }
      })
    }
  }
})
</script>

<style scoped lang="scss">
@import 'src/assets/style/bookCard';
</style>
