<template>
  <naive-icon v-bind="$attrs">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path fill="currentColor" :d="path" />
    </svg>
  </naive-icon>
</template>

<script>
import { computed, defineComponent } from 'vue'
import { NIcon as naiveIcon } from 'naive-ui'

export default defineComponent({
  name: 'Icon',
  components: {
    naiveIcon
  },
  computed: {
    path() {
      return this.$slots.default ? this.$slots.default()[0].children.trim() : ''
    }
  },
  setup() {
    return {}
  }
})
</script>

<style scoped></style>
