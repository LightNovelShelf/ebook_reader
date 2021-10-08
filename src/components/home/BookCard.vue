<template>
  <aspect-ratio :style="property" class="box" ar="2:3" v-bind="$attrs">
    <img src="https://img.acgdmzy.com:45112/images/2021/10/05/0d1e85517e85.md.webp" alt="" />
  </aspect-ratio>
  <div class="full-height" style="height: 4em; display: flex; align-items: center">
    <div class="title">
      魔弹之王与冻涟的雪姬魔弹之王与冻涟的雪姬魔弹之王与冻涟的雪姬魔弹之王与冻涟的雪姬魔弹之王与冻涟的雪姬魔弹之王与冻涟的雪姬
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

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.title {
}
</style>
